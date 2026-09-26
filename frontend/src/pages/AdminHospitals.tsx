import AdminEntityManager, { type AdminField } from '../components/AdminEntityManager'

const fields: AdminField[] = [
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'city', label: 'City', type: 'text' },
  { name: 'state', label: 'State', type: 'text' },
  { name: 'address', label: 'Address', type: 'text' },
  { name: 'lat', label: 'Latitude', type: 'number' },
  { name: 'lng', label: 'Longitude', type: 'number' },
  { name: 'type', label: 'Type', type: 'text', placeholder: 'e.g. Multi-specialty (Private)' },
  { name: 'specialties', label: 'Specialties', type: 'list', placeholder: 'Cardiology, Genetics' },
  { name: 'services', label: 'Services', type: 'list', placeholder: '24x7 Emergency, Bone Marrow Transplant' },
  { name: 'emergency_services', label: 'Emergency services', type: 'boolean' },
  { name: 'rating', label: 'Rating (0-5)', type: 'number' },
  { name: 'phone', label: 'Phone', type: 'text' },
  { name: 'website', label: 'Website', type: 'text' },
]

export default function AdminHospitals() {
  return (
    <AdminEntityManager
      title="Hospitals"
      description="Add, edit, or remove hospitals shown in Hospital Finder, Doctor Finder, and Emergency SOS."
      apiPath="/hospitals"
      fields={fields}
      summaryFields={['city', 'state', 'address']}
    />
  )
}
