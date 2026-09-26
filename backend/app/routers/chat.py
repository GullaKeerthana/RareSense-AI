import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from openai import AsyncOpenAI

from app.core.config import get_settings
from app.core.deps import get_current_user
from app.db.mongodb import conversations_collection
from app.models.schemas import ChatRequest, ChatResponse, SourceRef
from app.services.rag import format_context, retrieve_relevant_entries

router = APIRouter(prefix="/chat", tags=["ai-health-assistant"])
settings = get_settings()
client = AsyncOpenAI(api_key=settings.openai_api_key)

SYSTEM_PROMPT = (
    "You are the RareSense AI Health Assistant, an educational guide for rare disease "
    "awareness. Answer using the provided reference context when it is relevant. Always: "
    "(1) stay educational and never diagnose a specific condition; (2) recommend consulting "
    "a qualified specialist for personal medical concerns; (3) reply in the same language the "
    "user wrote in; (4) be clear and reassuring, avoiding alarming language. If the reference "
    "context does not cover the question, say so honestly instead of guessing."
)


@router.post("", response_model=ChatResponse)
async def chat(payload: ChatRequest, user: dict = Depends(get_current_user)):
    conversation_id = payload.conversation_id or str(uuid.uuid4())

    conversation = await conversations_collection.find_one(
        {"_id": conversation_id, "user_id": str(user["_id"])}
    )
    history = conversation["messages"] if conversation else []

    relevant_entries = await retrieve_relevant_entries(payload.message)
    context = format_context(relevant_entries)

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    if context:
        messages.append({"role": "system", "content": f"Reference context:\n{context}"})
    messages.extend(history[-10:])
    messages.append({"role": "user", "content": payload.message})

    completion = await client.chat.completions.create(
        model=settings.openai_chat_model,
        messages=messages,
        temperature=0.4,
    )
    reply = completion.choices[0].message.content or ""

    new_messages = history + [
        {"role": "user", "content": payload.message},
        {"role": "assistant", "content": reply},
    ]
    now = datetime.now(timezone.utc)
    await conversations_collection.update_one(
        {"_id": conversation_id},
        {
            "$set": {"user_id": str(user["_id"]), "messages": new_messages, "updated_at": now},
            "$setOnInsert": {"created_at": now},
        },
        upsert=True,
    )

    sources = [SourceRef(id=str(e["_id"]), name=e["name"]) for e in relevant_entries]
    explanation = (
        f"Answered using {len(relevant_entries)} matching Knowledge Hub entr"
        f"{'y' if len(relevant_entries) == 1 else 'ies'}: {', '.join(e['name'] for e in relevant_entries)}."
        if relevant_entries
        else "Answered from general knowledge — no closely matching Knowledge Hub entry was found."
    )

    return ChatResponse(conversation_id=conversation_id, reply=reply, sources=sources, explanation=explanation)
