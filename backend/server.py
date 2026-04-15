from datetime import datetime, timezone
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from hashlib import sha256
from html import escape
import hmac
import logging
import os
import smtplib
from pathlib import Path
from typing import List, Literal, Optional

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, FastAPI, HTTPException, Request
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from starlette.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)
DEFAULT_ADMIN_USERNAME = "danteivery"
DEFAULT_ADMIN_PASSWORD = "1234"

mongo_url = os.getenv("MONGO_URL")
db_name = os.getenv("DB_NAME", "open_circuit_solutions")
client = AsyncIOMotorClient(mongo_url) if mongo_url else None
db = client[db_name] if client and db_name else None

app = FastAPI(title="Open Circuit Solutions API")
api_router = APIRouter(prefix="/api")


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def utc_now_iso() -> str:
    return utc_now().isoformat()


def default_content_records() -> List[dict]:
    timestamp = utc_now_iso()
    return [
        {
            "content_id": "hero_title",
            "content_type": "text",
            "value": "Building Digital Solutions That Matter",
            "section": "hero",
            "label": "Hero Title",
            "updated_at": timestamp,
        },
        {
            "content_id": "hero_subtitle",
            "content_type": "text",
            "value": "Transforming ideas into powerful apps and websites",
            "section": "hero",
            "label": "Hero Subtitle",
            "updated_at": timestamp,
        },
        {
            "content_id": "hero_image",
            "content_type": "image",
            "value": "https://images.unsplash.com/photo-1619241805829-34fb64299391?auto=format&fit=crop&q=80",
            "section": "hero",
            "label": "Hero Image",
            "updated_at": timestamp,
        },
        {
            "content_id": "hero_stat_projects_value",
            "content_type": "text",
            "value": "10+",
            "section": "hero",
            "label": "Hero Projects Stat Value",
            "updated_at": timestamp,
        },
        {
            "content_id": "hero_stat_projects_label",
            "content_type": "text",
            "value": "Projects Delivered",
            "section": "hero",
            "label": "Hero Projects Stat Label",
            "updated_at": timestamp,
        },
        {
            "content_id": "hero_stat_satisfaction_value",
            "content_type": "text",
            "value": "100%",
            "section": "hero",
            "label": "Hero Satisfaction Stat Value",
            "updated_at": timestamp,
        },
        {
            "content_id": "hero_stat_satisfaction_label",
            "content_type": "text",
            "value": "Client Satisfaction",
            "section": "hero",
            "label": "Hero Satisfaction Stat Label",
            "updated_at": timestamp,
        },
        {
            "content_id": "about_title",
            "content_type": "text",
            "value": "About Open Circuit Solutions",
            "section": "about",
            "label": "About Title",
            "updated_at": timestamp,
        },
        {
            "content_id": "about_description",
            "content_type": "text",
            "value": "I'm Dante Ivery, CEO of Open Circuit Solutions. I specialize in building custom applications and websites that help businesses thrive in the digital world. From mobile apps to responsive websites, I deliver solutions that combine cutting-edge technology with intuitive design.",
            "section": "about",
            "label": "About Description",
            "updated_at": timestamp,
        },
        {
            "content_id": "stat_projects_value",
            "content_type": "text",
            "value": "10+",
            "section": "about",
            "label": "Projects Stat Value",
            "updated_at": timestamp,
        },
        {
            "content_id": "stat_projects_label",
            "content_type": "text",
            "value": "Projects Completed",
            "section": "about",
            "label": "Projects Stat Label",
            "updated_at": timestamp,
        },
        {
            "content_id": "stat_clients_value",
            "content_type": "text",
            "value": "5+",
            "section": "about",
            "label": "Clients Stat Value",
            "updated_at": timestamp,
        },
        {
            "content_id": "stat_clients_label",
            "content_type": "text",
            "value": "Happy Clients",
            "section": "about",
            "label": "Clients Stat Label",
            "updated_at": timestamp,
        },
        {
            "content_id": "stat_experience_value",
            "content_type": "text",
            "value": "3+",
            "section": "about",
            "label": "Experience Stat Value",
            "updated_at": timestamp,
        },
        {
            "content_id": "stat_experience_label",
            "content_type": "text",
            "value": "Years Experience",
            "section": "about",
            "label": "Experience Stat Label",
            "updated_at": timestamp,
        },
        {
            "content_id": "stat_support_value",
            "content_type": "text",
            "value": "24/7",
            "section": "about",
            "label": "Support Stat Value",
            "updated_at": timestamp,
        },
        {
            "content_id": "stat_support_label",
            "content_type": "text",
            "value": "Support Available",
            "section": "about",
            "label": "Support Stat Label",
            "updated_at": timestamp,
        },
    ]


DEFAULT_CONTENT = default_content_records()
DEFAULT_CONTENT_MAP = {item["content_id"]: item for item in DEFAULT_CONTENT}


