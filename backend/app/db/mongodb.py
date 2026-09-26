from motor.motor_asyncio import AsyncIOMotorClient

from app.core.config import get_settings

settings = get_settings()

client = AsyncIOMotorClient(settings.mongodb_uri, serverSelectionTimeoutMS=5000)
db = client[settings.mongodb_db_name]

users_collection = db["users"]
knowledge_collection = db["knowledge_entries"]
conversations_collection = db["conversations"]
symptom_checks_collection = db["symptom_checks"]
government_schemes_collection = db["government_schemes"]
ngos_collection = db["ngos"]
hospitals_collection = db["hospitals"]
report_analyses_collection = db["report_analyses"]
care_plans_collection = db["care_plans"]
