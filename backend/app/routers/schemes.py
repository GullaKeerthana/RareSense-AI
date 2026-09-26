from typing import Optional

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, Query
from pymongo import ReturnDocument

from app.core.deps import require_roles
from app.db.mongodb import government_schemes_collection
from app.models.schemas import GovernmentScheme, GovernmentSchemeInput, UserRole

router = APIRouter(prefix="/schemes", tags=["government-scheme-finder"])


def _to_model(doc: dict) -> GovernmentScheme:
    return GovernmentScheme(
        id=str(doc["_id"]),
        name=doc["name"],
        description=doc.get("description", ""),
        eligibility=doc.get("eligibility", ""),
        coverage=doc.get("coverage", ""),
        how_to_apply=doc.get("how_to_apply", ""),
        source_url=doc.get("source_url", ""),
    )


@router.get("", response_model=list[GovernmentScheme])
async def list_schemes(q: Optional[str] = Query(default=None, description="Search text")):
    filter_ = {"$text": {"$search": q}} if q else {}
    cursor = government_schemes_collection.find(filter_).sort("name", 1)
    docs = await cursor.to_list(length=200)
    return [_to_model(d) for d in docs]


@router.get("/{scheme_id}", response_model=GovernmentScheme)
async def get_scheme(scheme_id: str):
    try:
        obj_id = ObjectId(scheme_id)
    except InvalidId:
        raise HTTPException(404, "Scheme not found")
    doc = await government_schemes_collection.find_one({"_id": obj_id})
    if not doc:
        raise HTTPException(404, "Scheme not found")
    return _to_model(doc)


@router.post("", response_model=GovernmentScheme, status_code=201)
async def create_scheme(
    payload: GovernmentSchemeInput, _admin: dict = Depends(require_roles(UserRole.admin))
):
    doc = payload.model_dump()
    result = await government_schemes_collection.insert_one(doc)
    doc["_id"] = result.inserted_id
    return _to_model(doc)


@router.put("/{scheme_id}", response_model=GovernmentScheme)
async def update_scheme(
    scheme_id: str,
    payload: GovernmentSchemeInput,
    _admin: dict = Depends(require_roles(UserRole.admin)),
):
    try:
        obj_id = ObjectId(scheme_id)
    except InvalidId:
        raise HTTPException(404, "Scheme not found")
    updated = await government_schemes_collection.find_one_and_update(
        {"_id": obj_id}, {"$set": payload.model_dump()}, return_document=ReturnDocument.AFTER
    )
    if not updated:
        raise HTTPException(404, "Scheme not found")
    return _to_model(updated)


@router.delete("/{scheme_id}", status_code=204)
async def delete_scheme(scheme_id: str, _admin: dict = Depends(require_roles(UserRole.admin))):
    try:
        obj_id = ObjectId(scheme_id)
    except InvalidId:
        raise HTTPException(404, "Scheme not found")
    result = await government_schemes_collection.delete_one({"_id": obj_id})
    if result.deleted_count == 0:
        raise HTTPException(404, "Scheme not found")
