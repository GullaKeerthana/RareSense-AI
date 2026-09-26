import AdminEntityManager, { type AdminField } from '../components/AdminEntityManager'

const fields: AdminField[] = [
  { name: 'name', label: 'Disease name', type: 'text' },
  { name: 'aliases', label: 'Aliases', type: 'list', placeholder: 'CF, Mucoviscidosis' },
  { name: 'category', label: 'Category', type: 'text', placeholder: 'Genetic / Respiratory' },
  { name: 'summary', label: 'Summary', type: 'textarea' },
  { name: 'symptoms', label: 'Symptoms', type: 'list', placeholder: 'Persistent cough, Poor growth' },
  { name: 'causes', label: 'Causes', type: 'textarea' },
  { name: 'management', label: 'Management', type: 'textarea' },
  { name: 'prevalence_note', label: 'Prevalence note', type: 'textarea' },
  { name: 'resources', label: 'Resources', type: 'list', placeholder: 'NORD (rarediseases.org)' },
]

export default function AdminKnowledge() {
  return (
    <AdminEntityManager
      title="Knowledge Hub"
      description="Add, edit, or remove disease entries. Saving recomputes the AI search embedding, so new entries are immediately findable by the AI Assistant and Symptom Checker."
      apiPath="/knowledge"
      fields={fields}
      summaryFields={['category']}
    />
  )
}
