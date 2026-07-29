from datetime import datetime, timedelta
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.models.medical import Vaccination, VaccineType
from app.models.pet import Pet
from app.models.user import User
from app.schemas.vaccination import Vaccination as VaccinationSchema, VaccinationCreate, VaccineType as VaccineTypeSchema, VaccineTypeCreate

router = APIRouter()

@router.get("/types", response_model=List[VaccineTypeSchema])
def read_vaccine_types(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve vaccine types.
    """
    types = db.query(VaccineType).filter(VaccineType.clinic_id == current_user.clinic_id).offset(skip).limit(limit).all()
    return types

@router.post("/types", response_model=VaccineTypeSchema)
def create_vaccine_type(
    *,
    db: Session = Depends(deps.get_db),
    type_in: VaccineTypeCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create a new vaccine type.
    """
    vaccine_type = VaccineType(
        **type_in.model_dump(),
        clinic_id=current_user.clinic_id
    )
    db.add(vaccine_type)
    db.commit()
    db.refresh(vaccine_type)
    return vaccine_type

@router.get("/", response_model=List[VaccinationSchema])
def read_vaccinations(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    pet_id: int = None,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve vaccinations. Filter by pet_id if provided.
    """
    query = db.query(Vaccination).filter(Vaccination.clinic_id == current_user.clinic_id)
    if pet_id:
        query = query.filter(Vaccination.pet_id == pet_id)
    
    # We may want to join with VaccineType to return it as nested object
    vaccinations = query.order_by(Vaccination.next_due_date.asc()).offset(skip).limit(limit).all()
    return vaccinations

@router.post("/", response_model=VaccinationSchema)
def create_vaccination(
    *,
    db: Session = Depends(deps.get_db),
    vacc_in: VaccinationCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new vaccination record. The engine will automatically calculate next_due_date.
    """
    pet = db.query(Pet).filter(Pet.id == vacc_in.pet_id, Pet.clinic_id == current_user.clinic_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
        
    v_type = db.query(VaccineType).filter(VaccineType.id == vacc_in.vaccine_type_id, VaccineType.clinic_id == current_user.clinic_id).first()
    if not v_type:
        raise HTTPException(status_code=404, detail="Vaccine type not found")
        
    admin_date = vacc_in.administered_date or datetime.utcnow()
    
    # Vaccination Engine Logic: Calculate next due date
    calc_next_due = vacc_in.next_due_date
    if not calc_next_due:
        calc_next_due = admin_date + timedelta(days=v_type.validity_days)
        
    vaccination = Vaccination(
        pet_id=vacc_in.pet_id,
        vaccine_type_id=vacc_in.vaccine_type_id,
        vet_id=vacc_in.vet_id,
        notes=vacc_in.notes,
        administered_date=admin_date,
        next_due_date=calc_next_due,
        clinic_id=current_user.clinic_id
    )
    db.add(vaccination)
    db.commit()
    db.refresh(vaccination)
    return vaccination
