from typing import Any, Dict
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from app.api import deps
from app.models.user import User
from app.models.pet import Owner, Pet
from app.models.appointment import Appointment
from app.models.inventory import InventoryItem
from app.models.billing import Invoice

router = APIRouter()

@router.get("/metrics", response_model=Dict[str, Any])
def get_dashboard_metrics(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve core dashboard metrics.
    """
    clinic_id = current_user.clinic_id
    now = datetime.utcnow()
    
    total_clients = db.query(func.count(Owner.id)).filter(Owner.clinic_id == clinic_id).scalar() or 0
    total_pets = db.query(func.count(Pet.id)).filter(Pet.clinic_id == clinic_id).scalar() or 0
    
    # Upcoming appointments in the next 7 days
    next_week = now + timedelta(days=7)
    upcoming_appointments = db.query(func.count(Appointment.id)).filter(
        Appointment.clinic_id == clinic_id,
        Appointment.start_time >= now,
        Appointment.start_time <= next_week,
        Appointment.status == "SCHEDULED"
    ).scalar() or 0
    
    # Low stock items
    low_stock_items = db.query(func.count(InventoryItem.id)).filter(
        InventoryItem.clinic_id == clinic_id,
        InventoryItem.quantity_in_stock <= InventoryItem.reorder_level
    ).scalar() or 0
    
    # Revenue this month
    start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    monthly_revenue = db.query(func.sum(Invoice.total_amount)).filter(
        Invoice.clinic_id == clinic_id,
        Invoice.issue_date >= start_of_month,
        Invoice.status == "PAID"
    ).scalar() or 0.0

    return {
        "total_clients": total_clients,
        "total_pets": total_pets,
        "upcoming_appointments": upcoming_appointments,
        "low_stock_items": low_stock_items,
        "monthly_revenue": float(monthly_revenue)
    }
