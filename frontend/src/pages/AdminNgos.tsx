import AdminEntityManager, { type AdminField } from '../components/AdminEntityManager'

const fields: AdminField[] = [
  { name: 'name', label: 'NGO name', type: 'text' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'focus_area', label: 'Focus area', type: 'text' },
  { name: 'contact', label: 'Contact (phone / email / address)', type: 'textarea' },
  { name: 'source_url', label: 'Website URL', type: 'text' },
]

export default function AdminNgos() {
  return (
    <AdminEntityManager
      title="NGO Directory"
      description="Add, edit, or remove NGOs and support organizations shown in the NGO Directory."
      apiPath="/ngos"
      fields={fields}
      summaryFields={['focus_area']}
    />
  )
}
