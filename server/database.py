from pymongo import MongoClient
from motor.motor_asyncio import AsyncIOMotorClient
import os

client = AsyncIOMotorClient(os.getenv('MONGO_URL', "mongodb://localhost:27017/"))
db = client.os_stamps
stamps_table = db['stamps']
