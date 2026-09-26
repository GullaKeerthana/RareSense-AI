import asyncio

from app.db.mongodb import hospitals_collection
from app.seed.hospitals_data import HOSPITALS


async def seed() -> None:
    for hospital in HOSPITALS:
        await hospitals_collection.update_one(
            {"name": hospital["name"]}, {"$set": hospital}, upsert=True
        )
        print(f"Seeded hospital: {hospital['name']}")

    print(f"Done seeding {len(HOSPITALS)} hospitals.")


if __name__ == "__main__":
    asyncio.run(seed())
