from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class PetBase(BaseModel):
    name: str
    species: str
    breed: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    gender: Optional[str] = None
    color: Optional[str] = None
    photo_url: Optional[str] = None
    owner_id: int

class PetCreate(PetBase):
    pass

class PetUpdate(PetBase):
    name: Optional[str] = None
    species: Optional[str] = None
    owner_id: Optional[int] = None

class PetInDBBase(PetBase):
    id: int
    clinic_id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class Pet(PetInDBBase):
    pass
