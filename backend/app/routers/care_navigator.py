import json
from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from openai import AsyncOpenAI

from app.core.config import get_settings
from app.core.deps import get_current_user
from app.db.mongodb import care_plans_collection
from app.models.schemas import CarePlanRequest, CarePlanResponse, CarePlanStep
from app.services.rag import format_context, retrieve_relevant_entries

router = APIRouter(prefix="/care-navigator", tags=["ai-care-navigator"])
settings = get_settings()
client = AsyncOpenAI(api_key=settings.openai_api_key)

CATEGORY_LINKS = {
    "specialist": "/hospitals",
    "hospital": "/hospitals",
    "scheme": "/schemes",
    "ngo": "/ngos",
    "self_care": "/knowledge-hub",
    "tracking": "/symptom-checker",
}

SYSTEM_PROMPT = (
    "You are RareSense AI's Care Navigator. Given a rare-disease-relevant situation (symptoms "
    "and/or a named condition) and optional reference context, generate a personalized, ordered "
    "care journey. Respond ONLY with a JSON object: { \"summary\": \"one short paragraph\", "
    "\"steps\": [ { \"title\": \"short title\", \"description\": \"1-2 sentences\", "
    "\"category\": one of \"specialist\", \"hospital\", \"scheme\", \"ngo\", \"self_care\", "
    "\"tracking\" } ] }. Produce 4-6 concrete, ordered steps that together cover: seeing the "
    "right kind of specialist, where relevant diagnostic or treatment care can be found, "
    "checking financial assistance schemes, connecting with patient support or NGOs, and "
    "ongoing self-care or symptom tracking — only include categories that are actually "
    "relevant. Keep it educational and non-diagnostic."
)


@router.post("/plan", response_model=CarePlanResponse)
async def generate_plan(payload: CarePlanRequest, user: dict = Depends(get_current_user)):
    query = payload.input + (f". Additional notes: {payload.notes}" if payload.notes else "")
    relevant_entries = await retrieve_relevant_entries(query)
    context = format_context(relevant_entries)

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {
            "role": "system",
            "content": f"Reference context:\n{context}" if context else "No closely matching reference context found.",
        },
        {"role": "user", "content": query},
    ]

    completion = await client.chat.completions.create(
        model=settings.openai_chat_model,
        messages=messages,
        temperature=0.4,
        response_format={"type": "json_object"},
    )
    raw = completion.choices[0].message.content
    try:
        parsed = json.loads(raw) if raw else {}
    except json.JSONDecodeError:
        parsed = {}

    steps = [
        CarePlanStep(
            title=step.get("title", ""),
            description=step.get("description", ""),
            category=step.get("category", "self_care"),
            link=CATEGORY_LINKS.get(step.get("category", "self_care")),
        )
        for step in parsed.get("steps", [])
        if step.get("title")
    ]

    now = datetime.now(timezone.utc)
    doc = {
        "user_id": str(user["_id"]),
        "input": payload.input,
        "notes": payload.notes,
        "summary": parsed.get("summary", ""),
        "steps": [step.model_dump() for step in steps],
        "disclaimer": (
            "This care journey is educational guidance generated from your input, not a "
            "medical treatment plan. Confirm every step with a qualified healthcare "
            "professional."
        ),
        "created_at": now,
    }
    result = await care_plans_collection.insert_one(doc)

    return CarePlanResponse(
        id=str(result.inserted_id),
        summary=doc["summary"],
        steps=steps,
        disclaimer=doc["disclaimer"],
    )


@router.get("/history", response_model=list[CarePlanResponse])
async def get_history(user: dict = Depends(get_current_user)):
    cursor = care_plans_collection.find({"user_id": str(user["_id"])}).sort("created_at", -1)
    docs = await cursor.to_list(length=50)
    return [
        CarePlanResponse(
            id=str(doc["_id"]),
            summary=doc["summary"],
            steps=[CarePlanStep(**step) for step in doc["steps"]],
            disclaimer=doc["disclaimer"],
        )
        for doc in docs
    ]
