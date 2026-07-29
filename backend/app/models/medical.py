from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class MedicalVisit(Base):
    __tablename__ = "medical_visits"
    
    id = Column(Integer, primary_key=True, index=True)
    visit_date = Column(DateTime(timezone=True), server_default=func.now())
    weight = Column(Float)
    temperature = Column(Float)
    notes = Column(Text)
    diagnosis = Column(Text)
    treatment = Column(Text)
    attachment_url = Column(String)
    epicrisis_url = Column(String, nullable=True)
    
    pet_id = Column(Integer, ForeignKey("pets.id"))
    vet_id = Column(Integer, ForeignKey("users.id"))
    clinic_id = Column(Integer, ForeignKey("clinics.id"))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class VaccineType(Base):
    __tablename__ = "vaccine_types"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    species = Column(String)
    description = Column(Text)
    validity_days = Column(Integer)
    
    clinic_id = Column(Integer, ForeignKey("clinics.id"))

class Vaccination(Base):
    __tablename__ = "vaccinations"
    
    id = Column(Integer, primary_key=True, index=True)
    administered_date = Column(DateTime(timezone=True), server_default=func.now())
    next_due_date = Column(DateTime(timezone=True))
    notes = Column(Text)
    
    pet_id = Column(Integer, ForeignKey("pets.id"))
    vaccine_type_id = Column(Integer, ForeignKey("vaccine_types.id"))
    vet_id = Column(Integer, ForeignKey("users.id"))
    clinic_id = Column(Integer, ForeignKey("clinics.id"))