def build_content_record(content_id: str, value: str) -> dict:
    template = DEFAULT_CONTENT_MAP.get(content_id)
    if template:
        record = dict(template)
        record["value"] = value
        record["updated_at"] = utc_now_iso()
        return record

    content_type = "image" if value.startswith(("http://", "https://", "data:image/")) else "text"
    section = content_id.split("_", 1)[0] if "_" in content_id else "general"
    return {
        "content_id": content_id,
        "content_type": content_type,
        "value": value,
        "section": section,
        "label": content_id.replace("_", " ").title(),
        "updated_at": utc_now_iso(),
    }


def get_admin_username() -> Optional[str]:
    return os.getenv("ADMIN_USERNAME", DEFAULT_ADMIN_USERNAME)


def get_admin_password() -> Optional[str]:
    return os.getenv("ADMIN_PASSWORD", DEFAULT_ADMIN_PASSWORD)


def admin_is_configured() -> bool:
    return True


def build_admin_token() -> Optional[str]:
    username = get_admin_username()
    password = get_admin_password()
    if not username or not password:
        return None

    salt = os.getenv("ADMIN_TOKEN_SALT", "open-circuit-solutions-admin")
    raw = f"{username}:{password}:{salt}".encode("utf-8")
    return sha256(raw).hexdigest()


async def require_admin(request: Request) -> None:
    expected_token = build_admin_token()
    if not expected_token:
        raise HTTPException(
            status_code=503,
            detail="Admin credentials are not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD.",
        )

    authorization = request.headers.get("authorization", "")
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")

    token = authorization.split(" ", 1)[1]
    if not hmac.compare_digest(token, expected_token):
        raise HTTPException(status_code=401, detail="Unauthorized")


async def require_database():
    if db is None:
        raise HTTPException(
            status_code=503,
            detail="Database is not configured. Set MONGO_URL and DB_NAME to enable persistence.",
        )
    return db


async def ensure_default_content_records() -> None:
    if db is None:
        return

    existing = await db.editable_content.find({}, {"_id": 0, "content_id": 1}).to_list(1000)
    existing_ids = {item["content_id"] for item in existing}
    missing = [item for item in default_content_records() if item["content_id"] not in existing_ids]
    if missing:
        await db.editable_content.insert_many(missing)


class AuthRequest(BaseModel):
    username: str
    password: str


class AuthResponse(BaseModel):
    success: bool
    token: Optional[str] = None
    message: Optional[str] = None


class EditableContent(BaseModel):
    model_config = ConfigDict(extra="ignore")

    content_id: str
    content_type: Literal["text", "image"]
    value: str
    section: str
    label: str
    updated_at: datetime = Field(default_factory=utc_now)


class EditableContentUpdate(BaseModel):
    value: str


class PortfolioProject(BaseModel):
    model_config = ConfigDict(extra="ignore")

    project_id: str
    title: str
    description: str
    full_description: str
    project_type: Literal["app", "website"]
    video_url: str
    seo_keywords: List[str] = []
    order: int = 0
    created_at: datetime = Field(default_factory=utc_now)


class PortfolioProjectCreate(BaseModel):
    title: str
    description: str
    full_description: str
    project_type: Literal["app", "website"]
    video_url: str
    seo_keywords: List[str] = []


