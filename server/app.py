
from fastapi import FastAPI
from dotenv import load_dotenv
import os
from fastapi.middleware.cors import CORSMiddleware
import gspread
import pandas as pd
from oauth2client.service_account import ServiceAccountCredentials
from uuid import UUID, uuid4
from datetime import datetime
from database import db, stamps_table
import models
import requests
from routers import user, stamps, auth
import qrcode
from io import BytesIO
import os.path
import asyncio
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
import io
from PIL import Image, ImageDraw, ImageFont

# Load environment variables from .env file
load_dotenv()

# Google Sheets setup
scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
credentials = ServiceAccountCredentials.from_json_keyfile_name(
    os.getenv('CREDENTIALS_JSON', 'credentials.json'), scope)
client = gspread.authorize(credentials)

# Google Drive setup
drive_credentials = service_account.Credentials.from_service_account_file(
    os.getenv('CREDENTIALS_JSON', 'credentials.json'), scopes=["https://www.googleapis.com/auth/drive"]
)
drive_service = build('drive', 'v3', credentials=drive_credentials)

async def fetch_data_from_google_sheets(sheet_id, sheet_name):
    sheet = client.open_by_key(sheet_id).worksheet(sheet_name)
    data = sheet.get_all_records()
    df = pd.DataFrame(data)
    return df

