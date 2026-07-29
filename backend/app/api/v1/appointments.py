from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.models.appointment import Appointment
from app.models.user import User
from app.schemas.appointment import Appointment as AppointmentSchema, AppointmentCreate, AppointmentUpdate

router = APIRouter()

@router.get("/", response_model=List[AppointmentSchema])
def read_appointments(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve appointments.
    """
    appointments = db.query(Appointment).filter(Appointment.clinic_id == current_user.clinic_id).offset(skip).limit(limit).all()
    return appointments

@router.post("/", response_model=AppointmentSchema)
def create_appointment(
    *,
    db: Session = Depends(deps.get_db),
    appointment_in: AppointmentCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create a new appointment.
    """
    appointment = Appointment(
        **appointment_in.model_dump(),
        clinic_id=current_user.clinic_id
    )
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment

@router.put("/{id}", response_model=AppointmentSchema)
def update_appointment(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    appointment_in: AppointmentUpdate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update an appointment.
    """
    appointment = db.query(Appointment).filter(Appointment.id == id, Appointment.clinic_id == current_user.clinic_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
        
    update_data = appointment_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(appointment, field, value)
        
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment
