from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class MedicalVisitBase(BaseModel):
    weight: Optional[float] = None
    temperature: Optional[float] = None
    notes: Optional[str] = None
    diagnosis: Optional[str] = None
    treatment: Optional[str] = None
    pet_id: int
    vet_id: int

class MedicalVisitCreate(MedicalVisitBase):
    pass

class MedicalVisitUpdate(MedicalVisitBase):
    pet_id: Optional[int] = None
    vet_id: Optional[int] = None

class MedicalVisitInDBBase(MedicalVisitBase):
    id: int
    visit_date: datetime
    attachment_url: Optional[str] = None
    clinic_id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class MedicalVisit(MedicalVisitInDBBase):
    pass
