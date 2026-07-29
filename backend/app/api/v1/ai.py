from typing import Any
from fastapi import APIRouter, Depends

from app.api import deps
from app.models.user import User
from app.schemas.ai import TreatmentRequest, TreatmentResponse
from app.services.ai_service import ai_service

router = APIRouter()

@router.post("/suggest-treatment", response_model=TreatmentResponse)
async def suggest_treatment(
    request: TreatmentRequest,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get AI powered treatment suggestion based on symptoms.
    """
    suggestion = await ai_service.suggest_treatment(request.symptoms, request.species)
    return {"suggestion": suggestion}
