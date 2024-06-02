from fastapi import APIRouter, HTTPException, Request, Depends
from models import User
from pymongo import MongoClient
from datetime import datetime, timedelta
from database import db
import re
from pydantic import BaseModel, EmailStr

router = APIRouter()

# Regular expression for email validation
email_regex = re.compile(r"[^@]+@[^@]+\.[^@]+")

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr

class LoginRequest(BaseModel):
    email: EmailStr

class CollectedStamp(BaseModel):
    collected: datetime

@router.post("/user/login", response_model=User)
async def login_user(login_request: LoginRequest):
    email = login_request.email.lower()
    user = await db.users.find_one({"email": email})

    print("User", user)

    if user:
        # Ensure that each stamp entry is properly formatted as a CollectedStamp
        stamps = {uuid: CollectedStamp(collected=value['collected']) for uuid, value in user.get("stamps", {}).items()}
        return {
            "fullName": "",
            "email": user["email"],
            "stamps": stamps,
            "groups": user.get("groups", [])
        }
    raise HTTPException(status_code=404, detail="User not found")

@router.post("/user", response_model=User)
async def create_user(user: UserCreate, request: Request):
    ip = request.client.host
    now = datetime.utcnow()

    # Check if email is valid
    if not email_regex.match(user.email):
        raise HTTPException(status_code=400, detail="Invalid email format")

    # Convert email to lowercase
    user.email = user.email.lower()

    # Check for existing user
    if await db.users.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="User already exists")

    # Check if an account has been created from this IP in the last 3 minutes
    recent_user = await db.ip_log.find_one({"ip": ip, "timestamp": {"$gt": now - timedelta(minutes=3)}})

    if recent_user:
        raise HTTPException(status_code=429, detail="Too many requests, please try again later")

    # Create the new user
    new_user = {
        "fullName": user.full_name,
        "email": user.email,
        "createdAt": now,
        "groups": [],
        "stamps": {}
    }

    db.users.insert_one(new_user)

    # Log the IP address
    db.ip_log.insert_one({"ip": ip, "timestamp": now})

    return User(**new_user)

@router.delete("/user/{email}", response_model=User)
async def delete_user(email: str):
    email = email.lower()
    print("Email", email)
    result = await db.users.find_one_and_delete({"email": email})
    print("Result", result)
    if result:
        return {"success": True}
    raise HTTPException(status_code=404, detail="User not found")
