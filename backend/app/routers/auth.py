from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.deps import get_current_user
from app.core.security import create_access_token, hash_password, verify_password
from app.db.mongodb import users_collection
from app.models.schemas import Token, UserLogin, UserPublic, UserRegister, UserRole

router = APIRouter(prefix="/auth", tags=["auth"])


def _to_public(user: dict) -> UserPublic:
    return UserPublic(
        id=str(user["_id"]),
        full_name=user["full_name"],
        email=user["email"],
        role=user["role"],
        created_at=user["created_at"],
    )


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(payload: UserRegister):
    if payload.role == UserRole.admin:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Admin accounts cannot self-register")

    existing = await users_collection.find_one({"email": payload.email.lower()})
    if existing:
        raise HTTPException(status.HTTP_409_CONFLICT, "An account with this email already exists")

    now = datetime.now(timezone.utc)
    doc = {
        "full_name": payload.full_name,
        "email": payload.email.lower(),
        "password_hash": hash_password(payload.password),
        "role": payload.role.value,
        "created_at": now,
    }
    result = await users_collection.insert_one(doc)
    doc["_id"] = result.inserted_id

    token = create_access_token(subject=str(doc["_id"]))
    return Token(access_token=token, user=_to_public(doc))


@router.post("/login", response_model=Token)
async def login(payload: UserLogin):
    user = await users_collection.find_one({"email": payload.email.lower()})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Incorrect email or password")

    token = create_access_token(subject=str(user["_id"]))
    return Token(access_token=token, user=_to_public(user))


@router.get("/me", response_model=UserPublic)
async def me(user: dict = Depends(get_current_user)):
    return _to_public(user)
