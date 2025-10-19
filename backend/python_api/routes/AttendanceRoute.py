from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Form
from sqlalchemy.orm import Session
import numpy as np
import cv2
from datetime import date, datetime
from app.models.database import SessionLocal
from app.models.FaceModels import FaceData
from app.models.AttendanceModel import Attendance 
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
    class_id: int = Form(...),
    session_id: int = Form(...),
    method: str = Form(...),
    status: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
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

    if not matched_face:
        return {"success": False, "message": "Face not found in the database"}

    student_id = matched_face.student_id
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

@attendance_router.get("/check-attendance")
def check_attendance(
    class_id: int,
    session_id: int,
    # student_id: int,
    db: Session = Depends(get_db)
):
    existing_attendance = (
        db.query(Attendance)
        .filter(
            Attendance.class_id == class_id,
            Attendance.session_id == session_id,
            # Attendance.student_id == student_id,
            Attendance.date == date.today()
        )
        .first()
    )
    return {"marked": bool(existing_attendance)}
