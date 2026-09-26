from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class UserRole(str, Enum):
    patient = "patient"
    caregiver = "caregiver"
    doctor = "doctor"
    ngo = "ngo"
    admin = "admin"


class UserRegister(BaseModel):
    full_name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)
    role: UserRole = UserRole.patient


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserPublic(BaseModel):
    id: str
    full_name: str
    email: EmailStr
    role: UserRole
    created_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic


class KnowledgeEntry(BaseModel):
    id: str
    name: str
    aliases: list[str] = []
    category: str
    summary: str
    symptoms: list[str] = []
    causes: Optional[str] = None
    management: Optional[str] = None
    prevalence_note: Optional[str] = None
    resources: list[str] = []


class KnowledgeEntryInput(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    aliases: list[str] = []
    category: str = Field(min_length=1, max_length=100)
    summary: str = Field(min_length=1, max_length=2000)
    symptoms: list[str] = []
    causes: Optional[str] = Field(default=None, max_length=1000)
    management: Optional[str] = Field(default=None, max_length=1000)
    prevalence_note: Optional[str] = Field(default=None, max_length=500)
    resources: list[str] = []


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    conversation_id: Optional[str] = None


class SourceRef(BaseModel):
    id: str
    name: str


class ChatResponse(BaseModel):
    conversation_id: str
    reply: str
    sources: list[SourceRef]
    explanation: str


class SymptomCheckRequest(BaseModel):
    symptoms: list[str] = Field(min_length=1)
    notes: Optional[str] = Field(default=None, max_length=1000)


class SymptomCheckResponse(BaseModel):
    possible_categories: list[str]
    suggested_specialist: str
    explanation: str
    sources: list[SourceRef]
    disclaimer: str


class GovernmentScheme(BaseModel):
    id: str
    name: str
    description: str
    eligibility: str
    coverage: str
    how_to_apply: str
    source_url: str


class GovernmentSchemeInput(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    description: str = Field(min_length=1, max_length=2000)
    eligibility: str = Field(min_length=1, max_length=1000)
    coverage: str = Field(min_length=1, max_length=1000)
    how_to_apply: str = Field(min_length=1, max_length=1000)
    source_url: str = Field(default="", max_length=500)


class NGO(BaseModel):
    id: str
    name: str
    description: str
    focus_area: str
    contact: str
    source_url: str


class NGOInput(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    description: str = Field(min_length=1, max_length=2000)
    focus_area: str = Field(min_length=1, max_length=300)
    contact: str = Field(default="", max_length=500)
    source_url: str = Field(default="", max_length=500)


class Hospital(BaseModel):
    id: str
    name: str
    city: str
    state: str
    address: str
    lat: float
    lng: float
    type: str
    specialties: list[str] = []
    services: list[str] = []
    emergency_services: bool = False
    rating: float
    phone: str
    website: str
    distance_km: Optional[float] = None


class HospitalInput(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    city: str = Field(min_length=1, max_length=100)
    state: str = Field(min_length=1, max_length=100)
    address: str = Field(min_length=1, max_length=300)
    lat: float = Field(ge=-90, le=90)
    lng: float = Field(ge=-180, le=180)
    type: str = Field(min_length=1, max_length=100)
    specialties: list[str] = []
    services: list[str] = []
    emergency_services: bool = False
    rating: float = Field(default=4.0, ge=0, le=5)
    phone: str = Field(default="", max_length=50)
    website: str = Field(default="", max_length=300)


class ReportAnalysisResponse(BaseModel):
    summary: str
    key_findings: list[str]
    flagged_items: list[str]
    disclaimer: str


class CarePlanStep(BaseModel):
    title: str
    description: str
    category: str
    link: Optional[str] = None


class CarePlanRequest(BaseModel):
    input: str = Field(min_length=1, max_length=1000)
    notes: Optional[str] = Field(default=None, max_length=1000)


class CarePlanResponse(BaseModel):
    id: str
    summary: str
    steps: list[CarePlanStep]
    disclaimer: str


class EmergencyContact(BaseModel):
    name: str
    number: str
    description: str
