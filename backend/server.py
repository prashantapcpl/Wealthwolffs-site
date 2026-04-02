from fastapi import FastAPI, APIRouter, HTTPException, Request, Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import httpx
import uuid
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone, timedelta

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ---- Models ----
class UserOut(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    role: str = "user"
    created_at: Optional[str] = None

class EnquiryCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    message: str

class EnquiryOut(BaseModel):
    model_config = ConfigDict(extra="ignore")
    enquiry_id: str
    name: str
    email: str
    phone: Optional[str] = None
    message: str
    status: str = "new"
    created_at: str

class NewsArticleCreate(BaseModel):
    title: str
    summary: str
    source: Optional[str] = None
    image_url: Optional[str] = None
    link: Optional[str] = None

class NewsArticleOut(BaseModel):
    model_config = ConfigDict(extra="ignore")
    article_id: str
    title: str
    summary: str
    source: Optional[str] = None
    image_url: Optional[str] = None
    link: Optional[str] = None
    created_at: str

class HiddenPageCreate(BaseModel):
    title: str
    content: str

class HiddenPageOut(BaseModel):
    model_config = ConfigDict(extra="ignore")
    page_id: str
    title: str
    content: str
    created_at: str

class TestimonialCreate(BaseModel):
    name: str
    designation: str
    quote: str
    avatar_url: Optional[str] = None

class TestimonialOut(BaseModel):
    model_config = ConfigDict(extra="ignore")
    testimonial_id: str
    name: str
    designation: str
    quote: str
    avatar_url: Optional[str] = None
    created_at: str

# ---- Auth Helpers ----
async def get_current_user(request: Request) -> dict:
    session_token = request.cookies.get("session_token")
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.split(" ")[1]
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    session_doc = await db.user_sessions.find_one({"session_token": session_token}, {"_id": 0})
    if not session_doc:
        raise HTTPException(status_code=401, detail="Invalid session")
    expires_at = session_doc["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")
    user_doc = await db.users.find_one({"user_id": session_doc["user_id"]}, {"_id": 0})
    if not user_doc:
        raise HTTPException(status_code=401, detail="User not found")
    return user_doc

async def require_admin(request: Request) -> dict:
    user = await get_current_user(request)
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# ---- Auth Endpoints ----
@api_router.post("/auth/session")
async def exchange_session(request: Request, response: Response):
    body = await request.json()
    session_id = body.get("session_id")
    if not session_id:
        raise HTTPException(status_code=400, detail="session_id required")
    async with httpx.AsyncClient() as http_client:
        resp = await http_client.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": session_id}
        )
    if resp.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid session_id")
    data = resp.json()
    email = data["email"]
    name = data.get("name", "")
    picture = data.get("picture", "")
    session_token = data.get("session_token", str(uuid.uuid4()))
    existing_user = await db.users.find_one({"email": email}, {"_id": 0})
    if existing_user:
        user_id = existing_user["user_id"]
        await db.users.update_one({"email": email}, {"$set": {"name": name, "picture": picture}})
    else:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        await db.users.insert_one({
            "user_id": user_id,
            "email": email,
            "name": name,
            "picture": picture,
            "role": "user",
            "created_at": datetime.now(timezone.utc).isoformat()
        })
    await db.user_sessions.insert_one({
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    response.set_cookie(
        key="session_token", value=session_token,
        httponly=True, secure=True, samesite="none",
        max_age=7*24*3600, path="/"
    )
    user_doc = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    return user_doc

@api_router.get("/auth/me")
async def auth_me(request: Request):
    user = await get_current_user(request)
    return user

@api_router.post("/auth/logout")
async def auth_logout(request: Request, response: Response):
    session_token = request.cookies.get("session_token")
    if session_token:
        await db.user_sessions.delete_many({"session_token": session_token})
    response.delete_cookie("session_token", path="/", secure=True, samesite="none")
    return {"message": "Logged out"}

# ---- Enquiry Endpoints ----
@api_router.post("/enquiries", response_model=EnquiryOut)
async def create_enquiry(data: EnquiryCreate):
    doc = {
        "enquiry_id": f"enq_{uuid.uuid4().hex[:12]}",
        "name": data.name,
        "email": data.email,
        "phone": data.phone,
        "message": data.message,
        "status": "new",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.enquiries.insert_one(doc)
    result = await db.enquiries.find_one({"enquiry_id": doc["enquiry_id"]}, {"_id": 0})
    return result

# ---- Admin Endpoints ----
@api_router.get("/admin/stats")
async def admin_stats(request: Request):
    await require_admin(request)
    total_users = await db.users.count_documents({})
    total_enquiries = await db.enquiries.count_documents({})
    new_enquiries = await db.enquiries.count_documents({"status": "new"})
    return {"total_users": total_users, "total_enquiries": total_enquiries, "new_enquiries": new_enquiries}

@api_router.get("/admin/users")
async def admin_users(request: Request):
    await require_admin(request)
    users = await db.users.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return users

@api_router.get("/admin/enquiries")
async def admin_enquiries(request: Request):
    await require_admin(request)
    enquiries = await db.enquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return enquiries

@api_router.put("/admin/enquiries/{enquiry_id}/status")
async def update_enquiry_status(enquiry_id: str, request: Request):
    await require_admin(request)
    body = await request.json()
    new_status = body.get("status", "reviewed")
    await db.enquiries.update_one({"enquiry_id": enquiry_id}, {"$set": {"status": new_status}})
    updated = await db.enquiries.find_one({"enquiry_id": enquiry_id}, {"_id": 0})
    return updated

@api_router.put("/admin/users/{user_id}/role")
async def update_user_role(user_id: str, request: Request):
    await require_admin(request)
    body = await request.json()
    new_role = body.get("role", "user")
    await db.users.update_one({"user_id": user_id}, {"$set": {"role": new_role}})
    updated = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    return updated

# ---- News/Media Endpoints ----
@api_router.get("/news")
async def get_news():
    articles = await db.news_articles.find({}, {"_id": 0}).sort("created_at", -1).to_list(50)
    return articles

@api_router.post("/admin/news", response_model=NewsArticleOut)
async def create_news(data: NewsArticleCreate, request: Request):
    await require_admin(request)
    doc = {
        "article_id": f"art_{uuid.uuid4().hex[:12]}",
        "title": data.title,
        "summary": data.summary,
        "source": data.source,
        "image_url": data.image_url,
        "link": data.link,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.news_articles.insert_one(doc)
    result = await db.news_articles.find_one({"article_id": doc["article_id"]}, {"_id": 0})
    return result

@api_router.delete("/admin/news/{article_id}")
async def delete_news(article_id: str, request: Request):
    await require_admin(request)
    await db.news_articles.delete_one({"article_id": article_id})
    return {"message": "Deleted"}

# ---- Hidden Pages Endpoints ----
@api_router.get("/pages/{page_id}")
async def get_hidden_page(page_id: str):
    page = await db.hidden_pages.find_one({"page_id": page_id}, {"_id": 0})
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    return page

@api_router.post("/admin/pages", response_model=HiddenPageOut)
async def create_hidden_page(data: HiddenPageCreate, request: Request):
    await require_admin(request)
    doc = {
        "page_id": f"page_{uuid.uuid4().hex[:12]}",
        "title": data.title,
        "content": data.content,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.hidden_pages.insert_one(doc)
    result = await db.hidden_pages.find_one({"page_id": doc["page_id"]}, {"_id": 0})
    return result

@api_router.get("/admin/pages")
async def list_hidden_pages(request: Request):
    await require_admin(request)
    pages = await db.hidden_pages.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return pages

@api_router.delete("/admin/pages/{page_id}")
async def delete_hidden_page(page_id: str, request: Request):
    await require_admin(request)
    await db.hidden_pages.delete_one({"page_id": page_id})
    return {"message": "Deleted"}

# ---- Testimonials Endpoints ----
@api_router.get("/testimonials")
async def get_testimonials():
    testimonials = await db.testimonials.find({}, {"_id": 0}).sort("created_at", -1).to_list(50)
    return testimonials

@api_router.post("/admin/testimonials", response_model=TestimonialOut)
async def create_testimonial(data: TestimonialCreate, request: Request):
    await require_admin(request)
    doc = {
        "testimonial_id": f"test_{uuid.uuid4().hex[:12]}",
        "name": data.name,
        "designation": data.designation,
        "quote": data.quote,
        "avatar_url": data.avatar_url,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.testimonials.insert_one(doc)
    result = await db.testimonials.find_one({"testimonial_id": doc["testimonial_id"]}, {"_id": 0})
    return result

@api_router.delete("/admin/testimonials/{testimonial_id}")
async def delete_testimonial(testimonial_id: str, request: Request):
    await require_admin(request)
    await db.testimonials.delete_one({"testimonial_id": testimonial_id})
    return {"message": "Deleted"}

# ---- Seed Data ----
@app.on_event("startup")
async def seed_data():
    # Seed admin user
    admin = await db.users.find_one({"email": "admin@wealthwolffs.com"}, {"_id": 0})
    if not admin:
        await db.users.insert_one({
            "user_id": f"user_{uuid.uuid4().hex[:12]}",
            "email": "admin@wealthwolffs.com",
            "name": "Wealthwolffs Admin",
            "picture": "",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat()
        })
    # Seed sample testimonials
    count = await db.testimonials.count_documents({})
    if count == 0:
        samples = [
            {"name": "Rajesh Sharma", "designation": "CEO, TechVentures India", "quote": "Wealthwolffs transformed our investment strategy. Their hedge solutions delivered consistent returns even during volatile markets.", "avatar_url": ""},
            {"name": "Priya Kapoor", "designation": "CFO, Global Exports Ltd", "quote": "The team at Wealthwolffs understands financial science like no one else. Their retirement planning gave us complete peace of mind.", "avatar_url": ""},
            {"name": "Amit Patel", "designation": "Founder, InnovateTech", "quote": "From mutual funds to corporate bonds, Wealthwolffs provided holistic solutions that grew our portfolio by 40% in two years.", "avatar_url": ""},
        ]
        for s in samples:
            await db.testimonials.insert_one({
                "testimonial_id": f"test_{uuid.uuid4().hex[:12]}",
                **s,
                "created_at": datetime.now(timezone.utc).isoformat()
            })
    # Seed sample news
    news_count = await db.news_articles.count_documents({})
    if news_count == 0:
        news_samples = [
            {"title": "Wealthwolffs Launches New Hedge Strategy for 2026", "summary": "Our latest hedge strategy offers 110% safe returns, outperforming traditional FDs significantly.", "source": "Wealthwolffs Blog", "image_url": "", "link": ""},
            {"title": "Indian Markets Show Strong Growth in Q1 2026", "summary": "With Sensex crossing new milestones, our analysts share insights on where to invest next.", "source": "Economic Times", "image_url": "", "link": ""},
            {"title": "Why Foreign Investors Are Choosing India", "summary": "India emerges as the top destination for foreign equity investment. Here's how Wealthwolffs helps navigate.", "source": "Mint", "image_url": "", "link": ""},
        ]
        for n in news_samples:
            await db.news_articles.insert_one({
                "article_id": f"art_{uuid.uuid4().hex[:12]}",
                **n,
                "created_at": datetime.now(timezone.utc).isoformat()
            })

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
