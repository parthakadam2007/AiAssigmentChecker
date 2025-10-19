from sqlalchemy import text
from sqlalchemy import Column, Integer, String, Text
from app.models.database import SessionLocal,Base

def get_grades_student_id(student_id:str):
    # db = SessionLocal()
    # try:
    #     result=db.execute(
    #         text("""
    #                 SELECT * from grades 
    #                 where student_id = :student_id
    #         """),
    #         {"student_id": student_id}
    #     )
    #     return result.fetchall()
    # except Exception as err:
    #     print(f"Error getting grades: {err}")
    #     return None
    # finally:
    #     db.close()
    db = SessionLocal()
    try:
        result=db.execute(
            text("""
                    SELECT * from grades 
                    where student_id = :student_id
            """),
            {"student_id": student_id}
        )
        return result.fetchall()
    except Exception as err:
        print(f"Error getting grades: {err}")
        return None
    finally:
        db.close()
    return 10

class Student(Base):
    __tablename__ = "students"

    student_id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    url_dp = Column(String(255), default="public/img/user_photo")
    face_embedding = Column(Text, nullable=True)  # can be base64 or JSON string