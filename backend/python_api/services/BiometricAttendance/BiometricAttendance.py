# import json
# import base64
# import cv2
# import numpy as np
# from sqlalchemy.orm import Session
# from deepface import DeepFace
# from models.FaceModels import FaceRegisterRequest  # Make sure this is the correct class

# def base64_to_numpy(base64_str: str):
#     img_bytes = base64.b64decode(base64_str)
#     nparr = np.frombuffer(img_bytes, np.uint8)
#     img_np = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
#     return img_np

# def register_user_face(session: Session, user_id: int, image_np):
#     try:
#         # Use img= for numpy array
#         embedding_obj = DeepFace.represent(img=image_np, model_name="Facenet", enforce_detection=True)

#         if not embedding_obj or "embedding" not in embedding_obj[0]:
#             return {"status": "error", "message": "No face detected!"}

#         embedding = np.array(embedding_obj[0]["embedding"], dtype=float)
#         embedding_json = json.dumps(embedding.tolist())

#         user = session.query(FaceRegisterRequest).filter_by(id=user_id).first()
#         if not user:
#             return {"status": "error", "message": "User not found!"}

#         user.face_embedding = embedding_json
#         session.commit()

#         return {"status": "success", "message": "Face data saved successfully!"}

#     except Exception as e:
#         return {"status": "error", "message": str(e)}
