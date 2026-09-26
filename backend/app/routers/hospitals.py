from typing import Optional

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, Query
from pymongo import ReturnDocument

from app.core.deps import require_roles
from app.db.mongodb import hospitals_collection
from app.models.schemas import Hospital, HospitalInput, UserRole
from app.services.geo import haversine_km

router = APIRouter(prefix="/hospitals", tags=["hospital-doctor-finder"])


def _to_model(doc: dict, distance_km: Optional[float] = None) -> Hospital:
    return Hospital(
        id=str(doc["_id"]),
        name=doc["name"],
        city=doc["city"],
        state=doc["state"],
        address=doc["address"],
        lat=doc["lat"],
        lng=doc["lng"],
        type=doc["type"],
        specialties=doc.get("specialties", []),
        services=doc.get("services", []),
        emergency_services=doc.get("emergency_services", False),
        rating=doc.get("rating", 0.0),
        phone=doc.get("phone", ""),
        website=doc.get("website", ""),
        distance_km=round(distance_km, 1) if distance_km is not None else None,
    )


@router.get("", response_model=list[Hospital])
async def list_hospitals(
    city: Optional[str] = Query(default=None),
    specialty: Optional[str] = Query(default=None, description="Filter by specialty (partial match)"),
    emergency_only: bool = Query(default=False),
    lat: Optional[float] = Query(default=None, description="User latitude, enables distance + smart ranking"),
    lng: Optional[float] = Query(default=None, description="User longitude, enables distance + smart ranking"),
):
    filter_: dict = {}
    if city:
        filter_["city"] = {"$regex": city, "$options": "i"}
    if specialty:
        filter_["specialties"] = {"$regex": specialty, "$options": "i"}
    if emergency_only:
        filter_["emergency_services"] = True

    docs = await hospitals_collection.find(filter_).to_list(length=200)

    has_location = lat is not None and lng is not None
    results = []
    for doc in docs:
        distance = haversine_km(lat, lng, doc["lat"], doc["lng"]) if has_location else None
        results.append((doc, distance))

    if has_location:
        # Smart ranking: blend rating and proximity so nearby, well-rated hospitals surface first.
        results.sort(key=lambda pair: (pair[1] or 0) * 2 - (pair[0].get("rating", 0) * 5))
    else:
        results.sort(key=lambda pair: -(pair[0].get("rating", 0)))

    return [_to_model(doc, distance) for doc, distance in results]


@router.get("/{hospital_id}", response_model=Hospital)
async def get_hospital(hospital_id: str):
    try:
        obj_id = ObjectId(hospital_id)
    except InvalidId:
        raise HTTPException(404, "Hospital not found")
    doc = await hospitals_collection.find_one({"_id": obj_id})
    if not doc:
        raise HTTPException(404, "Hospital not found")
    return _to_model(doc)


@router.post("", response_model=Hospital, status_code=201)
async def create_hospital(
    payload: HospitalInput, _admin: dict = Depends(require_roles(UserRole.admin))
):
    doc = payload.model_dump()
    result = await hospitals_collection.insert_one(doc)
    doc["_id"] = result.inserted_id
    return _to_model(doc)


@router.put("/{hospital_id}", response_model=Hospital)
async def update_hospital(
    hospital_id: str,
    payload: HospitalInput,
    _admin: dict = Depends(require_roles(UserRole.admin)),
):
    try:
        obj_id = ObjectId(hospital_id)
    except InvalidId:
        raise HTTPException(404, "Hospital not found")
    updated = await hospitals_collection.find_one_and_update(
        {"_id": obj_id}, {"$set": payload.model_dump()}, return_document=ReturnDocument.AFTER
    )
    if not updated:
        raise HTTPException(404, "Hospital not found")
    return _to_model(updated)


@router.delete("/{hospital_id}", status_code=204)
async def delete_hospital(
    hospital_id: str, _admin: dict = Depends(require_roles(UserRole.admin))
):
    try:
        obj_id = ObjectId(hospital_id)
    except InvalidId:
        raise HTTPException(404, "Hospital not found")
    result = await hospitals_collection.delete_one({"_id": obj_id})
    if result.deleted_count == 0:
        raise HTTPException(404, "Hospital not found")
