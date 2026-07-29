from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Numeric
from sqlalchemy.sql import func
from app.db.base_class import Base

class Supplier(Base):
    __tablename__ = "suppliers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    contact_person = Column(String)
    phone = Column(String)
    email = Column(String)
    address = Column(Text)
    
    clinic_id = Column(Integer, ForeignKey("clinics.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class SupplierTransaction(Base):
    __tablename__ = "supplier_transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    transaction_date = Column(DateTime(timezone=True), server_default=func.now())
    amount = Column(Numeric(10, 2))
    transaction_type = Column(String) # Payment, Invoice, Promissory Note
    notes = Column(Text)
    status = Column(String) # Pending, Completed, Cancelled
    
    supplier_id = Column(Integer, ForeignKey("suppliers.id"))
    clinic_id = Column(Integer, ForeignKey("clinics.id"))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class InventoryItem(Base):
    __tablename__ = "inventory_items"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(String)
    sku = Column(String, unique=True)
    description = Column(Text)
    quantity_in_stock = Column(Integer, default=0)
    reorder_level = Column(Integer, default=5)
    unit_price = Column(Numeric(10, 2))
    expiration_date = Column(DateTime(timezone=True), nullable=True)
    batch_no = Column(String, nullable=True)
    
    supplier_id = Column(Integer, ForeignKey("suppliers.id"))
    clinic_id = Column(Integer, ForeignKey("clinics.id"))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
