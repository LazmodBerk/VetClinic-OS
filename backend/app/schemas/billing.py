from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal

# --- InvoiceItem ---
class InvoiceItemBase(BaseModel):
    description: str
    quantity: int = 1
    unit_price: Decimal
    total_price: Decimal
    inventory_item_id: Optional[int] = None

class InvoiceItemCreate(InvoiceItemBase):
    pass

class InvoiceItemInDBBase(InvoiceItemBase):
    id: int
    invoice_id: int

    class Config:
        from_attributes = True

class InvoiceItem(InvoiceItemInDBBase):
    pass

# --- Invoice ---
class InvoiceBase(BaseModel):
    invoice_number: str
    due_date: Optional[datetime] = None
    total_amount: Decimal
    status: str = "Draft"
    notes: Optional[str] = None
    owner_id: int

class InvoiceCreate(InvoiceBase):
    items: List[InvoiceItemCreate]

class InvoiceUpdate(InvoiceBase):
    status: Optional[str] = None
    total_amount: Optional[Decimal] = None
    owner_id: Optional[int] = None

class InvoiceInDBBase(InvoiceBase):
    id: int
    clinic_id: int
    issue_date: datetime
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class Invoice(InvoiceInDBBase):
    items: List[InvoiceItem] = []

# --- Payment ---
class PaymentBase(BaseModel):
    amount: Decimal
    payment_method: str
    transaction_id: Optional[str] = None
    invoice_id: int

class PaymentCreate(PaymentBase):
    pass

class PaymentInDBBase(PaymentBase):
    id: int
    clinic_id: int
    payment_date: datetime

    class Config:
        from_attributes = True

class Payment(PaymentInDBBase):
    pass
