from pydantic import BaseModel

class FaceDataModel(BaseModel):
    face_id: int
    student_id: int
    encoding: str  
    created_at: str
    updated_at: str
