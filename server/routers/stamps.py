
from fastapi import APIRouter, Body, HTTPException, Depends
from models import Stamp
from dependencies import get_current_active_admin
import uuid
from database import db, stamps_table
from datetime import datetime
import os
import qrcode
from PIL import Image

router = APIRouter()

@router.get("/stamps", response_model=list[Stamp])
async def get_all_stamps():
    stamps = await stamps_table.find().to_list(1000)
    return stamps

@router.get("/stamps/{uuid}", response_model=Stamp)
async def get_stamp_by_uuid(uuid: uuid.UUID):
    stamp = await stamps_table.find_one({"uuid": uuid})
    if not stamp:
        raise HTTPException(status_code=404, detail="Stamp not found")
    return stamp

@router.post("/stamps", response_model=Stamp, dependencies=[Depends(get_current_active_admin)])
async def create_stamp(stamp: Stamp):
    # Generate unique identifiers
    stamp.uuid = str(uuid.uuid4())
    stamp.qrCode = str(uuid.uuid4())
    stamp.youtubeLink = str(stamp.youtubeLink)

    # Generate QR code
    base_url = os.getenv('SITE_BASE_URL', 'http://example.com')
    qr_content = f"{base_url}/api/collect/{stamp.qrCode}"
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(qr_content)
    qr.make(fit=True)

    # Embed an image in the QR code (optional)
    qr_img = qr.make_image(fill_color="black", back_color="#EB9722").convert('RGB')
    logo_path = os.getenv("QR_CODE_IMAGE_PATH")
    if logo_path:
        logo = Image.open(logo_path).convert("RGB")
        print ("Logo", logo)
        logo = logo.resize((120, 120), Image.LANCZOS)  # Resize logo as per QR code size
        pos = ((qr_img.size[0] - logo.size[0]) // 2, (qr_img.size[1] - logo.size[1]) // 2)
        qr_img.paste(logo, pos)

    # Save QR code image
    qr_code_path = os.getenv("QR_CODE_PATH", "./qr_codes")
    qr_filename = f"{qr_code_path}/{stamp.qrCode}.png"
    qr_img.save(qr_filename)

    # Save stamp to database with additional fields
    stamp.createdAt = datetime.now()
    stamp.updatedAt = datetime.now()

    new_stamp = await stamps_table.insert_one(stamp.dict())
    created_stamp = await stamps_table.find_one({"_id": new_stamp.inserted_id})
    return created_stamp

@router.put("/stamps/{uuid}", response_model=Stamp, dependencies=[Depends(get_current_active_admin)])
async def update_stamp(uuid: uuid.UUID, stamp: Stamp):
    stamp.updated_at = datetime.now()

    updated_result = await stamps_table.update_one({"uuid": uuid}, {"$set": stamp.dict(exclude_unset=True)})
    if updated_result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Stamp not found")
    return await stamps_table.find_one({"uuid": uuid})

@router.delete("/stamps/{uuid}", dependencies=[Depends(get_current_active_admin)])
async def delete_stamp(uuid: uuid.UUID):
    delete_result = await stamps_table.delete_one({"uuid": uuid})
    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Stamp not found")
    return {"message": "Stamp deleted successfully"}
