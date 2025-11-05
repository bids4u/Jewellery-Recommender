# 💍 Jewellery Recommender (Full Stack Prototype)

A prototype jewellery recommendation assistant that helps sales teams quickly find relevant jewellery designs based on client references.

Users can upload images, chat to refine preferences, and receive curated jewellery recommendations — all in a conversational, visual interface.

---

## 🧭 Overview

### 🖥 Frontend
- React 19 (CRA)
- TailwindCSS 3.x
- Framer Motion (animations)
- React Dropzone (file upload)
- Zustand (state management)
- Lucide Icons

### ⚙️ Backend
- FastAPI
- Uvicorn
- Aiofiles
- Python-Multipart
- Pydantic

---

## 🚀 Getting Started

### 1️⃣ Clone Repository
```bash
git clone https://github.com/yourusername/jewellery-recommender.git
cd jewellery-recommender
```
### 🧩 Frontend Setup (React + Tailwind)

📁 Path: ./jewellery-recommender

### ▶️ Install dependencies
```bash
npm install
```
⚠️ Make sure Tailwind CSS is v3.x (not v4.x) — v4 requires different PostCSS setup.
Run the app
```bash
npm start
```
This runs the React app at http://localhost:3000
### ⚙️ Configure API URL
Create .env file in the root of the frontend:
```bash
REACT_APP_API_URL=http://localhost:8000
```
### 🧱 Frontend Structure

```bash
src/
 ├── api/
 │   └── api.js               # Upload, Recommend, Select API calls
 ├── components/
 │   ├── ImageDropzone.jsx    # Drag-and-drop upload
 │   ├── AttachmentChips.jsx  # Pre-send image preview chips
 │   ├── ChatMessage.jsx      # Chat bubble rendering (text/image/product)
 │   ├── UploadFooter.jsx     # Input + Send + Attach
 ├── pages/
 │   └── Upload.jsx           # Main chat + upload interface
 ├── store/
 │   └── cartStore.js         # Zustand store for product selections
 └── index.css                # Tailwind styles
```
 ### 💬 Chat Flow (Frontend)

Greeting: Bot starts the chat with a prompt.

User Uploads Images or Describes Preferences

User Clicks “Send”

    Images → sent to /upload (backend)

    Text → sent to /recommend/{upload_id}

Backend Returns Product Cards

    Each card has “Select” → adds item to cart

User Refines Search

    “More like this…” type of follow-ups trigger /recommend again

### 💡 UI Highlights
Chat-like experience with smooth scroll

Drag-and-drop uploads with live thumbnails

Bot typing indicator

Image + text message support

Tailwind’s no-scrollbar class for clean visuals

Framer Motion for subtle transitions

“Add to Cart” integration (mock store)

### ⚙️ Available Scripts

```
| Command         | Description             |
| --------------- | ----------------------- |
| `npm start`     | Run local dev server    |
| `npm run build` | Create production build |
| `npm test`      | Run tests (optional)    |
```
### ⚡ Backend Setup (FastAPI)

📁 Path: ./Jewellery recommender fat api

### ▶️ Create virtual environment
```
python -m venv .venv
source .venv/bin/activate
```
### ▶️ Install dependencies
```
pip install -r requirements.txt
```
requirements.txt
```
fastapi
uvicorn
aiofiles
python-multipart
```
### ▶️ Run the API server
```
uvicorn app.main:app --reload --port 8000
```
Visit http://localhost:8000/docs -> for the interactive Swagger UI.

### 🧩 Backend Structure
```
app/
 ├── main.py             # Core FastAPI app
 ├── sampleimage/        # Demo jewellery image samples
 ├── storage/            # Uploaded images folder
 └── __pycache__/        # Cached modules
```
### 🔌 API Endpoints
POST /upload

Upload multiple image references.
Request:
```
curl -X POST http://localhost:8000/upload \
  -F "files=@ring.jpg" \
  -F "client_name=John Doe" \
  -F "notes=Silver floral pattern"
```
Response:
```
{
  "upload_id": "ae83b3...",
  "message": "Upload received. Call /recommend to get suggestions."
}
```
POST /recommend/{upload_id}

Get AI-like mock jewellery recommendations.
Request:
```
curl -X POST http://localhost:8000/recommend/ae83b3... \
  -F "refine_text=show me more rings with stones"
```
Response:
```
{
  "recommendations": [
    {
      "id": "p1",
      "name": "Floral Silver Ring",
      "desc": "Elegant floral engraving",
      "price": 59.0,
      "image_url": "/samples/Tourmaline-sapphire-cluster-ring_Unique-jewellery.jpg"
    }
  ],
  "message": "Recommendations ready."
}
```
POST /select
Add product to (mock) cart.
```
{ "product_id": "p1" }
```
GET /cart
Return all selected products.
Response:
```
[
  { "id": "p1", "name": "Floral Silver Ring", "desc": "Elegant floral engraving" }
]
```
GET /health
Health check:
```
{ "ok": true }
```
### 🧠 Backend Design Notes
```
| Step | Frontend Action         | Backend API                   |
| ---- | ----------------------- | ----------------------------- |
| 1    | User uploads files      | `POST /upload`                |
| 2    | Upload ID stored        | In-memory dict                |
| 3    | User sends message      | `POST /recommend/{upload_id}` |
| 4    | Bot returns suggestions | Product cards                 |
| 5    | User selects            | `POST /select`                |
| 6    | Fetch selections        | `GET /cart`                   |
```
### 🧩 Developer Tips
```
| Task              | Command                         |
| ----------------- | ------------------------------- |
| Run Backend       | `uvicorn app.main:app --reload` |
| Run Frontend      | `npm start`                     |
| Test API          | `http://localhost:8000/docs`    |
| Build Frontend    | `npm run build`                 |
| Disable Scrollbar | `.no-scrollbar` class in CSS    |
```
### 🪞 Example Flow
User uploads “floral ring” images

Bot replies with 3 suggested products

User refines with “show me more with gold finish”

System re-filters and returns new suggestions

User selects one → added to cart

### 🧰 Tech Highlights
Fast prototyping with modular React components

Modern design system (Tailwind + Framer Motion)

Full async backend (FastAPI + aiofiles)

Type-safe data models (Pydantic)

Clear separation of concerns between upload, recommend, and select flows