from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.models.inventory import InventoryItem, Supplier
from app.models.user import User
from app.schemas.inventory import (
    InventoryItem as InventoryItemSchema, 
    InventoryItemCreate, 
    InventoryItemUpdate,
    Supplier as SupplierSchema,
    SupplierCreate
)

router = APIRouter()

# --- SUPPLIERS ---

@router.get("/suppliers", response_model=List[SupplierSchema])
def read_suppliers(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    suppliers = db.query(Supplier).filter(Supplier.clinic_id == current_user.clinic_id).offset(skip).limit(limit).all()
    return suppliers

@router.post("/suppliers", response_model=SupplierSchema)
def create_supplier(
    *,
    db: Session = Depends(deps.get_db),
    supplier_in: SupplierCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    supplier = Supplier(
        **supplier_in.model_dump(),
        clinic_id=current_user.clinic_id
    )
    db.add(supplier)
    db.commit()
    db.refresh(supplier)
    return supplier

# --- INVENTORY ITEMS ---

@router.get("/", response_model=List[InventoryItemSchema])
def read_inventory_items(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    low_stock: bool = False,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    query = db.query(InventoryItem).filter(InventoryItem.clinic_id == current_user.clinic_id)
    
    if low_stock:
        query = query.filter(InventoryItem.quantity_in_stock <= InventoryItem.reorder_level)
        
    items = query.order_by(InventoryItem.name.asc()).offset(skip).limit(limit).all()
    return items

@router.post("/", response_model=InventoryItemSchema)
def create_inventory_item(
    *,
    db: Session = Depends(deps.get_db),
    item_in: InventoryItemCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    if item_in.supplier_id:
        sup = db.query(Supplier).filter(Supplier.id == item_in.supplier_id, Supplier.clinic_id == current_user.clinic_id).first()
        if not sup:
            raise HTTPException(status_code=404, detail="Supplier not found")
            
    item = InventoryItem(
        **item_in.model_dump(),
        clinic_id=current_user.clinic_id
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.put("/{id}", response_model=InventoryItemSchema)
def update_inventory_item(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    item_in: InventoryItemUpdate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    item = db.query(InventoryItem).filter(InventoryItem.id == id, InventoryItem.clinic_id == current_user.clinic_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
        
    update_data = item_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(item, field, value)
        
    db.add(item)
    db.commit()
    db.refresh(item)
    return item
