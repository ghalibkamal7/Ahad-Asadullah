import { motion } from 'framer-motion'
import { Newspaper, Download } from 'lucide-react'
import EmptyState from '../components/EmptyState'
import { useCollection } from '../hooks/useCollection'
import { COLLECTIONS, orderByField } from '../firebase/firestore'

export default function CurrentAffairs() {
  const { data: items, loading } = useCollection(COLLECTIONS.CURRENT_AFFAIRS, [orderByField('createdAt')])

  return (
    <div className="section py-14">
      <span className="eyebrow">Stay updated</span>
      <h1 className="text-3xl sm:text-4xl font-bold mt-2 mb-3">Current Affairs</h1>
      <p className="text-ink-500 dark:text-ink-400 max-w-xl mb-10">
        Daily and monthly current affairs digests — free for every student, updated regularly.
      </p>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => <div key={i} className="card h-36 animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <EmptyState icon={Newspaper} title="No current affairs posted yet" text="Add a digest from the Admin Panel and it appears here for every student." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="card p-6"
            >
              <span className="w-11 h-11 rounded-xl bg-jade-50 dark:bg-white/10 grid place-items-center text-jade-600 dark:text-jade-400 mb-4">
                <Newspaper size={20} />
              </span>
              <h3 className="font-display font-semibold mb-1">{c.title}</h3>
              <p className="text-xs text-ink-400 mb-5">{c.period || ''}</p>
              {c.fileUrl && (
                <a href={c.fileUrl} target="_blank" rel="noreferrer" className="btn-primary w-full !py-2 text-sm">
                  <Download size={15} /> Download PDF
                </a>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
