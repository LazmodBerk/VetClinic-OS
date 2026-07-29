from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float, Boolean
from sqlalchemy.sql import func
from app.db.base_class import Base

class Farm(Base):
    __tablename__ = "farms"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    owner_id = Column(Integer, ForeignKey("owners.id"))
    clinic_id = Column(Integer, ForeignKey("clinics.id"))
    address = Column(Text)
    notes = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Livestock(Base):
    __tablename__ = "livestock"
    
    id = Column(Integer, primary_key=True, index=True)
    tag_number = Column(String, unique=True, index=True) # Ear tag
    name = Column(String, nullable=True)
    species = Column(String) # Cow, Sheep, etc.
    breed = Column(String)
    gender = Column(String)
    birth_date = Column(DateTime(timezone=True), nullable=True)
    
    farm_id = Column(Integer, ForeignKey("farms.id"))
    clinic_id = Column(Integer, ForeignKey("clinics.id"))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class InseminationRecord(Base):
    __tablename__ = "insemination_records"
    
    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime(timezone=True), server_default=func.now())
    sperm_details = Column(String)
    is_successful = Column(Boolean, default=False)
    pregnancy_check_date = Column(DateTime(timezone=True), nullable=True)
    expected_birth_date = Column(DateTime(timezone=True), nullable=True)
    notes = Column(Text)
    
    livestock_id = Column(Integer, ForeignKey("livestock.id"))
    vet_id = Column(Integer, ForeignKey("users.id"))
    clinic_id = Column(Integer, ForeignKey("clinics.id"))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
