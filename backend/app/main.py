import asyncio
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

logger = logging.getLogger("raresense")

from app.core.config import get_settings
from app.db.mongodb import (
    client as mongo_client,
    government_schemes_collection,
    hospitals_collection,
    knowledge_collection,
    ngos_collection,
    users_collection,
)
from app.routers import (
    auth,
    care_navigator,
    chat,
    emergency,
    hospitals,
    knowledge,
    ngos,
    reports,
    schemes,
    symptoms,
)

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await users_collection.create_index("email", unique=True)
        await knowledge_collection.create_index(
            [("name", "text"), ("summary", "text"), ("symptoms", "text"), ("aliases", "text")]
        )
        await government_schemes_collection.create_index(
            [("name", "text"), ("description", "text"), ("eligibility", "text")]
        )
        await ngos_collection.create_index(
            [("name", "text"), ("description", "text"), ("focus_area", "text")]
        )
        await hospitals_collection.create_index([("city", 1), ("specialties", 1)])
    except Exception:
        logger.warning(
            "Could not reach MongoDB at startup to create indexes — the API will still start, "
            "but requests that hit the database will fail until connectivity is restored.",
            exc_info=True,
        )
    yield


app = FastAPI(title="RareSense AI API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(symptoms.router)
app.include_router(knowledge.router)
app.include_router(schemes.router)
app.include_router(ngos.router)
app.include_router(hospitals.router)
app.include_router(reports.router)
app.include_router(care_navigator.router)
app.include_router(emergency.router)


@app.get("/health")
async def health():
    try:
        await asyncio.wait_for(mongo_client.admin.command("ping"), timeout=3)
        return {"status": "ok", "database": "connected"}
    except Exception as exc:
        return {"status": "degraded", "database": "unreachable", "detail": str(exc)[:200]}
