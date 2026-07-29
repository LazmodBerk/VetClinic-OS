from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean, Numeric
from sqlalchemy.sql import func
from app.db.base_class import Base

class Reminder(Base):
    __tablename__ = "reminders"
    
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String) # Vaccination, Appointment
    scheduled_time = Column(DateTime(timezone=True))
    message = Column(Text)
    is_sent = Column(Boolean, default=False)
    
    pet_id = Column(Integer, ForeignKey("pets.id"))
    owner_id = Column(Integer, ForeignKey("owners.id"))
    clinic_id = Column(Integer, ForeignKey("clinics.id"))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    channel = Column(String) # SMS, Email, WhatsApp
    recipient = Column(String)
    content = Column(Text)
    status = Column(String) # Pending, Sent, Failed
    sent_at = Column(DateTime(timezone=True))
    
    clinic_id = Column(Integer, ForeignKey("clinics.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

