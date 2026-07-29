from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Owner(Base):
    __tablename__ = "owners"
    
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    phone = Column(String)
    email = Column(String)
    address = Column(String)
    
    clinic_id = Column(Integer, ForeignKey("clinics.id"))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Pet(Base):
    __tablename__ = "pets"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    species = Column(String) # Dog, Cat, Bird
    breed = Column(String)
    date_of_birth = Column(DateTime)
    gender = Column(String)
    color = Column(String)
    photo_url = Column(String)
    
    owner_id = Column(Integer, ForeignKey("owners.id"))
    clinic_id = Column(Integer, ForeignKey("clinics.id"))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
