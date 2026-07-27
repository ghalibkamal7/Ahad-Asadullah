import { useMemo, useState } from 'react'
import { Download, Search, FileClock } from 'lucide-react'
import EmptyState from '../components/EmptyState'
import { useCollection } from '../hooks/useCollection'
import { COLLECTIONS, orderByField } from '../firebase/firestore'

export default function PreviousPapers() {
  const [query, setQuery] = useState('')
  const { data: papers, loading } = useCollection(COLLECTIONS.PREVIOUS_PAPERS, [orderByField('createdAt')])

  const filtered = useMemo(
    () => papers.filter((p) => (p.exam || '').toLowerCase().includes(query.toLowerCase())),
    [papers, query]
  )

  return (
    <div className="section py-14">
      <span className="eyebrow">Practice with the real thing</span>
      <h1 className="text-3xl sm:text-4xl font-bold mt-2 mb-3">Previous Year Papers</h1>
      <p className="text-ink-500 dark:text-ink-400 max-w-xl mb-8">
        Actual question papers from past exam cycles, organized by exam and year — download and solve on paper.
      </p>

      <div className="relative max-w-sm mb-8">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by exam name…" className="input !pl-10" />
      </div>

      {loading ? (
        <div className="card h-64 animate-pulse" />
      ) : filtered.length === 0 ? (
        <EmptyState icon={FileClock} title="No previous year papers yet" text="Add papers from the Admin Panel to see them here." />
      ) : (
        <div className="card overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-100 dark:border-white/10 text-left text-ink-400 text-xs uppercase tracking-wide">
                <th className="p-4 font-medium">Exam</th>
                <th className="p-4 font-medium">Year</th>
                <th className="p-4 font-medium">Shift</th>
                <th className="p-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b last:border-0 border-ink-100 dark:border-white/10 hover:bg-white/50 dark:hover:bg-white/5">
                  <td className="p-4 font-medium">{p.exam}</td>
                  <td className="p-4 font-mono">{p.year}</td>
                  <td className="p-4">{p.shift}</td>
                  <td className="p-4 text-right">
                    {p.fileUrl ? (
                      <a href={p.fileUrl} target="_blank" rel="noreferrer" className="btn-secondary !px-3 !py-1.5 text-xs inline-flex">
                        <Download size={13} /> Download
                      </a>
                    ) : (
                      <span className="text-xs text-ink-400">Not uploaded</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
