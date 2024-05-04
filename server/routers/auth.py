from fastapi import APIRouter, Depends
import httpx
from models import User
import os

router = APIRouter()

@router.get("/auth/discord")
async def authenticate_with_discord(code: str):
    # Exchange code for token
    data = {
        'client_id': os.getenv('DISCORD_CLIENT_ID', "YOUR_CLIENT_ID"),
        'client_secret': os.getenv('DISCORD_CLIENT_SECRET', "YOUR_CLIENT_SECRET"),
        'code': code,
        'grant_type': 'authorization_code',
        'redirect_uri': os.getenv('DISCORD_REDIRECT_URL', "YOUR_REDIRECT_URI"),
    }
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    async with httpx.AsyncClient() as client:
        response = await client.post('https://discord.com/api/oauth2/token', data=data, headers=headers)
        tokens = response.json()

    # Fetch user info using token
    headers = {
        'Authorization': f"Bearer {tokens['access_token']}"
    }
    async with httpx.AsyncClient() as client:
        user_response = await client.get('https://discord.com/api/users/@me', headers=headers)
        user_data = user_response.json()

    # Save or update user data in your database
    # Return user data
    return {"user": user_data}
