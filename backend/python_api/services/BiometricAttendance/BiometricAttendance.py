import json
import numpy as np
from sqlalchemy.orm import Session
from deepface import DeepFace
from models import User  # your SQLAlchemy User model

def register_user_face(session: Session, user_id: int, image_path: str):
    """
    Extracts and stores user's face embedding using DeepFace in PostgreSQL.
    image_path: path to the uploaded image (or can be a numpy array if preferred)
    """

    try:
        # Extract face embedding
        embedding_obj = DeepFace.represent(img_path=image_path, model_name="Facenet", enforce_detection=True)

        if not embedding_obj or "embedding" not in embedding_obj[0]:
            return {"status": "error", "message": "No face detected!"}

        embedding = np.array(embedding_obj[0]["embedding"], dtype=float)
        embedding_json = json.dumps(embedding.tolist())

        # Fetch user
        user = session.query(User).filter_by(id=user_id).first()
        if not user:
            return {"status": "error", "message": "User not found!"}

        # Update DB
        user.face_embedding = embedding_json
        session.commit()

        return {"status": "success", "message": "Face data saved successfully!"}

    except Exception as e:
        return {"status": "error", "message": str(e)}
