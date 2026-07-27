import { motion } from 'framer-motion'
import { FileText, Download, Layers } from 'lucide-react'

export default function TestSeriesCard({ series, index = 0, onBuy, owned = false }) {
  const discount = series.mrp && series.mrp > series.price
    ? Math.round(((series.mrp - series.price) / series.mrp) * 100)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="card p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl bg-royal-50 dark:bg-white/10 grid place-items-center text-royal-600 dark:text-jade-400">
          <FileText size={20} />
        </div>
        <span className="pill flex items-center gap-1"><Layers size={11} /> PDF set</span>
      </div>
      <h3 className="font-display font-semibold text-base mb-2">{series.title}</h3>
      <p className="text-xs text-ink-500 dark:text-ink-400 mb-4">
        {series.paperCount || 0} practice papers · download &amp; view, no online timer
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="font-mono font-bold text-lg">₹{Number(series.price || 0).toLocaleString()}</span>
          {discount > 0 && <span className="font-mono text-xs text-ink-400 line-through">₹{Number(series.mrp).toLocaleString()}</span>}
        </div>
        {owned ? (
          <button className="btn-secondary !px-4 !py-2 text-sm">
            <Download size={14} /> Download
          </button>
        ) : (
          <button onClick={() => onBuy?.(series)} className="btn-secondary !px-4 !py-2 text-sm">
            Enroll
          </button>
        )}
      </div>
    </motion.div>
  )
}
