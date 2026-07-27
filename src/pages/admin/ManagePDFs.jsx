import { FileText } from 'lucide-react'
import ResourceManager from '../../components/admin/ResourceManager'
import { COLLECTIONS } from '../../firebase/firestore'

const fields = [
  { name: 'title', label: 'PDF Title', type: 'text', required: true },
  { name: 'subject', label: 'Subject', type: 'text', placeholder: 'e.g. Quant' },
  { name: 'pages', label: 'Pages', type: 'number' },
  { name: 'free', label: 'Free for everyone', type: 'checkbox' },
  { name: 'price', label: 'Price (₹) — if not free', type: 'number' },
  { name: 'fileUrl', label: 'PDF File', type: 'file', accept: '.pdf', required: true }
]

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'subject', label: 'Subject' },
  { key: 'free', label: 'Access', render: (r) => (r.free ? 'Free' : `₹${r.price ?? 0}`) }
]

export default function ManagePDFs() {
  return <ResourceManager collectionName={COLLECTIONS.PDFS} resourceLabel="PDF" fields={fields} columns={columns} emptyIcon={FileText} />
}
