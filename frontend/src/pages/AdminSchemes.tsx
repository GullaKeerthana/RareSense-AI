import AdminEntityManager, { type AdminField } from '../components/AdminEntityManager'

const fields: AdminField[] = [
  { name: 'name', label: 'Scheme name', type: 'text' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'eligibility', label: 'Eligibility', type: 'textarea' },
  { name: 'coverage', label: 'Coverage', type: 'textarea' },
  { name: 'how_to_apply', label: 'How to apply', type: 'textarea' },
  { name: 'source_url', label: 'Official source URL', type: 'text' },
]

export default function AdminSchemes() {
  return (
    <AdminEntityManager
      title="Government Schemes"
      description="Add, edit, or remove government scheme entries shown in the Government Scheme Finder."
      apiPath="/schemes"
      fields={fields}
      summaryFields={['coverage']}
    />
  )
}
