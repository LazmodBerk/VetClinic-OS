from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api import deps
from app.models.communication import Notification
from app.models.user import User
from app.schemas.notification import Notification as NotificationSchema

router = APIRouter()

@router.get("/", response_model=List[NotificationSchema])
def read_notifications(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve in-app notifications for the clinic.
    """
    notifications = db.query(Notification)\
        .filter(Notification.clinic_id == current_user.clinic_id)\
        .order_by(Notification.created_at.desc())\
        .offset(skip).limit(limit).all()
    return notifications
