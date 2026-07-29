from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os

from app.models.appointment import Appointment # Ensure table creation
from app.models.inventory import Supplier, InventoryItem
from app.models.push import PushSubscription
from app.api.v1 import auth, owners, pets, medical_visits, vaccinations, notifications, appointments, inventory, billing, dashboard, search, ai, settings, portal, insights, push
from app.tasks.scheduler import start_scheduler, stop_scheduler

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    start_scheduler()
    yield
    # Shutdown
    stop_scheduler()

app = FastAPI(
    title="VCMS API",
    description="Veteriner Klinik Yönetim Sistemi API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to VCMS API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

api_router = APIRouter()
api_router.include_router(auth.router, tags=["auth"])
api_router.include_router(owners.router, prefix="/owners", tags=["owners"])
api_router.include_router(pets.router, prefix="/pets", tags=["pets"])
api_router.include_router(medical_visits.router, prefix="/medical-visits", tags=["medical-visits"])
api_router.include_router(vaccinations.router, prefix="/vaccinations", tags=["vaccinations"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
api_router.include_router(appointments.router, prefix="/appointments", tags=["appointments"])
api_router.include_router(inventory.router, prefix="/inventory", tags=["inventory"])
api_router.include_router(billing.router, prefix="/billing", tags=["billing"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(search.router, prefix="/search", tags=["search"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
api_router.include_router(settings.router, prefix="/settings", tags=["settings"])
api_router.include_router(portal.router, prefix="/portal", tags=["portal"])
api_router.include_router(insights.router, prefix="/insights", tags=["insights"])
api_router.include_router(push.router, prefix="/push", tags=["push"])

app.include_router(api_router, prefix="/api/v1")

# Mount uploads directory for static file serving
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