class ContactFormSubmission(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    subject: str
    message: str


@api_router.post("/auth/login", response_model=AuthResponse)
async def login(auth: AuthRequest):
    if not admin_is_configured():
        return AuthResponse(
            success=False,
            message="Admin login is disabled until ADMIN_USERNAME and ADMIN_PASSWORD are configured.",
        )

    if not hmac.compare_digest(auth.username, get_admin_username() or ""):
        return AuthResponse(success=False, message="Invalid credentials.")

    if not hmac.compare_digest(auth.password, get_admin_password() or ""):
        return AuthResponse(success=False, message="Invalid credentials.")

    return AuthResponse(
        success=True,
        token=build_admin_token(),
        message="Edit mode enabled.",
    )


@api_router.get("/content", response_model=List[EditableContent])
async def get_all_content():
    if db is None:
        return [EditableContent(**item) for item in default_content_records()]

    await ensure_default_content_records()
    content = await db.editable_content.find({}, {"_id": 0}).to_list(1000)
    return [EditableContent(**item) for item in content]


@api_router.get("/content/{content_id}", response_model=EditableContent)
async def get_content(content_id: str):
    if db is None:
        fallback = DEFAULT_CONTENT_MAP.get(content_id)
        if not fallback:
            raise HTTPException(status_code=404, detail="Content not found")
        return EditableContent(**fallback)

    await ensure_default_content_records()
    content = await db.editable_content.find_one({"content_id": content_id}, {"_id": 0})
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    return EditableContent(**content)


@api_router.put("/content/{content_id}")
async def update_content(
    content_id: str,
    update: EditableContentUpdate,
    _admin: None = Depends(require_admin),
):
    database = await require_database()
    await ensure_default_content_records()

    update_data = build_content_record(content_id, update.value)
    await database.editable_content.update_one(
        {"content_id": content_id},
        {"$set": update_data},
        upsert=True,
    )
    return {"success": True, "message": "Content updated"}


@api_router.get("/portfolio", response_model=List[PortfolioProject])
async def get_portfolio():
    if db is None:
        return []

    projects = await db.portfolio.find({}, {"_id": 0}).sort("order", 1).to_list(1000)
    return [PortfolioProject(**project) for project in projects]


@api_router.post("/portfolio", response_model=PortfolioProject)
async def create_project(
    project: PortfolioProjectCreate,
    _admin: None = Depends(require_admin),
):
    import uuid

    database = await require_database()
    existing_projects = await database.portfolio.find({}, {"_id": 0}).to_list(1000)
    next_order = len(existing_projects)

    project_data = project.model_dump()
    project_data["project_id"] = str(uuid.uuid4())
    project_data["order"] = next_order
    project_data["created_at"] = utc_now_iso()

    await database.portfolio.insert_one(project_data)
    return PortfolioProject(**project_data)


@api_router.put("/portfolio/{project_id}")
async def update_project(
    project_id: str,
    update: PortfolioProjectCreate,
    _admin: None = Depends(require_admin),
):
    database = await require_database()
    existing = await database.portfolio.find_one({"project_id": project_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Project not found")

    await database.portfolio.update_one(
        {"project_id": project_id},
        {"$set": update.model_dump()},
    )
    return {"success": True, "message": "Project updated"}


@api_router.delete("/portfolio/{project_id}")
async def delete_project(
    project_id: str,
    _admin: None = Depends(require_admin),
):
    database = await require_database()
    result = await database.portfolio.delete_one({"project_id": project_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"success": True, "message": "Project deleted"}


@api_router.post("/contact")
async def submit_contact_form(submission: ContactFormSubmission):
    try:
        smtp_server = os.getenv("SMTP_SERVER")
        smtp_port = int(os.getenv("SMTP_PORT", "465"))
        smtp_user = os.getenv("SMTP_USER")
        smtp_password = os.getenv("SMTP_PASSWORD")

        if not smtp_server or not smtp_user or not smtp_password:
            raise HTTPException(
                status_code=500,
                detail="Email configuration is not set. Add SMTP_SERVER, SMTP_PORT, SMTP_USER, and SMTP_PASSWORD.",
            )

        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"Open Circuit Solutions Contact: {submission.subject}"
        msg["From"] = smtp_user
        msg["To"] = smtp_user
        msg["Reply-To"] = submission.email

        html_body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
                    <div style="background: #0B0F14; color: #F5F5F5; padding: 20px; text-align: center;">
                        <h2 style="color: #D4AF37; margin: 0;">New Contact Form Submission</h2>
                        <p style="color: #A1A1AA; margin: 5px 0;">Open Circuit Solutions</p>
                    </div>
                    <div style="background: white; padding: 30px; margin-top: 20px; border-radius: 5px;">
                        <h3 style="color: #0B0F14; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">Contact Details</h3>
                        <p><strong>Name:</strong> {escape(submission.first_name)} {escape(submission.last_name)}</p>
                        <p><strong>Email:</strong> <a href="mailto:{escape(submission.email)}">{escape(submission.email)}</a></p>
                        <p><strong>Phone:</strong> {escape(submission.phone)}</p>
                        <p><strong>Subject:</strong> {escape(submission.subject)}</p>
                        <h3 style="color: #0B0F14; border-bottom: 2px solid #D4AF37; padding-bottom: 10px; margin-top: 30px;">Message</h3>
                        <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #D4AF37; margin-top: 10px;">
                            <p style="white-space: pre-wrap;">{escape(submission.message)}</p>
                        </div>
                    </div>
                    <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
                        <p>This email was sent from the Open Circuit Solutions contact form</p>
                    </div>
                </div>
            </body>
        </html>
        """

        msg.attach(MIMEText(html_body, "html"))

        with smtplib.SMTP_SSL(smtp_server, smtp_port) as server:
            server.login(smtp_user, smtp_password)
            server.send_message(msg)

        if db is not None:
            submission_data = submission.model_dump()
            submission_data["submitted_at"] = utc_now_iso()
            await db.contact_submissions.insert_one(submission_data)

        return {"success": True, "message": "Your message has been sent successfully!"}

    except smtplib.SMTPException as exc:
        logger.error("SMTP error: %s", exc)
        raise HTTPException(
            status_code=500,
            detail="Failed to send email. Please verify the SMTP configuration.",
        ) from exc
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("Contact form error: %s", exc)
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while sending your message.",
        ) from exc


@api_router.post("/init-content")
async def initialize_content(_admin: None = Depends(require_admin)):
    database = await require_database()
    defaults = default_content_records()
    await database.editable_content.delete_many({})
    await database.editable_content.insert_many(defaults)
    return {"success": True, "message": "Content initialized"}


@api_router.get("/")
async def root():
    return {
        "message": "Open Circuit Solutions API",
        "status": "operational",
        "databaseConfigured": db is not None,
        "adminConfigured": admin_is_configured(),
    }


app.include_router(api_router)

cors_origins = [origin.strip() for origin in os.getenv("CORS_ORIGINS", "*").split(",") if origin.strip()]
if not cors_origins:
    cors_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_credentials=cors_origins != ["*"],
    allow_origins=cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    if client is not None:
        client.close()
