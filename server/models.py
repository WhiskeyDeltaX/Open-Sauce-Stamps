from pydantic import BaseModel, HttpUrl, EmailStr, UUID4
from typing import Optional
import uuid
from datetime import datetime

class Stamp(BaseModel):
    uuid: UUID4 = None
    exhibitName: str
    boothNumber: str = None
    maker: str = None
    youtubeLink: str = None
    channelName: str = None
    qrCode: UUID4 = None
    description: str = None
    createdAt: datetime = None
    updatedAt: datetime = None
    exhibitorId: str = None
    bannerUrl: str = None
    stampUrl: str = None
    makerWebsite: str = None

    class Config:
        json_schema_extra = {
            "example": {
                "uuid": "b10c4592-38fd-4cc8-96e2-e9ab3804f596",
                "exhibitName": "Future Tech",
                "boothNumber": "A1",
                "exhibitorId": "12345",
                "maker": "Tech Innovators",
                "youtubeLink": "https://www.youtube.com/embed/example1",
                "channelName": "Tech Innovators Channel",
                "qrCode": "a9ad8f89-be30-4584-befb-699fc57636db",
                "description": "Explore cutting-edge technological advancements that are shaping the future. From sustainable energy solutions to smart city innovations, see how technology will change the way we live."
            }
        }

class User(BaseModel):
    fullName: str
    email: EmailStr
    stamps: list[str]
    groups: list[str]
