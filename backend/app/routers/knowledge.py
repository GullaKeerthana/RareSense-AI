from typing import Optional

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, Query
from pymongo import ReturnDocument

from app.core.deps import require_roles
from app.db.mongodb import knowledge_collection
from app.models.schemas import KnowledgeEntry, KnowledgeEntryInput, UserRole
from app.services.embeddings import embed_text

router = APIRouter(prefix="/knowledge", tags=["knowledge-hub"])


def _to_model(doc: dict) -> KnowledgeEntry:
    return KnowledgeEntry(
        id=str(doc["_id"]),
        name=doc["name"],
        aliases=doc.get("aliases", []),
        category=doc.get("category", "general"),
        summary=doc.get("summary", ""),
        symptoms=doc.get("symptoms", []),
        causes=doc.get("causes"),
        management=doc.get("management"),
        prevalence_note=doc.get("prevalence_note"),
        resources=doc.get("resources", []),
    )


def _embedding_text(entry: dict) -> str:
    return (
        f"{entry['name']}. {entry['summary']} "
        f"Symptoms: {', '.join(entry.get('symptoms', []))}. "
        f"Causes: {entry.get('causes') or ''} "
        f"Management: {entry.get('management') or ''}"
    )


@router.get("", response_model=list[KnowledgeEntry])
async def list_entries(q: Optional[str] = Query(default=None, description="Search text")):
    filter_ = {"$text": {"$search": q}} if q else {}
    cursor = knowledge_collection.find(filter_, {"embedding": 0}).sort("name", 1)
    docs = await cursor.to_list(length=200)
    return [_to_model(d) for d in docs]


@router.get("/{entry_id}", response_model=KnowledgeEntry)
async def get_entry(entry_id: str):
    try:
        obj_id = ObjectId(entry_id)
    except InvalidId:
        raise HTTPException(404, "Knowledge entry not found")
    doc = await knowledge_collection.find_one({"_id": obj_id}, {"embedding": 0})
    if not doc:
        raise HTTPException(404, "Knowledge entry not found")
    return _to_model(doc)


@router.post("", response_model=KnowledgeEntry, status_code=201)
async def create_entry(
    payload: KnowledgeEntryInput, _admin: dict = Depends(require_roles(UserRole.admin))
):
    doc = payload.model_dump()
    doc["embedding"] = await embed_text(_embedding_text(doc))
    result = await knowledge_collection.insert_one(doc)
    doc["_id"] = result.inserted_id
    return _to_model(doc)


@router.put("/{entry_id}", response_model=KnowledgeEntry)
async def update_entry(
    entry_id: str,
    payload: KnowledgeEntryInput,
    _admin: dict = Depends(require_roles(UserRole.admin)),
):
    try:
        obj_id = ObjectId(entry_id)
    except InvalidId:
        raise HTTPException(404, "Knowledge entry not found")
    doc = payload.model_dump()
    doc["embedding"] = await embed_text(_embedding_text(doc))
    updated = await knowledge_collection.find_one_and_update(
        {"_id": obj_id}, {"$set": doc}, return_document=ReturnDocument.AFTER
    )
    if not updated:
        raise HTTPException(404, "Knowledge entry not found")
    return _to_model(updated)


@router.delete("/{entry_id}", status_code=204)
async def delete_entry(entry_id: str, _admin: dict = Depends(require_roles(UserRole.admin))):
    try:
        obj_id = ObjectId(entry_id)
    except InvalidId:
        raise HTTPException(404, "Knowledge entry not found")
    result = await knowledge_collection.delete_one({"_id": obj_id})
    if result.deleted_count == 0:
        raise HTTPException(404, "Knowledge entry not found")
