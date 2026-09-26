import asyncio
import sys

from app.db.mongodb import users_collection


async def promote(email: str) -> None:
    result = await users_collection.update_one(
        {"email": email.lower()}, {"$set": {"role": "admin"}}
    )
    if result.matched_count == 0:
        print(f"No user found with email {email}. Register an account with this email first.")
    else:
        print(f"Promoted {email} to admin.")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python -m app.seed.promote_admin <email>")
        sys.exit(1)
    asyncio.run(promote(sys.argv[1]))
