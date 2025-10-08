from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# DB_URI = os.getenv("DB_URI")
DB_URI = os.getenv("DATABASE_URL")

# engine = create_engine(DB_URI)
engine = create_engine(DB_URI)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
