from database import BaseModel 

class FaceRegisterRequest(BaseModel):
    user_id: int
    image: str  # base64 string