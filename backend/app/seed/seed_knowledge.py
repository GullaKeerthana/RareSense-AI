import asyncio

from app.db.mongodb import knowledge_collection
from app.seed.knowledge_data import KNOWLEDGE_ENTRIES
from app.services.embeddings import embed_text


async def seed() -> None:
    for entry in KNOWLEDGE_ENTRIES:
        text = (
            f"{entry['name']}. {entry['summary']} "
            f"Symptoms: {', '.join(entry['symptoms'])}. "
            f"Causes: {entry.get('causes', '')} "
            f"Management: {entry.get('management', '')}"
        )
        embedding = await embed_text(text)
        await knowledge_collection.update_one(
            {"name": entry["name"]},
            {"$set": {**entry, "embedding": embedding}},
            upsert=True,
        )
        print(f"Seeded: {entry['name']}")

    print(f"Done seeding {len(KNOWLEDGE_ENTRIES)} knowledge hub entries.")


if __name__ == "__main__":
    asyncio.run(seed())
