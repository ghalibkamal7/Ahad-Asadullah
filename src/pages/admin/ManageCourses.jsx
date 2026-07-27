import { BookOpen } from 'lucide-react'
import ResourceManager from '../../components/admin/ResourceManager'
import { COLLECTIONS } from '../../firebase/firestore'

const fields = [
  { name: 'title', label: 'Course Title', type: 'text', required: true },
  { name: 'category', label: 'Category', type: 'text', required: true, placeholder: 'e.g. Banking & SSC' },
  { name: 'price', label: 'Price (₹)', type: 'number', required: true },
  { name: 'mrp', label: 'MRP (₹)', type: 'number' },
  { name: 'duration', label: 'Duration', type: 'text', placeholder: 'e.g. 120 hrs' },
  { name: 'level', label: 'Level', type: 'text', placeholder: 'e.g. Beginner to Advanced' },
  { name: 'tag', label: 'Badge Tag', type: 'text', placeholder: 'e.g. Bestseller' },
  { name: 'thumbnailUrl', label: 'Thumbnail Image', type: 'file', accept: 'image/*' },
  { name: 'description', label: 'Description', type: 'textarea' }
]

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'category', label: 'Category' },
  { key: 'price', label: 'Price', render: (r) => `₹${r.price ?? 0}` }
]

export default function ManageCourses() {
  return <ResourceManager collectionName={COLLECTIONS.COURSES} resourceLabel="Course" fields={fields} columns={columns} emptyIcon={BookOpen} />
}
