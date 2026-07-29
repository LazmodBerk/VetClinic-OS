import os
import uuid
import shutil
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from app.api import deps
from app.models.medical import MedicalVisit
from app.models.pet import Pet
from app.models.user import User
from app.schemas.medical import MedicalVisit as MedicalVisitSchema, MedicalVisitCreate, MedicalVisitUpdate

router = APIRouter()

@router.get("/", response_model=List[MedicalVisitSchema])
def read_medical_visits(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    pet_id: int = None,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve medical visits. Filter by pet_id if provided.
    """
    query = db.query(MedicalVisit).filter(MedicalVisit.clinic_id == current_user.clinic_id)
    if pet_id:
        query = query.filter(MedicalVisit.pet_id == pet_id)
    visits = query.order_by(MedicalVisit.visit_date.desc()).offset(skip).limit(limit).all()
    return visits

@router.post("/", response_model=MedicalVisitSchema)
def create_medical_visit(
    *,
    db: Session = Depends(deps.get_db),
    visit_in: MedicalVisitCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new medical visit.
    """
    pet = db.query(Pet).filter(Pet.id == visit_in.pet_id, Pet.clinic_id == current_user.clinic_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
        
    visit = MedicalVisit(
        **visit_in.model_dump(),
        clinic_id=current_user.clinic_id
    )
    db.add(visit)
    db.commit()
    db.refresh(visit)
    return visit

@router.post("/{id}/attachment", response_model=MedicalVisitSchema)
def upload_visit_attachment(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Upload an attachment (e.g. lab result) for a medical visit.
    """
    visit = db.query(MedicalVisit).filter(MedicalVisit.id == id, MedicalVisit.clinic_id == current_user.clinic_id).first()
    if not visit:
        raise HTTPException(status_code=404, detail="Medical visit not found")
        
    extension = os.path.splitext(file.filename)[1]
    filename = f"{uuid.uuid4()}{extension}"
    file_path = os.path.join("uploads", filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    visit.attachment_url = f"/uploads/{filename}"
    db.add(visit)
    db.commit()
    db.refresh(visit)
    
    return visit
