import { useState } from 'react'
import { NotebookText, ClipboardList, FileClock, Newspaper } from 'lucide-react'
import ResourceManager from '../../components/admin/ResourceManager'
import { COLLECTIONS } from '../../firebase/firestore'

const notesFields = [
  { name: 'title', label: 'Note Title', type: 'text', required: true },
  { name: 'subject', label: 'Subject', type: 'text' },
  { name: 'courseId', label: 'Linked Course ID (optional)', type: 'text' },
  { name: 'free', label: 'Free for everyone', type: 'checkbox' },
  { name: 'fileUrl', label: 'PDF File', type: 'file', accept: '.pdf', required: true }
]

const practiceFields = [
  { name: 'title', label: 'Practice Set Title', type: 'text', required: true },
  { name: 'subject', label: 'Subject', type: 'text' },
  { name: 'free', label: 'Free for everyone', type: 'checkbox' },
  { name: 'price', label: 'Price (₹) — if not free', type: 'number' },
  { name: 'fileUrl', label: 'PDF File', type: 'file', accept: '.pdf', required: true }
]

const papersFields = [
  { name: 'exam', label: 'Exam Name', type: 'text', required: true },
  { name: 'year', label: 'Year', type: 'number', required: true },
  { name: 'shift', label: 'Shift / Tier', type: 'text' },
  { name: 'fileUrl', label: 'PDF File', type: 'file', accept: '.pdf', required: true }
]

const affairsFields = [
  { name: 'title', label: 'Digest Title', type: 'text', required: true },
  { name: 'period', label: 'Period', type: 'text', placeholder: 'e.g. July 2026' },
  { name: 'fileUrl', label: 'PDF File', type: 'file', accept: '.pdf', required: true }
]

const tabs = [
  { id: 'notes', label: 'Notes', icon: NotebookText, collection: COLLECTIONS.NOTES, fields: notesFields, resourceLabel: 'Note', columns: [{ key: 'title', label: 'Title' }, { key: 'subject', label: 'Subject' }] },
  { id: 'practice', label: 'Practice Sets', icon: ClipboardList, collection: COLLECTIONS.PRACTICE_SETS, fields: practiceFields, resourceLabel: 'Practice Set', columns: [{ key: 'title', label: 'Title' }, { key: 'subject', label: 'Subject' }] },
  { id: 'papers', label: 'Previous Papers', icon: FileClock, collection: COLLECTIONS.PREVIOUS_PAPERS, fields: papersFields, resourceLabel: 'Previous Paper', columns: [{ key: 'exam', label: 'Exam' }, { key: 'year', label: 'Year' }] },
  { id: 'affairs', label: 'Current Affairs', icon: Newspaper, collection: COLLECTIONS.CURRENT_AFFAIRS, fields: affairsFields, resourceLabel: 'Current Affairs Post', columns: [{ key: 'title', label: 'Title' }, { key: 'period', label: 'Period' }] }
]

export default function ManageStudyMaterials() {
  const [active, setActive] = useState('notes')
  const tab = tabs.find((t) => t.id === active)

  return (
    <div>
      <div className="flex gap-2 mb-5 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              active === t.id ? 'bg-royal-50 dark:bg-white/10 text-royal-600 dark:text-jade-400' : 'text-ink-500 dark:text-ink-400 hover:bg-white/60 dark:hover:bg-white/5 card'
            }`}
          >
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>
      <ResourceManager
        key={tab.id}
        collectionName={tab.collection}
        resourceLabel={tab.resourceLabel}
        fields={tab.fields}
        columns={tab.columns}
        emptyIcon={tab.icon}
      />
    </div>
  )
}
