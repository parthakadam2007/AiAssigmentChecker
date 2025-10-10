from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
import numpy as np
import cv2
from database import SessionLocal
from app.models.Facemodels import FaceData
from services.attendance_service import extract_face_embedding, find_matching_face

attendance_router = APIRouter(
    prefix="/biometric_attendance",
    tags=["attendance"]
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@attendance_router.post("/mark-attendance")
async def mark_attendance(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # 1️⃣ Read image
    contents = await file.read()
    npimg = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    if frame is None:
        raise HTTPException(status_code=400, detail="Invalid image file")

    # 2️⃣ Extract embedding
    try:
        input_embedding = extract_face_embedding(frame)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Face not detected or embedding failed: {str(e)}")

    # 3️⃣ Check against stored faces
    faces = db.query(FaceData).all()
    matched_face = find_matching_face(input_embedding, faces)

    if matched_face:
        return {"message": "Attendance marked", "student_id": matched_face.student_id}
    else:
        return {"message": "Face not found in the database"}
