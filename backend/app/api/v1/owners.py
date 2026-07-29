from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.models.pet import Owner
from app.models.user import User
from app.schemas.owner import Owner as OwnerSchema, OwnerCreate, OwnerUpdate

router = APIRouter()

@router.get("/", response_model=List[OwnerSchema])
def read_owners(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve owners for the current user's clinic.
    """
    owners = db.query(Owner).filter(Owner.clinic_id == current_user.clinic_id).offset(skip).limit(limit).all()
    return owners

@router.post("/", response_model=OwnerSchema)
def create_owner(
    *,
    db: Session = Depends(deps.get_db),
    owner_in: OwnerCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new owner.
    """
    owner = Owner(
        **owner_in.model_dump(),
        clinic_id=current_user.clinic_id
    )
    db.add(owner)
    db.commit()
    db.refresh(owner)
    return owner

@router.get("/{id}", response_model=OwnerSchema)
def read_owner(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get owner by ID.
    """
    owner = db.query(Owner).filter(Owner.id == id, Owner.clinic_id == current_user.clinic_id).first()
    if not owner:
        raise HTTPException(status_code=404, detail="Owner not found")
    return owner

@router.put("/{id}", response_model=OwnerSchema)
def update_owner(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    owner_in: OwnerUpdate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update an owner.
    """
    owner = db.query(Owner).filter(Owner.id == id, Owner.clinic_id == current_user.clinic_id).first()
    if not owner:
        raise HTTPException(status_code=404, detail="Owner not found")
    
    update_data = owner_in.model_dump(exclude_unset=True)
    for field in update_data:
        setattr(owner, field, update_data[field])
        
    db.add(owner)
    db.commit()
    db.refresh(owner)
    return owner
