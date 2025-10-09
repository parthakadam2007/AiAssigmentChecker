from typing import Union
from fastapi import FastAPI,APIRouter
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request

from jose import JWTError, jwt
from services.teacherChatbot.TeacherChatBot import TeacherChatBot
from services.studentChatbot.studentChatbot import StudentChatBot
from middleware.auth import auth_middleware

# from routes.Attendanceroutes import attendance_router


from models.database import SessionLocal

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app = FastAPI()
# attendance routes
# app.include_router(attendance_router)

origins = [
    "http://localhost:3000", 
    "http://127.0.0.1:3000",
    "http://localhost:5174",
    "http://localhost:5173",
    "http://localhost:80",
    "http://localhost",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
      'http://localhost',
  "https://ai-assigment-checker-wy6o.vercel.app",
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:80',
  'http://localhost:8000',
  'http://localhost',
  'http://localhost:443',
  'https://ai-assigment-checker-rho.vercel.app',
  'https://ai-assigment-checker-zrth.vercel.app',
  'https://devaiassigmentchecker-c8bfdgd8h6bmdsad.canadacentral-01.azurewebsites.net',
  'https://ai-assigment-checker-wy6o-fpkfkq84d-parthakadam2007s-projects.vercel.app',
  'http://ec2-65-0-205-222.ap-south-1.compute.amazonaws.com',
  'https://aiclassroom.online'


]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # List of allowed origins
    allow_credentials=True,         # Allow cookies / Authorization headers
    allow_methods=["*"],            # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],            # Allow all headers
)


@app.get("/")
def read_root():
    return {"welcome to AiAssignmentChecker"}

@app.get("/health")
def health_check():
    return {"api is healthy"}

# @app.get("/teacherChatBot")
# def teacherChatBotHelper(current_user:dict = Depends(get_current_user)):
#     teacher_id = current_user["teacher"]
#     return{"teacher":teacher_id}

from fastapi.security import OAuth2PasswordBearer
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
SECRET_KEY = "mysecretkey"
ALGORITHM = "HS256"

@app.post("/teacherChatBottest",)
async def teacherChatBotHelpertest(request: Request,user=Depends(auth_middleware("teacher"))):
    body_as_dict = await request.json()
    auth_middleware("teacher")
    body_as_dict["message"] = f" meta info attached by backend [user_id, : {user['teacher_id']}] ,user_query: "+body_as_dict["message"]
    print("body_as_dict[\"message\"]:", body_as_dict["message"],user["teacher_id"])

    response = await TeacherChatBot(str(user["teacher_id"]),body_as_dict["message"])
    
    return {"status": "success", "response": response,"user":user["teacher_id"]}

@app.post("/studentChatBottest",)
async def teacherChatBotHelpertest(request: Request,user=Depends(auth_middleware("student"))):
    body_as_dict = await request.json()
    print("student_id")
    print(str(user["student_id"]))

    response = await StudentChatBot(str(user["student_id"]),body_as_dict["message"])
    
    return {"status": "success", "response": response,"user":user["student_id"]}


# @app.post("/protected")
# async def protected_route(user=Depends(auth_middleware("teacher"))):
#     return {"message": "Welcome!", "user": user}