import { useState } from 'react'
import { motion } from 'framer-motion'
import { NotebookText, Eye, Download, X, Lock } from 'lucide-react'
import EmptyState from '../components/EmptyState'
import { useCollection } from '../hooks/useCollection'
import { COLLECTIONS, orderByField } from '../firebase/firestore'
import { useAuth } from '../context/AuthContext'

export default function Notes() {
  const [preview, setPreview] = useState(null)
  const { profile } = useAuth()
  const { data: notes, loading } = useCollection(COLLECTIONS.NOTES, [orderByField('createdAt')])

  function isUnlocked(n) {
    return n.free || (n.courseId && profile?.purchasedCourses?.includes(n.courseId)) || profile?.purchasedItems?.includes(n.id)
  }

  return (
    <div className="section py-14">
      <span className="eyebrow">Concise & exam-ready</span>
      <h1 className="text-3xl sm:text-4xl font-bold mt-2 mb-3">Notes</h1>
      <p className="text-ink-500 dark:text-ink-400 max-w-xl mb-10">
        Topic-wise revision notes, ready to view or download — linked to your purchased courses.
      </p>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => <div key={i} className="card h-40 animate-pulse" />)}
        </div>
      ) : notes.length === 0 ? (
        <EmptyState icon={NotebookText} title="No notes uploaded yet" text="Add notes from the Admin Panel under Manage Study Materials." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((n, i) => {
            const unlocked = isUnlocked(n)
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="card p-6"
              >
                <span className="w-11 h-11 rounded-xl bg-royal-50 dark:bg-white/10 grid place-items-center text-royal-600 dark:text-jade-400 mb-4">
                  <NotebookText size={20} />
                </span>
                <h3 className="font-display font-semibold mb-1">{n.title}</h3>
                <p className="text-xs text-ink-400 mb-5">{n.subject || 'General'}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => unlocked && setPreview(n)}
                    disabled={!unlocked}
                    className="btn-secondary flex-1 !py-2 text-sm disabled:opacity-50"
                  >
                    {unlocked ? <><Eye size={15} /> Preview</> : <><Lock size={15} /> Locked</>}
                  </button>
                  {unlocked && n.fileUrl && (
                    <a href={n.fileUrl} target="_blank" rel="noreferrer" className="btn-primary flex-1 !py-2 text-sm">
                      <Download size={15} /> Download
                    </a>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-[60] bg-ink-950/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong rounded-2xl w-full max-w-3xl h-[80vh] overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-ink-100 dark:border-white/10 shrink-0">
              <h4 className="font-semibold text-sm">{preview.title}</h4>
              <button onClick={() => setPreview(null)} className="w-8 h-8 grid place-items-center rounded-lg hover:bg-white/60 dark:hover:bg-white/10">
                <X size={16} />
              </button>
            </div>
            <div className="flex-1">
              {preview.fileUrl ? <iframe src={preview.fileUrl} title={preview.title} className="w-full h-full" /> : <div className="h-full grid place-items-center text-sm text-ink-400">No file uploaded yet.</div>}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
