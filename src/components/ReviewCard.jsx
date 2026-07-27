import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

export default function ReviewCard({ review, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="card p-6 flex flex-col h-full"
    >
      <Quote size={22} className="text-royal-300 dark:text-royal-500 mb-3" />
      <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed flex-1">{review.text}</p>
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-ink-100 dark:border-white/10">
        <div>
          <p className="font-semibold text-sm">{review.name}</p>
          <p className="text-xs text-ink-400">{review.course}</p>
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={13} className={i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-ink-200 dark:text-ink-700'} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
