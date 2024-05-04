from fastapi import HTTPException, status, Depends
from models import User  # Assuming your User model is defined here or imported

async def get_current_user():
    # Placeholder function to simulate fetching a user
    # You need to replace this with your actual method to retrieve user details
    # return User(fullName="Alice Johnson", email="alice@example.com", groups=["admin"])
    return None

async def get_current_active_admin(current_user: User = Depends(get_current_user)):
    # if "admin" not in current_user.groups:
    #     raise HTTPException(
    #         status_code=status.HTTP_401_UNAUTHORIZED,
    #         detail="The user doesn't have admin privileges"
    #     )
    return current_user
