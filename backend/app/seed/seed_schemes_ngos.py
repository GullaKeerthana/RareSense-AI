import asyncio
import json
from pathlib import Path

from app.db.mongodb import government_schemes_collection, ngos_collection

DATA_PATH = Path(__file__).parent / "research_india_schemes_ngos.json"


async def seed() -> None:
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))

    for scheme in data["government_schemes"]:
        await government_schemes_collection.update_one(
            {"name": scheme["name"]}, {"$set": scheme}, upsert=True
        )
        print(f"Seeded scheme: {scheme['name']}")

    for ngo in data["ngos"]:
        await ngos_collection.update_one({"name": ngo["name"]}, {"$set": ngo}, upsert=True)
        print(f"Seeded NGO: {ngo['name']}")

    print(
        f"Done seeding {len(data['government_schemes'])} schemes and {len(data['ngos'])} NGOs."
    )


if __name__ == "__main__":
    asyncio.run(seed())
