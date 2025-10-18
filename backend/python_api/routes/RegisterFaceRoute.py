from fastapi import APIRouter, UploadFile, File, HTTPException, Form, Depends
from sqlalchemy.orm import Session
import numpy as np
import cv2

from database import SessionLocal
from app.models.FaceModels import FaceData
from app.schemas.Faceschemas import FaceDataModel
from app.services.BiometricAttendance.RegisterFace import encode_face, extract_face_embedding

enroll_router = APIRouter(
    prefix="/biometric_attendance",
    tags=["enrollment"]
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@enroll_router.post("/enroll-face", response_model=FaceDataModel)
async def enroll_face(student_id: int = Form(...), file: UploadFile = File(...), db: Session = Depends(get_db)):
    contents = await file.read()
    # print(str(user["student_id"]))
    npimg = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    if frame is None:
        raise HTTPException(status_code=400, detail="Invalid image file")

    # 1️⃣ Extract face embedding
    try:
        embedding = extract_face_embedding(frame)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Face not detected or embedding failed: {str(e)}")

    # 2️⃣ Check if student already has a face enrolled
    existing_face = db.query(FaceData).filter(FaceData.student_id == student_id).first()
    if existing_face:
        existing_face.encoding = embedding  # update embedding
        db.commit()
        db.refresh(existing_face)
        return encode_face(existing_face)

    # 3️⃣ Insert new face
    new_face = FaceData(
        student_id=student_id,
        encoding=embedding
    )
    db.add(new_face)
    db.commit()
    db.refresh(new_face)

    return encode_face(new_face)
