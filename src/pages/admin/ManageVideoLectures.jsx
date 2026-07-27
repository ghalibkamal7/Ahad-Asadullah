import { Video } from 'lucide-react'
import ResourceManager from '../../components/admin/ResourceManager'
import { COLLECTIONS } from '../../firebase/firestore'

const fields = [
  { name: 'title', label: 'Lecture Title', type: 'text', required: true },
  { name: 'category', label: 'Category / Topic', type: 'text', placeholder: 'e.g. Reasoning' },
  { name: 'youtubeUrl', label: 'YouTube Link', type: 'url', required: true, placeholder: 'https://youtube.com/watch?v=…' },
  { name: 'courseId', label: 'Linked Course ID (optional)', type: 'text', placeholder: 'Course document ID to gate this lecture behind' },
  { name: 'free', label: 'Free preview (no purchase needed)', type: 'checkbox' },
  { name: 'description', label: 'Description', type: 'textarea' }
]

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'category', label: 'Category' },
  { key: 'free', label: 'Access', render: (r) => (r.free ? 'Free preview' : 'Locked') }
]

export default function ManageVideoLectures() {
  return (
    <div>
      <p className="text-xs text-ink-400 mb-4">
        Paste any standard YouTube link (watch, youtu.be, or shorts) — it's embedded automatically on the Video Lectures page.
        Leave "Linked Course ID" empty for a free preview, or set it to gate the lecture behind a specific course purchase.
      </p>
      <ResourceManager collectionName={COLLECTIONS.VIDEO_LECTURES} resourceLabel="Video Lecture" fields={fields} columns={columns} emptyIcon={Video} />
    </div>
  )
}
