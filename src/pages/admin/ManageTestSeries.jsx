import { Layers } from 'lucide-react'
import ResourceManager from '../../components/admin/ResourceManager'
import { COLLECTIONS } from '../../firebase/firestore'

const fields = [
  { name: 'title', label: 'Test Series Title', type: 'text', required: true },
  { name: 'category', label: 'Category', type: 'text', placeholder: 'e.g. SSC CGL' },
  { name: 'price', label: 'Price (₹)', type: 'number', required: true },
  { name: 'mrp', label: 'MRP (₹)', type: 'number' },
  { name: 'paperCount', label: 'Number of Papers', type: 'number' },
  { name: 'fileUrl', label: 'Combined PDF / ZIP', type: 'file', accept: '.pdf,.zip' },
  { name: 'description', label: 'Description', type: 'textarea' }
]

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'paperCount', label: 'Papers' },
  { key: 'price', label: 'Price', render: (r) => `₹${r.price ?? 0}` }
]

export default function ManageTestSeries() {
  return <ResourceManager collectionName={COLLECTIONS.TEST_SERIES} resourceLabel="Test Series" fields={fields} columns={columns} emptyIcon={Layers} />
}
