import { Inbox } from 'lucide-react'

export default function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', text = '' }) {
  return (
    <div className="card py-16 px-6 text-center">
      <Icon size={32} className="mx-auto mb-4 text-ink-300 dark:text-ink-600" />
      <p className="font-semibold text-sm">{title}</p>
      {text && <p className="text-sm text-ink-400 mt-1 max-w-sm mx-auto">{text}</p>}
    </div>
  )
}
