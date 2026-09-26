from typing import Optional

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, Query
from pymongo import ReturnDocument

from app.core.deps import require_roles
from app.db.mongodb import ngos_collection
from app.models.schemas import NGO, NGOInput, UserRole

router = APIRouter(prefix="/ngos", tags=["ngo-directory"])


def _to_model(doc: dict) -> NGO:
    return NGO(
        id=str(doc["_id"]),
        name=doc["name"],
        description=doc.get("description", ""),
        focus_area=doc.get("focus_area", ""),
        contact=doc.get("contact", ""),
        source_url=doc.get("source_url", ""),
    )


@router.get("", response_model=list[NGO])
async def list_ngos(q: Optional[str] = Query(default=None, description="Search text")):
    filter_ = {"$text": {"$search": q}} if q else {}
    cursor = ngos_collection.find(filter_).sort("name", 1)
    docs = await cursor.to_list(length=200)
    return [_to_model(d) for d in docs]


@router.get("/{ngo_id}", response_model=NGO)
async def get_ngo(ngo_id: str):
    try:
        obj_id = ObjectId(ngo_id)
    except InvalidId:
        raise HTTPException(404, "NGO not found")
    doc = await ngos_collection.find_one({"_id": obj_id})
    if not doc:
        raise HTTPException(404, "NGO not found")
    return _to_model(doc)


@router.post("", response_model=NGO, status_code=201)
async def create_ngo(payload: NGOInput, _admin: dict = Depends(require_roles(UserRole.admin))):
    doc = payload.model_dump()
    result = await ngos_collection.insert_one(doc)
    doc["_id"] = result.inserted_id
    return _to_model(doc)


@router.put("/{ngo_id}", response_model=NGO)
async def update_ngo(
    ngo_id: str, payload: NGOInput, _admin: dict = Depends(require_roles(UserRole.admin))
):
    try:
        obj_id = ObjectId(ngo_id)
    except InvalidId:
        raise HTTPException(404, "NGO not found")
    updated = await ngos_collection.find_one_and_update(
        {"_id": obj_id}, {"$set": payload.model_dump()}, return_document=ReturnDocument.AFTER
    )
    if not updated:
        raise HTTPException(404, "NGO not found")
    return _to_model(updated)


@router.delete("/{ngo_id}", status_code=204)
async def delete_ngo(ngo_id: str, _admin: dict = Depends(require_roles(UserRole.admin))):
    try:
        obj_id = ObjectId(ngo_id)
    except InvalidId:
        raise HTTPException(404, "NGO not found")
    result = await ngos_collection.delete_one({"_id": obj_id})
    if result.deleted_count == 0:
        raise HTTPException(404, "NGO not found")
