from sqlalchemy import Column, Integer, String, Date, Time, ForeignKey, UniqueConstraint
from datetime import date, datetime
from database import Base
from app.models.studentModels import Student
from app.models.ClassModel import Class

class Attendance(Base):
    __tablename__ = "attendance"

    attendance_id = Column(Integer, primary_key=True, index=True)
    class_id = Column(Integer, ForeignKey("classes.class_id", ondelete="CASCADE"), nullable=False)
    student_id = Column(Integer, ForeignKey("students.student_id", ondelete="CASCADE"), nullable=False)
    date = Column(Date, default=date.today)
    lecture_number = Column(Integer, nullable=True)
    time_marked = Column(Time, default=datetime.now().time)
    unique_id = Column(String(100), nullable=True)
    session_id = Column(Integer, nullable=True)
    method = Column(String(20), default="manual")
    status = Column(String(20), default="Absent")

    __table_args__ = (
        UniqueConstraint('class_id', 'student_id', 'date', 'lecture_number', name='unique_attendance_entry'),
    )
