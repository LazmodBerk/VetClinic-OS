import os
import uuid
import shutil
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from app.api import deps
from app.models.pet import Pet, Owner
from app.models.user import User
from app.schemas.pet import Pet as PetSchema, PetCreate, PetUpdate

router = APIRouter()

@router.get("/", response_model=List[PetSchema])
def read_pets(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    owner_id: int = None,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve pets. Filter by owner_id if provided.
    """
    query = db.query(Pet).filter(Pet.clinic_id == current_user.clinic_id)
    if owner_id:
        query = query.filter(Pet.owner_id == owner_id)
    pets = query.offset(skip).limit(limit).all()
    return pets

@router.post("/", response_model=PetSchema)
def create_pet(
    *,
    db: Session = Depends(deps.get_db),
    pet_in: PetCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new pet. Verify owner belongs to clinic.
    """
    owner = db.query(Owner).filter(Owner.id == pet_in.owner_id, Owner.clinic_id == current_user.clinic_id).first()
    if not owner:
        raise HTTPException(status_code=404, detail="Owner not found")
        
    pet = Pet(
        **pet_in.model_dump(),
        clinic_id=current_user.clinic_id
    )
    db.add(pet)
    db.commit()
    db.refresh(pet)
    return pet

@router.post("/{id}/photo", response_model=PetSchema)
def upload_pet_photo(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Upload a photo for a pet.
    """
    pet = db.query(Pet).filter(Pet.id == id, Pet.clinic_id == current_user.clinic_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
        
    # Generate unique filename
    extension = os.path.splitext(file.filename)[1]
    filename = f"{uuid.uuid4()}{extension}"
    file_path = os.path.join("uploads", filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Update pet record
    pet.photo_url = f"/uploads/{filename}"
    db.add(pet)
    db.commit()
    db.refresh(pet)
    
    return pet

@router.get("/{id}", response_model=PetSchema)
def read_pet(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get pet by ID.
    """
    pet = db.query(Pet).filter(Pet.id == id, Pet.clinic_id == current_user.clinic_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
    return pet
