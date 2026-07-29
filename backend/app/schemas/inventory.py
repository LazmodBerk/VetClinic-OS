from typing import Optional
from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal

class SupplierBase(BaseModel):
    name: str
    contact_person: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None

class SupplierCreate(SupplierBase):
    pass

class SupplierUpdate(SupplierBase):
    name: Optional[str] = None

class SupplierInDBBase(SupplierBase):
    id: int
    clinic_id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class Supplier(SupplierInDBBase):
    pass


class InventoryItemBase(BaseModel):
    name: str
    category: Optional[str] = None
    sku: Optional[str] = None
    description: Optional[str] = None
    quantity_in_stock: int = 0
    reorder_level: int = 5
    unit_price: Optional[Decimal] = None
    supplier_id: Optional[int] = None

class InventoryItemCreate(InventoryItemBase):
    pass

class InventoryItemUpdate(InventoryItemBase):
    name: Optional[str] = None
    quantity_in_stock: Optional[int] = None
    reorder_level: Optional[int] = None

class InventoryItemInDBBase(InventoryItemBase):
    id: int
    clinic_id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class InventoryItem(InventoryItemInDBBase):
    supplier: Optional[Supplier] = None
