from app.db.mongodb import knowledge_collection
from app.services.embeddings import cosine_similarity, embed_text

PROJECTION = {
    "embedding": 1,
    "name": 1,
    "summary": 1,
    "symptoms": 1,
    "category": 1,
    "causes": 1,
    "management": 1,
}


async def retrieve_relevant_entries(query: str, top_k: int = 3, min_score: float = 0.4) -> list[dict]:
    query_vector = await embed_text(query)
    entries = await knowledge_collection.find({}, PROJECTION).to_list(length=None)

    scored = []
    for entry in entries:
        vector = entry.get("embedding")
        if not vector:
            continue
        score = cosine_similarity(query_vector, vector)
        if score >= min_score:
            scored.append((score, entry))

    scored.sort(key=lambda pair: pair[0], reverse=True)
    return [entry for _, entry in scored[:top_k]]


def format_context(entries: list[dict]) -> str:
    blocks = []
    for entry in entries:
        blocks.append(
            f"### {entry['name']} ({entry.get('category', 'general')})\n"
            f"Summary: {entry.get('summary', '')}\n"
            f"Common symptoms: {', '.join(entry.get('symptoms', []))}\n"
            f"Management: {entry.get('management', 'N/A')}"
        )
    return "\n\n".join(blocks)
