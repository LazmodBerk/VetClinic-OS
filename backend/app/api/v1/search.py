from typing import Any, Dict, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.api import deps
from app.models.user import User
from app.models.pet import Owner
from app.models.pet import Pet
from app.models.inventory import InventoryItem
from app.models.billing import Invoice

router = APIRouter()

@router.get("/", response_model=Dict[str, List[Dict[str, Any]]])
def global_search(
    q: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Perform a global search across owners, pets, inventory, and invoices.
    """
    clinic_id = current_user.clinic_id
    search_term = f"%{q}%"
    
    results = {
        "owners": [],
        "pets": [],
        "inventory": [],
        "invoices": []
    }
    
    if len(q) < 2:
        return results
        
    # Search Owners
    owners = db.query(Owner).filter(
        Owner.clinic_id == clinic_id,
        or_(
            Owner.first_name.ilike(search_term),
            Owner.last_name.ilike(search_term),
            Owner.phone.ilike(search_term),
            Owner.email.ilike(search_term)
        )
    ).limit(5).all()
    results["owners"] = [{"id": o.id, "title": f"{o.first_name} {o.last_name}", "subtitle": o.phone} for o in owners]
    
    # Search Pets
    pets = db.query(Pet).filter(
        Pet.clinic_id == clinic_id,
        or_(
            Pet.name.ilike(search_term),
            Pet.species.ilike(search_term),
            Pet.microchip_number.ilike(search_term)
        )
    ).limit(5).all()
    results["pets"] = [{"id": p.id, "title": p.name, "subtitle": f"{p.species} - {p.breed}"} for p in pets]
    
    # Search Inventory
    inventory = db.query(InventoryItem).filter(
        InventoryItem.clinic_id == clinic_id,
        or_(
            InventoryItem.name.ilike(search_term),
            InventoryItem.sku.ilike(search_term)
        )
    ).limit(5).all()
    results["inventory"] = [{"id": i.id, "title": i.name, "subtitle": f"SKU: {i.sku} | Stok: {i.quantity_in_stock}"} for i in inventory]
    
    # Search Invoices
    invoices = db.query(Invoice).filter(
        Invoice.clinic_id == clinic_id,
        Invoice.invoice_number.ilike(search_term)
    ).limit(5).all()
    results["invoices"] = [{"id": inv.id, "title": f"Fatura #{inv.invoice_number}", "subtitle": f"Tutar: ₺{inv.total_amount}"} for inv in invoices]
    
    return results
