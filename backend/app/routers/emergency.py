from fastapi import APIRouter

from app.models.schemas import EmergencyContact

router = APIRouter(prefix="/emergency", tags=["emergency-sos"])

CONTACTS = [
    EmergencyContact(
        name="National Emergency Number",
        number="112",
        description="India's unified emergency number for police, fire, and ambulance response.",
    ),
    EmergencyContact(
        name="Ambulance",
        number="108",
        description="Free emergency ambulance and disaster response service, active in most states.",
    ),
    EmergencyContact(
        name="ORDI Rare Disease Helpline",
        number="+91 88925 55000",
        description="Organisation for Rare Diseases India — guidance for rare disease medical and non-medical emergencies.",
    ),
]


@router.get("/contacts", response_model=list[EmergencyContact])
async def get_contacts():
    return CONTACTS