def generate_qr_code(stamp):
    # Generate QR code
    base_url = os.getenv('SITE_BASE_URL', 'http://example.com')
    qr_content = f"{base_url}/collect/{stamp['qrCode']}"
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=7,
        border=2,
    )
    qr.add_data(qr_content)
    qr.make(fit=True)

    # Embed an image in the QR code (optional)
    qr_img = qr.make_image(fill_color="black", back_color="white").convert('RGB')
    logo_path = os.getenv("QR_CODE_IMAGE_PATH", "./open_sauce_logo_128.jpg")

    if logo_path:
        logo = Image.open(logo_path).convert("RGB")
        logo = logo.resize((120, 120), Image.LANCZOS)  # Resize logo as per QR code size
        pos = ((qr_img.size[0] - logo.size[0]) // 2, (qr_img.size[1] - logo.size[1]) // 2)
        qr_img.paste(logo, pos)

    # Add space at the bottom
    extra_space = int(os.getenv('QR_CODE_EXTRA_SPACE', 50))  # Customize the extra space
    new_height = qr_img.size[1] + extra_space
    new_img = Image.new('RGB', (qr_img.size[0], new_height), 'white')
    new_img.paste(qr_img, (0, 0))

    # Add text
    draw = ImageDraw.Draw(new_img)
    font_path = os.getenv("FONT_PATH", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")  # Customize the font path
    font_size = int(os.getenv("FONT_SIZE", 16))  # Customize the font size
    font = ImageFont.truetype(font_path, font_size)
    text = stamp["exhibitName"]
    text_bbox = draw.textbbox((0, 0), text, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    text_x = (new_img.size[0] - text_width) // 2
    text_y = qr_img.size[1] + (extra_space - text_height) // 2 - 10
    draw.text((text_x, text_y), text, fill="black", font=font)

    # Save QR code image
    qr_code_path = os.getenv("QR_CODE_PATH", "../client/staticapi/qr-codes")
    qr_filename = f"{qr_code_path}/{stamp['qrCode']}.png"
    new_img.save(qr_filename)

def generate_stamp_icon(stamp, path):
    if stamp["description"]:
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
            dream_path = path
            dream_image = Image.open(BytesIO(response.content))
            dream_image = dream_image.resize((512, 512), Image.LANCZOS)
            dream_image.save(image_path, quality=80)
        else:
            print("not 200", response.status_code, response.text)
    else:
        print("Failed", stamp["description"])


async def process_row(row):
    exhibitor_id = row[2]
    existing_stamp = await stamps_table.find_one({"exhibitorId": exhibitor_id}) or {}

    stamp_data = {
        "uuid": existing_stamp.get("uuid", str(uuid4())),
        "exhibitName": row[3],
        "exhibitorId": exhibitor_id,
        "maker": row[4],
        "description": row[5],
        "youtubeLink": row[6],
        "makerWebsite": row[7],
        "qrCode": existing_stamp.get("qrCode", str(uuid4())),
        "createdAt": existing_stamp.get("createdAt", datetime.utcnow()),
        "updatedAt": datetime.utcnow(),
        "bannerUrl": existing_stamp.get("bannerUrl", ""),
        "stampUrl": existing_stamp.get("stampUrl", "")
    }

    print("Looking at stamp", stamp_data["exhibitName"])
    # print("Stamp data", stamp_data)

    # Handle Google Drive image
    image_url = row.iloc[8]
    image_path = os.path.join(os.getenv("STAMP_PATH", "../client/staticapi/stamp-icons"), f"{stamp_data['uuid']}.jpg")

    if "drive.google.com" in image_url and (image_url != stamp_data["stampUrl"] or not os.path.isfile(image_path)):
        print("Stamp Data", stamp_data)
        try:
            await download_and_store_image(image_url, image_path)
            stamp_data["stampUrl"] = image_url
        except Exception as e:
            print("Failed to download stamp URL", e)
    elif not existing_stamp and not image_url:
        generate_stamp_icon(image_path)

    # Handle Google Drive image
    image_url = row.iloc[9]
    image_path = os.path.join(os.getenv("EXHIBIT_BANNER_PATH", "../client/staticapi/exhibit-banners"), f"{stamp_data['uuid']}.jpg")

    if "drive.google.com" in image_url and (image_url != stamp_data["bannerUrl"] or not os.path.isfile(image_path)):
        # try:
        #     await download_and_store_image(image_url, image_path)
        #     stamp_data["bannerUrl"] = image_url
        # except Exception as e:
        #     print("Failed to download banner URL", e)
        pass

    if not existing_stamp:
        await stamps_table.insert_one(stamp_data)
        generate_qr_code(stamp_data)
    else:
        await stamps_table.update_one({"exhibitorId": exhibitor_id}, {"$set": stamp_data})

        qr_code_path = os.getenv("QR_CODE_PATH", "../client/staticapi/qr-codes")
        qr_filename = f"{qr_code_path}/{stamp_data['qrCode']}.png"

        if not os.path.isfile(qr_filename):
            generate_qr_code(stamp_data)

    base_url = os.getenv('SITE_BASE_URL', 'http://example.com')
    return f"{base_url}/staticapi/qr-codes/{stamp_data['qrCode']}.png"

async def download_and_store_image(url, image_path):
    # Convert Google Drive link to file ID
    if "drive.google.com" in url:
        if "id=" in url:
            file_id = url.split('id=')[1]
        elif "/d/" in url:
            file_id = url.split('/d/')[1].split('/')[0]
        else:
            print(f"Invalid Google Drive URL: {url}")
            return

    print("Downloading from Google Drive with file ID", file_id)

    request = drive_service.files().get_media(fileId=file_id)
    fh = io.FileIO(image_path, 'wb')
    downloader = MediaIoBaseDownload(fh, request)

    done = False
    while not done:
        status, done = downloader.next_chunk()
        print("Download %d%%." % int(status.progress() * 100))

    print(f"Image saved at {image_path}")

def get_confirm_token(response):
    for key, value in response.cookies.items():
        if key.startswith("download_warning"):
            return value

    return None

def save_response_content(response, destination):
    CHUNK_SIZE = 32768

    with open(destination, "wb") as f:
        for chunk in response.iter_content(CHUNK_SIZE):
            if chunk:  # filter out keep-alive new chunks
                f.write(chunk)

async def write_data_to_google_sheets(sheet_id, sheet_name, data):
    # Open the Google Sheet
    sheet = client.open_by_key(sheet_id)
    worksheet = sheet.worksheet(sheet_name)

    # Convert DataFrame to a list of lists
    data_list = data.values.tolist()

    # Update the worksheet with the new data
    worksheet.update('A1', [data.columns.tolist()] + data_list)

app = FastAPI()

async def check_google_sheets_new_data():
    while True:
        sheet_id = os.getenv('EXHIBITORS_SHEET_ID', 'exhibitorsheetid')
        sheet_name = os.getenv('EXHIBITORS_SHEET_NAME', 'exhibitorsheetid')
        data = await fetch_data_from_google_sheets(sheet_id, sheet_name)

        # Identify the last occurrence of each exhibitor_id
        data['index'] = data.index
        last_occurrences = data.groupby(data.columns[2])['index'].max()

        updated_rows = []

        for idx, row in data.loc[last_occurrences].iterrows():
            try:
                processed_value = await process_row(row)

                if pd.isna(row['QR Code URL']) or not row['QR Code URL']:
                    data.at[idx, 'QR Code URL'] = processed_value  # Write the value into Column L
                    updated_rows.append(idx)
                    print("Updating the data at L")
            except Exception as e:
                print("Failed to process row:", e)

        if updated_rows:
            await write_data_to_google_sheets(sheet_id, sheet_name, data)

        await asyncio.sleep(900)  # Sleep for 15 minutes

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(check_google_sheets_new_data())

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router, prefix="/api/v1", tags=["users"])
app.include_router(stamps.router, prefix="/api/v1", tags=["stamps"])
app.include_router(auth.router, prefix="/api/v1", tags=["auth"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, debug=True, log_level='debug', access_log=True)
