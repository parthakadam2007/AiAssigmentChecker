from sqlalchemy import text
from database import SessionLocal

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
    return 10