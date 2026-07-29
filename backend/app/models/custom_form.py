from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean, JSON
from sqlalchemy.sql import func
from app.db.base_class import Base

class CustomForm(Base):
    __tablename__ = "custom_forms"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    form_schema = Column(JSON) # JSON definition of fields
    
    clinic_id = Column(Integer, ForeignKey("clinics.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class FormResponse(Base):
    __tablename__ = "form_responses"
    
    id = Column(Integer, primary_key=True, index=True)
    response_data = Column(JSON) # The actual answers
    
    form_id = Column(Integer, ForeignKey("custom_forms.id"))
    patient_id = Column(Integer, ForeignKey("pets.id"), nullable=True)
    owner_id = Column(Integer, ForeignKey("owners.id"), nullable=True)
    filled_by = Column(Integer, ForeignKey("users.id"))
    clinic_id = Column(Integer, ForeignKey("clinics.id"))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
