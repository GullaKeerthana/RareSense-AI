import numpy as np
from openai import AsyncOpenAI

from app.core.config import get_settings

settings = get_settings()
client = AsyncOpenAI(api_key=settings.openai_api_key)


async def embed_text(text: str) -> list[float]:
    response = await client.embeddings.create(model=settings.openai_embedding_model, input=text)
    return response.data[0].embedding


def cosine_similarity(a: list[float], b: list[float]) -> float:
    a_arr, b_arr = np.array(a), np.array(b)
    denom = np.linalg.norm(a_arr) * np.linalg.norm(b_arr)
    if denom == 0:
        return 0.0
    return float(np.dot(a_arr, b_arr) / denom)
