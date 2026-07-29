from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class NotificationBase(BaseModel):
    channel: str
    recipient: str
    content: str
    status: str

class NotificationInDBBase(NotificationBase):
    id: int
    clinic_id: int
    sent_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

class Notification(NotificationInDBBase):
    pass

class ReminderBase(BaseModel):
    type: str
    scheduled_time: datetime
    message: str
    is_sent: bool
    pet_id: Optional[int] = None
    owner_id: Optional[int] = None

class ReminderInDBBase(ReminderBase):
    id: int
    clinic_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class Reminder(ReminderInDBBase):
    pass
