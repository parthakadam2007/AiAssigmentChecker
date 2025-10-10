from database import Base
from sqlalchemy import Column,Integer,LargeBinary,DateTime,func
from datetime import datetime

class FaceData(Base):
    __tablename__ = "face_data"

    face_id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(Integer, nullable=False)
    encoding = Column(LargeBinary, nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
