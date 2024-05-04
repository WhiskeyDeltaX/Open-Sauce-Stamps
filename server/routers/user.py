from fastapi import APIRouter, HTTPException
from models import User

router = APIRouter()

@router.get("/user/{email}", response_model=User)
async def get_user_data(email: str):
    user = db.users.find_one({"email": email})
    if user:
        return user
    raise HTTPException(status_code=404, detail="User not found")
