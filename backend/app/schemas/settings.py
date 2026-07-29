from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class ClinicBase(BaseModel):
    name: str
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None

class ClinicUpdate(ClinicBase):
    pass

class ClinicInDBBase(ClinicBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class Clinic(ClinicInDBBase):
    pass
