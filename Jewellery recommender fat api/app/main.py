# app/main.py
import os
import uuid
import shutil
import asyncio
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, Form, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
from fastapi.staticfiles import StaticFiles

# Where to store uploads (temp)
UPLOAD_DIR = "app/storage"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI(title="Jewellery Recommender (Mock)")

# existing UPLOAD_DIR defined earlier
SAMPLES_DIR = "app/sampleimage"
os.makedirs(SAMPLES_DIR, exist_ok=True)

app.mount("/samples", StaticFiles(directory=SAMPLES_DIR), name="samples")
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# allow your dev frontend origin(s)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # change if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----- simple models -----
class Product(BaseModel):
    id: str
    name: str
    desc: str
    price: Optional[float] = None

class UploadResponse(BaseModel):
    upload_id: str
    message: str

class RecommendResponse(BaseModel):
    recommendations: List[Product]
    message: str

class SelectRequest(BaseModel):
    product_id: str

class SelectResponse(BaseModel):
    ok: bool
    message: str

# simple in-memory store for demo (replace w/ DB in prod)
IN_MEMORY = {
    "uploads": {},    # upload_id -> list of filenames
    "cart": [],       # selected product ids
}

# sample products (mock)
SAMPLE_PRODUCTS = [
    {"id": "p1", "name": "Floral Silver Ring", "desc": "Elegant floral engraving", "price": 59.0},
    {"id": "p2", "name": "Cubic Charm Bracelet", "desc": "Set with zirconia stones", "price": 79.0},
    {"id": "p3", "name": "Minimal Band", "desc": "Matte sterling silver finish", "price": 29.0},
    {"id": "p4", "name": "Heart Pendant", "desc": "Delicate silver heart charm", "price": 49.0},
]

# Helper: save uploaded files and return list of paths
async def _save_files(files: List[UploadFile], upload_id: str):
    saved = []
    upload_folder = os.path.join(UPLOAD_DIR, upload_id)
    os.makedirs(upload_folder, exist_ok=True)
    for f in files:
        ext = os.path.splitext(f.filename)[1] or ".bin"
        filename = f"{uuid.uuid4().hex}{ext}"
        path = os.path.join(upload_folder, filename)
        async with aiofiles.open(path, "wb") as out:
            while True:
                chunk = await f.read(1024*1024)
                if not chunk:
                    break
                await out.write(chunk)
        saved.append(path)
    return saved

# For small demo, use sync saving to keep dependencies minimal
import aiofiles  # ensure python-multipart + aiofiles installed

# ---------- Endpoints ----------

@app.post("/upload", response_model=UploadResponse)
async def upload_references(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...),
    client_name: Optional[str] = Form(None),
    notes: Optional[str] = Form(None),
):
    """
    Accept image uploads (multiple). Returns an upload_id.
    The actual recommendation processing is simulated separately when frontend requests /recommend.
    """
    upload_id = uuid.uuid4().hex
    upload_folder = os.path.join(UPLOAD_DIR, upload_id)
    os.makedirs(upload_folder, exist_ok=True)

    saved = []
    for f in files:
        ext = os.path.splitext(f.filename)[1] or ".bin"
        filename = f"{uuid.uuid4().hex}{ext}"
        path = os.path.join(upload_folder, filename)
        # write file
        async with aiofiles.open(path, "wb") as out:
            content = await f.read()
            await out.write(content)
        saved.append(path)

    IN_MEMORY["uploads"][upload_id] = {
        "files": saved,
        "client_name": client_name,
        "notes": notes,
    }

    return UploadResponse(upload_id=upload_id, message="Upload received. Call /recommend to get suggestions.")

@app.post("/recommend/{upload_id}", response_model=RecommendResponse)
async def recommend(upload_id: str, refine_text: Optional[str] = Form(None)):
    """
    Simulate recommendation generation for a given upload_id.
    Returns recommendations containing image_url and text.
    """
    if upload_id not in IN_MEMORY["uploads"]:
        return RecommendResponse(recommendations=[], message="Upload id not found.")

    # simulate processing delay
    await asyncio.sleep(1.0)

    # use refine_text to slightly adapt results (mock logic)
    text = (refine_text or "").lower()

    # A simple mapping of sample filenames for demo (ensure these exist in app/sampleimage)
    sample_map = {
        "ring": "Tourmaline-sapphire-cluster-ring_Unique-jewellery_Fairina-Cheng_8ecd2611-d1f6-4a6c-8ce0-3703d85d3ddf.jpg",
        "bracelet": "TinyJewellery_MelanieKate-48.webp",
        "pendant": "Paspaley-Pandanus-Weave-Ring-Yellow-Gold-DE22R41Y.webp",
    }

    # build base candidate list (attach image_url from sample images)
    candidates = []
    for idx, p in enumerate(SAMPLE_PRODUCTS):
        # try to pick a sample image by index or by mapping
        filename = None
        if "Ring" in p["name"]:
            filename = sample_map.get("ring")
        elif "Bracelet" in p["name"]:
            filename = sample_map.get("bracelet")
        else:
            # fallback: pick any file from sample dir
            # you'll want to change this mapping to real product images
            filename = list(Path(SAMPLES_DIR).glob("*"))[idx % len(list(Path(SAMPLES_DIR).glob("*")))].name

        image_url = f"/samples/{filename}"
        candidates.append({**p, "image_url": image_url})

    # filter/mock refine behaviour
    if "ring" in text:
        results = [c for c in candidates if "Ring" in c["name"] or "Band" in c["name"]]
    elif "bracelet" in text:
        results = [c for c in candidates if "Bracelet" in c["name"]]
    elif text:
        results = candidates[:3]
    else:
        results = candidates[:3]

    # Convert to Product models with image_url key (use Pydantic or plain dict)
    recs = []
    for r in results:
        recs.append(Product(id=r["id"], name=r["name"], desc=r["desc"], price=r.get("price")))

    # But we need to add image_url to the response; since RecommendResponse uses Product,
    # you can return the URLs in a separate field or return dict directly.
    # Simpler: return a dict response here:
    return {
        "recommendations": [
            {"id": r["id"], "name": r["name"], "desc": r["desc"], "price": r.get("price"), "image_url": f"/samples/{sample_map.get('ring') if 'Ring' in r['name'] else sample_map.get('bracelet')}"}
            for r in results
        ],
        "message": "Recommendations ready."
    }
    
