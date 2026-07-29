from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class AppointmentBase(BaseModel):
    title: str
    start_time: datetime
    end_time: datetime
    notes: Optional[str] = None
    status: Optional[str] = "SCHEDULED"
    pet_id: Optional[int] = None
    owner_id: Optional[int] = None
    vet_id: int

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentUpdate(AppointmentBase):
    title: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    vet_id: Optional[int] = None

class AppointmentInDBBase(AppointmentBase):
    id: int
    clinic_id: int

    class Config:
        from_attributes = True

class Appointment(AppointmentInDBBase):
    pass
