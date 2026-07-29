from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Numeric
from sqlalchemy.sql import func
from app.db.base_class import Base

class Invoice(Base):
    __tablename__ = "invoices"
    
    id = Column(Integer, primary_key=True, index=True)
    invoice_number = Column(String, unique=True, index=True)
    issue_date = Column(DateTime(timezone=True), server_default=func.now())
    due_date = Column(DateTime(timezone=True))
    total_amount = Column(Numeric(10, 2))
    status = Column(String) # Draft, Issued, Paid, Cancelled
    notes = Column(Text)
    
    e_invoice_status = Column(String, default="Not Sent") # Not Sent, Draft, Sent, Error
    e_invoice_id = Column(String, nullable=True)
    e_invoice_url = Column(String, nullable=True)
    
    owner_id = Column(Integer, ForeignKey("owners.id"))
    clinic_id = Column(Integer, ForeignKey("clinics.id"))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class InvoiceItem(Base):
    __tablename__ = "invoice_items"
    
    id = Column(Integer, primary_key=True, index=True)
    description = Column(String)
    quantity = Column(Integer)
    unit_price = Column(Numeric(10, 2))
    total_price = Column(Numeric(10, 2))
    
    invoice_id = Column(Integer, ForeignKey("invoices.id"))
    inventory_item_id = Column(Integer, ForeignKey("inventory_items.id"), nullable=True)

class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, index=True)
    payment_date = Column(DateTime(timezone=True), server_default=func.now())
    amount = Column(Numeric(10, 2))
    payment_method = Column(String) # Cash, Credit Card, Transfer
    transaction_id = Column(String)
    
    invoice_id = Column(Integer, ForeignKey("invoices.id"))
    clinic_id = Column(Integer, ForeignKey("clinics.id"))

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    action = Column(String)
    entity_type = Column(String)
    entity_id = Column(Integer)
    user_id = Column(Integer, ForeignKey("users.id"))
    clinic_id = Column(Integer, ForeignKey("clinics.id"))
    details = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
