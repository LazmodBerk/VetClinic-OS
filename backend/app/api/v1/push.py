from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api import deps
from app.models.user import User
from app.models.push import PushSubscription
from app.schemas.push import PushSubscriptionCreate, PushSubscriptionResponse

router = APIRouter()

@router.post("/subscribe", response_model=PushSubscriptionResponse)
def subscribe_push(
    sub_in: PushSubscriptionCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Save web push subscription to database.
    """
    existing = db.query(PushSubscription).filter(PushSubscription.endpoint == sub_in.endpoint).first()
    
    if not existing:
        new_sub = PushSubscription(
            user_id=current_user.id,
            endpoint=sub_in.endpoint,
            p256dh=sub_in.keys.p256dh,
            auth=sub_in.keys.auth
        )
        db.add(new_sub)
        db.commit()
        
    return {"status": "ok"}
