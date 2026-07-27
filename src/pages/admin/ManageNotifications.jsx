import { Bell } from 'lucide-react'
import ResourceManager from '../../components/admin/ResourceManager'
import { COLLECTIONS } from '../../firebase/firestore'

const fields = [
  { name: 'title', label: 'Notification Title', type: 'text', required: true },
  { name: 'message', label: 'Message', type: 'textarea', required: true },
  { name: 'audience', label: 'Audience', type: 'select', options: ['All Students', 'Course Buyers', 'Test Series Buyers'], required: true }
]

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'audience', label: 'Audience' }
]

export default function ManageNotifications() {
  return <ResourceManager collectionName={COLLECTIONS.NOTIFICATIONS} resourceLabel="Notification" fields={fields} columns={columns} emptyIcon={Bell} />
}
