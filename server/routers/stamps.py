
from fastapi import APIRouter, Body, HTTPException, Depends
from models import Stamp
from dependencies import get_current_active_admin
from database import db, stamps_table
from datetime import datetime
import os
import qrcode
from PIL import Image
import requests
from io import BytesIO
from uuid import UUID, uuid4

router = APIRouter()

@router.get("/stamps", response_model=list[Stamp])
async def get_all_stamps():
    stamps = await stamps_table.find().to_list(1000)
    return [
        {
            "uuid": stamp["uuid"],
            "exhibitName": stamp["exhibitName"] or "",
            "maker": stamp["maker"] or "",
            "youtubeLink": stamp["youtubeLink"] or "",
            "channelName": stamp["channelName"] or "",
            "description": stamp["description"] or "",
            "createdAt": stamp["createdAt"],
            "updatedAt": stamp["updatedAt"],
            "bannerUrl": "1" if stamp["bannerUrl"] else "0",
            "stampUrl": "1" if stamp["stampUrl"] else "0",
            "qrCode": stamp["qrCode"] or "",
            "makerWebsite": stamp["makerWebsite"]
        }
        for stamp in stamps
    ]

@router.get("/stamps/{uuid}", response_model=Stamp)
async def get_stamp_by_uuid(uuid: str):
    stamp = await stamps_table.find_one({"uuid": uuid})
    if not stamp:
        raise HTTPException(status_code=404, detail="Stamp not found")
    return  {
        "uuid": stamp["uuid"],
        "exhibitName": stamp["exhibitName"] or "",
        "maker": stamp["maker"] or "",
        "youtubeLink": stamp["youtubeLink"] or "",
        "channelName": stamp["channelName"] or "",
        "description": stamp["description"] or "",
        "createdAt": stamp["createdAt"],
        "updatedAt": stamp["updatedAt"],
        "bannerUrl": "1" if stamp["bannerUrl"] else "0",
        "stampUrl": "1" if stamp["stampUrl"] else "0",
        "qrCode": stamp["qrCode"] or "",
        "makerWebsite": stamp["makerWebsite"]
    }

@router.get("/collect/{uuid}", response_model=Stamp)
async def get_collect_by_uuid(uuid: str):
    stamp = await stamps_table.find_one({"qrCode": uuid})
    if not stamp:
        raise HTTPException(status_code=404, detail="Stamp not found")
    return {
        "uuid": stamp["uuid"],
        "exhibitName": stamp["exhibitName"] or "",
        "maker": stamp["maker"] or "",
        "youtubeLink": stamp["youtubeLink"] or "",
        "channelName": stamp["channelName"] or "",
        "description": stamp["description"] or "",
        "createdAt": stamp["createdAt"],
        "updatedAt": stamp["updatedAt"],
        "bannerUrl": "1" if stamp["bannerUrl"] else "0",
        "stampUrl": "1" if stamp["stampUrl"] else "0",
        "qrCode": stamp["qrCode"] or "",
        "makerWebsite": stamp["makerWebsite"]
    }

@router.post("/stamps", response_model=Stamp, dependencies=[Depends(get_current_active_admin)])
async def create_stamp(stamp: Stamp):
    # Generate unique identifiers
    stamp.uuid = str(uuid4())
    stamp.qrCode = str(uuid4())
    stamp.youtubeLink = str(stamp.youtubeLink)

    # Generate QR code
    base_url = os.getenv('SITE_BASE_URL', 'http://example.com')
    qr_content = f"{base_url}/collect/{stamp.qrCode}"
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=7,
        border=2,
    )
    qr.add_data(qr_content)
    qr.make(fit=True)

    # Embed an image in the QR code (optional)
    qr_img = qr.make_image(fill_color="black", back_color="#EB9722").convert('RGB')
    logo_path = os.getenv("QR_CODE_IMAGE_PATH", "../open_sauce_logo_128.jpg")

    if logo_path:
        logo = Image.open(logo_path).convert("RGB")
        logo = logo.resize((120, 120), Image.LANCZOS)  # Resize logo as per QR code size
        pos = ((qr_img.size[0] - logo.size[0]) // 2, (qr_img.size[1] - logo.size[1]) // 2)
        qr_img.paste(logo, pos)

    # Save QR code image
    qr_code_path = os.getenv("QR_CODE_PATH", "../client/staticapi/qr-codes")
    qr_filename = f"{qr_code_path}/{stamp.qrCode}.png"
    qr_img.save(qr_filename)

    if stamp.description:
        response = requests.post(
            f"https://api.stability.ai/v2beta/stable-image/generate/core",
            headers={
                "authorization": f"Bearer {os.getenv('STABILITY_KEY', 'sk-MYAPIKEY')}",
                "accept": "image/*"
            },
            files={"none": ''},
            data={
                "prompt": f"Color Artwork chiaroscuro Stamp of {stamp.description[:900]}",
                "output_format": "jpeg",
            },
        )

        if response.status_code == 200:
            dream_path = os.getenv("DREAM_PATH", "../client/staticapi/stamp-icons")
            dream_image = Image.open(BytesIO(response.content))
            dream_image = dream_image.resize((512, 512), Image.LANCZOS)
            dream_image.save(f"{dream_path}/{stamp.uuid}.jpeg", quality=80)
        else:
            print("not 200", response.status_code, response.text)
    else:
        print("Failed", stamp.description)

    # Save stamp to database with additional fields
    stamp.createdAt = datetime.now()
    stamp.updatedAt = datetime.now()

    new_stamp = await stamps_table.insert_one(stamp.dict())
    created_stamp = await stamps_table.find_one({"_id": new_stamp.inserted_id})
    return created_stamp

@router.put("/stamps/{uuid}", response_model=Stamp, dependencies=[Depends(get_current_active_admin)])
async def update_stamp(uuid: UUID, stamp: Stamp):
    stamp.updated_at = datetime.now()

    updated_result = await stamps_table.update_one({"uuid": uuid}, {"$set": stamp.dict(exclude_unset=True)})
    if updated_result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Stamp not found")
    return await stamps_table.find_one({"uuid": uuid})

@router.delete("/stamps/{uuid}", dependencies=[Depends(get_current_active_admin)])
async def delete_stamp(uuid: UUID):
    delete_result = await stamps_table.delete_one({"uuid": uuid})
    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Stamp not found")
    return {"message": "Stamp deleted successfully"}

@router.delete("/stamps", dependencies=[Depends(get_current_active_admin)])
async def delete_all_stamps():
    """
    Deletes all stamps from the database.
    Access to this endpoint should be restricted to admin users only.
    """
    await stamps_table.delete_many({})
    return {"status": "success", "message": "All stamps have been deleted."}
