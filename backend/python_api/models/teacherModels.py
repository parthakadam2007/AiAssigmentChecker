# from sqlalchemy import Column, Integer, String
# from database import Base
from sqlalchemy import text
from database import SessionLocal


def create_assignment(class_id: str, title: str) -> None:
    db = SessionLocal()
    try:
        db.execute(
            text("""
                INSERT INTO assignments (title, class_id)
                VALUES (:title, :class_id)
            """),
            {"title": title, "class_id": class_id}
        )
        db.commit()
    except Exception as err:
        print(f"Error inserting assignment: {err}")
        db.rollback()
    finally:
        db.close()

def get_user_info(user_id: str) -> dict:
    db = SessionLocal()
    try:
        result = db.execute(
            text("""
                SELECT first_name ,last_name, email
                FROM teachers
                WHERE teacher_id = :teacher_id
            """),
            {"teacher_id": user_id}
        )
        user_info = result.fetchone()
        if user_info:
            return user_info._asdict()
        else:
            return {}
    except Exception as err:
        print(f"Error fetching user info: {err}")
        return {}
    finally:
        db.close()

def get_classes_by_teacher_id(teacher_id: str) -> list:
    db = SessionLocal()
    try:
        result = db.execute(
            text("""
                SELECT class_id, class_name
                FROM classes
                WHERE teacher_id = :teacher_id
            """),
            {"teacher_id": teacher_id}
        )
        classes = result.fetchall()
        return [cls._asdict() for cls in classes]
    except Exception as err:
        print(f"Error fetching classes: {err}")
        return []
    finally:
        db.close()