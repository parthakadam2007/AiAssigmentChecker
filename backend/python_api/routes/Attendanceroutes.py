# from typing import Union
# from fastapi import FastAPI, Depends, HTTPException, status,APIRouter
# from models.database import SessionLocal
# import base64
# import numpy as np
# import cv2
# from sqlalchemy.orm import Session
# from services.BiometricAttendance.BiometricAttendance import register_user_face
# from models.FaceModels import FaceRegisterRequest
# from models.database import engine

# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# attendance_router = APIRouter(
#     prefix='/attendance',
#     tags=['attendance']
# )

# session=Session(bind=engine)

# @attendance_router.post("/student/register_face")
# def register_face(request: FaceRegisterRequest, db: Session = Depends(get_db)):
#     # Decode base64 image to numpy array
#     image_data = base64.b64decode(request.image.split(",")[1])
#     nparr = np.frombuffer(image_data, np.uint8)
#     image_array = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

#     # Call your function from biometric.py
#     result = register_user_face(db, request.user_id, image_array)
#     return result