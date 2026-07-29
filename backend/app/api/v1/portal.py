from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.api import deps
from app.models.clinic import Clinic
from app.models.pet import Owner
from app.models.pet import Pet
from app.models.appointment import Appointment
from app.schemas.appointment import AppointmentCreate, Appointment as AppointmentSchema

router = APIRouter()

@router.get("/owner/{phone}")
def get_owner_portal_data(phone: str, db: Session = Depends(deps.get_db)) -> Any:
    """
    Public endpoint for owners to view their pets (Lookup by phone).
    """
    owner = db.query(Owner).filter(Owner.phone == phone).first()
    if not owner:
        raise HTTPException(status_code=404, detail="Owner not found")
        
    pets = db.query(Pet).filter(Pet.owner_id == owner.id).all()
    
    # In a real app, we would join vaccinations and medical records here.
    return {
        "owner": {
            "first_name": owner.first_name,
            "last_name": owner.last_name,
            "phone": owner.phone
        },
        "pets": [{"id": p.id, "name": p.name, "species": p.species, "breed": p.breed} for p in pets]
    }

@router.post("/book", response_model=AppointmentSchema)
def public_book_appointment(
    appointment_in: AppointmentCreate,
    clinic_id: int,
    db: Session = Depends(deps.get_db)
) -> Any:
    """
    Public endpoint for booking an appointment.
    """
    clinic = db.query(Clinic).filter(Clinic.id == clinic_id).first()
    if not clinic:
        raise HTTPException(status_code=404, detail="Clinic not found")
        
    appointment = Appointment(
        title=appointment_in.title,
        start_time=appointment_in.start_time,
        end_time=appointment_in.end_time,
        notes=appointment_in.notes,
        status="SCHEDULED",
        pet_id=appointment_in.pet_id,
        owner_id=appointment_in.owner_id,
        vet_id=appointment_in.vet_id,
        clinic_id=clinic.id
    )
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment
