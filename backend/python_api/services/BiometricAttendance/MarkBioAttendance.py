import numpy as np
from deepface import DeepFace
from app.models.FaceModels import FaceData

def extract_face_embedding(frame) -> np.ndarray:
    """
    Extract face embedding from an OpenCV image using DeepFace
    Returns embedding as a NumPy array
    """
    embedding_obj = DeepFace.represent(img_path=frame, model_name="Facenet")[0]
    return np.array(embedding_obj["embedding"], dtype=np.float32)

def find_matching_face(input_embedding: np.ndarray, faces: list[FaceData], threshold: float = 0.6):
    """
    Check if the input embedding matches any stored face embeddings
    Returns the matching FaceData object or None
    """
    for face in faces:
        stored_embedding = np.frombuffer(face.encoding, dtype=np.float32)
        similarity = np.dot(input_embedding, stored_embedding) / (
            np.linalg.norm(input_embedding) * np.linalg.norm(stored_embedding)
        )
        if similarity > threshold:
            return face
    return None
