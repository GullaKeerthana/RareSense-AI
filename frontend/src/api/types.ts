export type UserRole = 'patient' | 'caregiver' | 'doctor' | 'ngo' | 'admin'

export interface UserPublic {
  id: string
  full_name: string
  email: string
  role: UserRole
  created_at: string
}

export interface Token {
  access_token: string
  token_type: string
  user: UserPublic
}

export interface SourceRef {
  id: string
  name: string
}

export interface ChatResponse {
  conversation_id: string
  reply: string
  sources: SourceRef[]
  explanation: string
}

export interface SymptomCheckResponse {
  possible_categories: string[]
  suggested_specialist: string
  explanation: string
  sources: SourceRef[]
  disclaimer: string
}

export interface KnowledgeEntry {
  id: string
  name: string
  aliases: string[]
  category: string
  summary: string
  symptoms: string[]
  causes?: string | null
  management?: string | null
  prevalence_note?: string | null
  resources: string[]
}

export interface GovernmentScheme {
  id: string
  name: string
  description: string
  eligibility: string
  coverage: string
  how_to_apply: string
  source_url: string
}

export interface NGO {
  id: string
  name: string
  description: string
  focus_area: string
  contact: string
  source_url: string
}

export interface Hospital {
  id: string
  name: string
  city: string
  state: string
  address: string
  lat: number
  lng: number
  type: string
  specialties: string[]
  services: string[]
  emergency_services: boolean
  rating: number
  phone: string
  website: string
  distance_km?: number | null
}

export interface ReportAnalysis {
  summary: string
  key_findings: string[]
  flagged_items: string[]
  disclaimer: string
}

export interface CarePlanStep {
  title: string
  description: string
  category: string
  link?: string | null
}

export interface CarePlan {
  id: string
  summary: string
  steps: CarePlanStep[]
  disclaimer: string
}

export interface EmergencyContact {
  name: string
  number: string
  description: string
}
