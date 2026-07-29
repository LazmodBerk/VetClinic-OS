from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    start_time = Column(DateTime, index=True)
    end_time = Column(DateTime)
    notes = Column(Text, nullable=True)
    status = Column(String, default="SCHEDULED") # SCHEDULED, COMPLETED, CANCELLED
    
    pet_id = Column(Integer, ForeignKey("pets.id"), nullable=True)
    owner_id = Column(Integer, ForeignKey("owners.id"), nullable=True)
    vet_id = Column(Integer, ForeignKey("users.id"))
    clinic_id = Column(Integer, ForeignKey("clinics.id"))
    
    pet = relationship("Pet")
    owner = relationship("Owner")
    vet = relationship("User")
