from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base  


class Class(Base):
    __tablename__ = "classes"

    class_id = Column(Integer, primary_key=True, index=True)
    class_name = Column(String(100), nullable=False)
    section = Column(String(50), nullable=True)
    subject = Column(String(100), nullable=True)
    room = Column(String(50), nullable=True)
    description = Column(String(255), default="no description")
    joining_code = Column(String(50), unique=True, nullable=False)
    uploaded_photo_url = Column(String(255), default="public/img/class_photo")
    teacher_id = Column(Integer, ForeignKey("teachers.teacher_id", ondelete="CASCADE"))
