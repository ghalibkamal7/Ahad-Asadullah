import { FolderTree } from 'lucide-react'
import ResourceManager from '../../components/admin/ResourceManager'
import { COLLECTIONS } from '../../firebase/firestore'

const fields = [
  { name: 'name', label: 'Category Name', type: 'text', required: true },
  { name: 'type', label: 'Applies To', type: 'select', options: ['Course', 'Test Series', 'PDF', 'Video Lecture', 'Study Material'], required: true }
]

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'type', label: 'Applies To' }
]

export default function ManageCategories() {
  return <ResourceManager collectionName={COLLECTIONS.CATEGORIES} resourceLabel="Category" fields={fields} columns={columns} emptyIcon={FolderTree} />
}
