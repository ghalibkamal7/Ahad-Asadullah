import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Download, Eye, X, Lock } from 'lucide-react'
import EmptyState from '../components/EmptyState'
import { useCollection } from '../hooks/useCollection'
import { COLLECTIONS, orderByField } from '../firebase/firestore'
import { useAuth } from '../context/AuthContext'

export default function PDFLibrary() {
  const [preview, setPreview] = useState(null)
  const { profile } = useAuth()
  const { data: pdfs, loading } = useCollection(COLLECTIONS.PDFS, [orderByField('createdAt')])

  function isUnlocked(pdf) {
    return pdf.free || profile?.purchasedItems?.includes(pdf.id)
  }

  return (
    <div className="section py-14">
      <span className="eyebrow">Download or view instantly</span>
      <h1 className="text-3xl sm:text-4xl font-bold mt-2 mb-3">PDF Library</h1>
      <p className="text-ink-500 dark:text-ink-400 max-w-xl mb-10">
        Formula sheets, revision notes and practice material — free items are open to everyone, premium ones unlock with a course or standalone purchase.
      </p>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="card h-48 animate-pulse" />)}
        </div>
      ) : pdfs.length === 0 ? (
        <EmptyState icon={FileText} title="No PDFs uploaded yet" text="Upload your first PDF from the Admin Panel under Manage PDFs." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pdfs.map((pdf, i) => {
            const unlocked = isUnlocked(pdf)
            return (
              <motion.div
                key={pdf.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="card p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="w-11 h-11 rounded-xl bg-royal-50 dark:bg-white/10 grid place-items-center text-royal-600 dark:text-jade-400">
                    <FileText size={20} />
                  </span>
                  <span className="pill">{pdf.subject || 'General'}</span>
                </div>
                <h3 className="font-display font-semibold mb-1">{pdf.title}</h3>
                <p className="text-xs text-ink-400 mb-5">
                  {pdf.pages ? `${pdf.pages} pages · ` : ''}{pdf.free ? 'Free' : `₹${pdf.price || 0}`}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => unlocked ? setPreview(pdf) : null}
                    disabled={!unlocked}
                    className="btn-secondary flex-1 !py-2 text-sm disabled:opacity-50"
                  >
                    {unlocked ? <><Eye size={15} /> Preview</> : <><Lock size={15} /> Locked</>}
                  </button>
                  {unlocked && pdf.fileUrl && (
                    <a href={pdf.fileUrl} target="_blank" rel="noreferrer" className="btn-primary flex-1 !py-2 text-sm">
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
              {preview.fileUrl ? (
                <iframe src={preview.fileUrl} title={preview.title} className="w-full h-full" />
              ) : (
                <div className="h-full grid place-items-center text-sm text-ink-400">No file uploaded for this PDF yet.</div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
