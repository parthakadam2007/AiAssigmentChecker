from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Form
from sqlalchemy.orm import Session
from datetime import date, datetime
import numpy as np
import cv2

from database import SessionLocal
from app.models.FaceModels import FaceData
from app.models.AttendanceModels import Attendance  # ⬅️ Make sure this model exists
from app.services.BiometricAttendance.MarkBioAttendance import extract_face_embedding, find_matching_face

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
async def mark_attendance(
    file: UploadFile = File(...),
    class_id: int = Form(...),
    session_id: int = Form(...),
    db: Session = Depends(get_db)
):
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

    # 3️⃣ Match with stored faces
    faces = db.query(FaceData).all()
    matched_face = find_matching_face(input_embedding, faces)

    if not matched_face:
        return {"success": False, "message": "Face not found in the database"}

    student_id = matched_face.student_id

    # 4️⃣ Check if attendance already exists for this student + session
    existing_attendance = (
        db.query(Attendance)
        .filter(
            Attendance.class_id == class_id,
            Attendance.student_id == student_id,
            Attendance.session_id == session_id,
            Attendance.date == date.today()
        )
        .first()
    )

    if existing_attendance:
        return {"success": False, "message": "Attendance already marked for this session"}

    # 5️⃣ Create attendance record
    new_attendance = Attendance(
        class_id=class_id,
        student_id=student_id,
        status="Present",
        method="biometric",
        session_id=session_id,
        date=date.today(),
        time_marked=datetime.now().time()
    )

    db.add(new_attendance)
    db.commit()

    return {
        "success": True,
        "message": "✅ Attendance marked successfully",
        "student_id": student_id,
        "session_id": session_id,
    }
