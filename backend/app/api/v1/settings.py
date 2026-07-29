from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.models.clinic import Clinic
from app.models.user import User
from app.schemas.settings import Clinic as ClinicSchema, ClinicUpdate

router = APIRouter()

@router.get("/clinic", response_model=ClinicSchema)
def get_clinic_info(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current clinic info.
    """
    clinic = db.query(Clinic).filter(Clinic.id == current_user.clinic_id).first()
    if not clinic:
        raise HTTPException(status_code=404, detail="Clinic not found")
    return clinic

@router.put("/clinic", response_model=ClinicSchema)
def update_clinic_info(
    *,
    db: Session = Depends(deps.get_db),
    clinic_in: ClinicUpdate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update clinic info.
    """
    clinic = db.query(Clinic).filter(Clinic.id == current_user.clinic_id).first()
    if not clinic:
        raise HTTPException(status_code=404, detail="Clinic not found")
        
    update_data = clinic_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(clinic, field, value)
        
    db.add(clinic)
    db.commit()
    db.refresh(clinic)
    return clinic
