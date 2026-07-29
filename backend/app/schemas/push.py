from pydantic import BaseModel
from typing import Dict

class KeysSchema(BaseModel):
    p256dh: str
    auth: str

class PushSubscriptionCreate(BaseModel):
    endpoint: str
    keys: KeysSchema
    
class PushSubscriptionResponse(BaseModel):
    status: str
