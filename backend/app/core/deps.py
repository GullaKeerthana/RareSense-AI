from bson import ObjectId
from bson.errors import InvalidId
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.core.security import decode_access_token
from app.db.mongodb import users_collection
from app.models.schemas import UserRole

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_access_token(token)
        user_id = payload.get("sub")
        if not user_id:
            raise credentials_error
    except Exception:
        raise credentials_error

    try:
        user = await users_collection.find_one({"_id": ObjectId(user_id)})
    except InvalidId:
        raise credentials_error

    if not user:
        raise credentials_error
    return user


def require_roles(*roles: UserRole):
    allowed = {role.value for role in roles}

    async def checker(user: dict = Depends(get_current_user)) -> dict:
        if user["role"] not in allowed:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Not permitted for this role")
        return user

    return checker
