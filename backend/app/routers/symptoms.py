import json

from fastapi import APIRouter, Depends
from openai import AsyncOpenAI

from app.core.config import get_settings
from app.core.deps import get_current_user
from app.db.mongodb import symptom_checks_collection
from app.models.schemas import SourceRef, SymptomCheckRequest, SymptomCheckResponse
from app.services.rag import format_context, retrieve_relevant_entries

router = APIRouter(prefix="/symptoms", tags=["symptom-awareness"])
settings = get_settings()
client = AsyncOpenAI(api_key=settings.openai_api_key)

SYSTEM_PROMPT = (
    "You are RareSense AI's Symptom Awareness assistant. You provide general, educational "
    "guidance only — you never diagnose a condition. Given a list of symptoms and reference "
    "context about rare diseases, respond ONLY with a JSON object with keys: "
    "possible_categories (an array of short strings naming general disease categories or areas "
    "that educationally relate to these symptoms — not specific diagnoses), "
    "suggested_specialist (a single string naming the type of doctor or specialist a person with "
    "these symptoms should consider consulting), and "
    "explanation (a short, plain-language paragraph explaining why, referencing the reference "
    "context when it was used). Keep everything educational and non-alarming."
)

DISCLAIMER = (
    "This is educational information only, not a medical diagnosis. Please consult a qualified "
    "healthcare professional for personal medical advice, and seek emergency care immediately for "
    "severe or worsening symptoms."
)


@router.post("/check", response_model=SymptomCheckResponse)
async def check_symptoms(payload: SymptomCheckRequest, user: dict = Depends(get_current_user)):
    query = ", ".join(payload.symptoms) + (f". Additional notes: {payload.notes}" if payload.notes else "")
    relevant_entries = await retrieve_relevant_entries(query)
    context = format_context(relevant_entries)

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {
            "role": "system",
            "content": f"Reference context:\n{context}"
            if context
            else "No closely matching reference context was found; answer from general educational knowledge.",
        },
        {"role": "user", "content": f"Symptoms: {query}"},
    ]

    completion = await client.chat.completions.create(
        model=settings.openai_chat_model,
        messages=messages,
        temperature=0.3,
        response_format={"type": "json_object"},
    )
    raw = completion.choices[0].message.content
    try:
        parsed = json.loads(raw) if raw else {}
    except json.JSONDecodeError:
        parsed = {}

    sources = [SourceRef(id=str(e["_id"]), name=e["name"]) for e in relevant_entries]

    result = SymptomCheckResponse(
        possible_categories=parsed.get("possible_categories", []),
        suggested_specialist=parsed.get("suggested_specialist", "General Practitioner"),
        explanation=parsed.get("explanation") or raw or "Unable to generate guidance for these symptoms right now.",
        sources=sources,
        disclaimer=DISCLAIMER,
    )

    await symptom_checks_collection.insert_one(
        {
            "user_id": str(user["_id"]),
            "symptoms": payload.symptoms,
            "notes": payload.notes,
            "result": result.model_dump(),
        }
    )

    return result
