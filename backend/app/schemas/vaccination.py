from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class VaccineTypeBase(BaseModel):
    name: str
    species: Optional[str] = None
    description: Optional[str] = None
    validity_days: int

class VaccineTypeCreate(VaccineTypeBase):
    pass

class VaccineTypeInDBBase(VaccineTypeBase):
    id: int
    clinic_id: int

    class Config:
        from_attributes = True

class VaccineType(VaccineTypeInDBBase):
    pass

class VaccinationBase(BaseModel):
    notes: Optional[str] = None
    pet_id: int
    vaccine_type_id: int
    vet_id: int
    administered_date: Optional[datetime] = None
    # next_due_date will be calculated by the engine unless overridden
    next_due_date: Optional[datetime] = None

class VaccinationCreate(VaccinationBase):
    pass

class VaccinationInDBBase(VaccinationBase):
    id: int
    clinic_id: int
    administered_date: datetime
    next_due_date: datetime

    class Config:
        from_attributes = True

class Vaccination(VaccinationInDBBase):
    vaccine_type: Optional[VaccineType] = None
