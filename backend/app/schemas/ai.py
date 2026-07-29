from pydantic import BaseModel

class TreatmentRequest(BaseModel):
    symptoms: str
    species: str = "Bilinmiyor"
    
class TreatmentResponse(BaseModel):
    suggestion: str