@app.post("/recommend", response_model=Optional[dict])
async def recommend_fallback(
    files: Optional[List[UploadFile]] = File(None),
    refine_text: Optional[str] = Form(None),
    upload_id: Optional[str] = Form(None),
):
    """
    Fallback recommend endpoint:
    - If 'files' are sent, save them and create a temporary upload_id then proceed.
    - If upload_id is provided in form, use the existing upload.
    - If only refine_text, return recommendations based on text.
    """
    # If files present, save them into a new upload_id
    temp_upload_id = upload_id
    if files:
        temp_upload_id = uuid.uuid4().hex
        upload_folder = os.path.join(UPLOAD_DIR, temp_upload_id)
        os.makedirs(upload_folder, exist_ok=True)
        saved = []
        for f in files:
            ext = os.path.splitext(f.filename)[1] or ".bin"
            filename = f"{uuid.uuid4().hex}{ext}"
            path = os.path.join(upload_folder, filename)
            async with aiofiles.open(path, "wb") as out:
                content = await f.read()
                await out.write(content)
            saved.append(path)
        IN_MEMORY["uploads"][temp_upload_id] = {"files": saved, "client_name": None, "notes": None}

    # If neither upload_id nor files were provided, we still process refine_text only
    # Use the same logic as your existing recommend endpoint to return results
    # (You can refactor duplicate logic into a helper function; here we'll reuse)
    # For simplicity, reuse earlier logic but allow missing upload_id:
    text = (refine_text or "").lower()

    # Build candidate list from SAMPLE_PRODUCTS and sample_map (ensure SAMPLES_DIR exists)
    sample_map = {
        "ring": "Tourmaline-sapphire-cluster-ring_Unique-jewellery_Fairina-Cheng_8ecd2611-d1f6-4a6c-8ce0-3703d85d3ddf.jpg",
        "bracelet": "TinyJewellery_MelanieKate-48.webp",
        "pendant": "Paspaley-Pandanus-Weave-Ring-Yellow-Gold-DE22R41Y.webp",
    }

    candidates = []
    sample_files = list(Path(SAMPLES_DIR).glob("*"))
    for idx, p in enumerate(SAMPLE_PRODUCTS):
        if "Ring" in p["name"]:
            filename = sample_map.get("ring")
        elif "Bracelet" in p["name"]:
            filename = sample_map.get("bracelet")
        else:
            filename = sample_files[idx % len(sample_files)].name if sample_files else None
        image_url = f"/samples/{filename}" if filename else None
        candidates.append({**p, "image_url": image_url})

    if "ring" in text:
        results = [c for c in candidates if "Ring" in c["name"] or "Band" in c["name"]]
    elif "bracelet" in text:
        results = [c for c in candidates if "Bracelet" in c["name"]]
    elif text:
        results = candidates[:3]
    else:
        # if upload_id present and exists, you might want to use its files for smarter results.
        results = candidates[:3]

    # Return dict with image_url included (not using pydantic model here)
    return {"recommendations": [
        {"id": r["id"], "name": r["name"], "desc": r["desc"], "price": r.get("price"), "image_url": r.get("image_url")}
        for r in results
    ], "message": "Recommendations ready."}

@app.post("/select", response_model=SelectResponse)
async def select_product(req: SelectRequest):
    """
    Record a product selection (adds to in-memory cart). In prod you'd persist to DB.
    """
    pid = req.product_id
    found = next((p for p in SAMPLE_PRODUCTS if p["id"] == pid), None)
    if not found:
        return SelectResponse(ok=False, message="Product not found.")
    IN_MEMORY["cart"].append(found)
    return SelectResponse(ok=True, message=f"Added {found['name']} to selection.")

@app.get("/cart", response_model=List[Product])
def get_cart():
    return [Product(**p) for p in IN_MEMORY["cart"]]

# simple health
@app.get("/health")
def health():
    return {"ok": True}
