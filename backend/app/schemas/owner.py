from typing import Optional
from pydantic import BaseModel, EmailStr
from datetime import datetime

class OwnerBase(BaseModel):
    first_name: str
    last_name: str
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None

class OwnerCreate(OwnerBase):
    pass

class OwnerUpdate(OwnerBase):
    first_name: Optional[str] = None
    last_name: Optional[str] = None

class OwnerInDBBase(OwnerBase):
    id: int
    clinic_id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class Owner(OwnerInDBBase):
    pass
