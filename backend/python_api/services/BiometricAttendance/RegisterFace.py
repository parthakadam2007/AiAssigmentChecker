import base64
import numpy as np
import cv2
from deepface import DeepFace
from app.models.Facemodels import FaceData

def encode_face(face: FaceData):
    """Convert FaceData object to JSON-friendly dict"""
    return {
        "face_id": face.face_id,
        "student_id": face.student_id,
        "encoding": base64.b64encode(face.encoding).decode("utf-8") if face.encoding else None,
        "created_at": face.created_at.isoformat() if face.created_at else None,
        "updated_at": face.updated_at.isoformat() if face.updated_at else None
    }

def extract_face_embedding(frame) -> bytes:
    """
    Extract face embedding from an OpenCV image using DeepFace
    Returns embedding as bytes
    """
    embedding_obj = DeepFace.represent(img_path=frame, model_name="Facenet")[0]
    embedding = np.array(embedding_obj["embedding"], dtype=np.float32).tobytes()
    return embedding
