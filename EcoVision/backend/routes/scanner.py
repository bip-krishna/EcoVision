import random
from fastapi import APIRouter, UploadFile, File, HTTPException
from models.carbon import ScanResponse

router = APIRouter(prefix="/api/scan")

DEMO_ITEMS = [
    {"object": "bottle", "category": "Plastic Waste", "impact": "Medium", "suggestion": "Recycle in plastic bin"},
    {"object": "newspaper", "category": "Paper Waste", "impact": "Low", "suggestion": "Recycle in paper bin"},
    {"object": "apple", "category": "Organic Waste", "impact": "Low", "suggestion": "Compost in organic bin"},
    {"object": "can", "category": "Metal Waste", "impact": "Medium", "suggestion": "Recycle in metal bin"},
    {"object": "phone", "category": "E-Waste", "impact": "High", "suggestion": "Take to e-waste recycling center"},
]


@router.post("", response_model=ScanResponse)
async def scan_image(image: UploadFile = File(...)):
    if not image:
        raise HTTPException(status_code=400, detail="No image uploaded")

    contents = await image.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Empty image file")

    item = random.choice(DEMO_ITEMS)
    return ScanResponse(**item)
