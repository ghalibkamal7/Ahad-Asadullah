import { motion } from 'framer-motion'
import { Star, Users, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function CourseCard({ course, index = 0, owned = false, onBuy }) {
  const discount = course.mrp && course.mrp > course.price
    ? Math.round(((course.mrp - course.price) / course.mrp) * 100)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="card overflow-hidden group"
    >
      <div
        className="h-32 relative flex items-end p-4 bg-cover bg-center"
        style={
          course.thumbnailUrl
            ? { backgroundImage: `url(${course.thumbnailUrl})` }
            : { backgroundImage: 'linear-gradient(115deg, #2454E0, #17A876)' }
        }
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {course.tag && (
          <span className="absolute top-3 left-3 pill bg-white/90 text-ink-800 border-0 font-semibold z-10">{course.tag}</span>
        )}
        <span className="relative text-white/90 text-xs font-mono">{course.category}</span>
      </div>
      <div className="p-5">
        <h3 className="font-display font-semibold text-base leading-snug mb-1.5 group-hover:text-royal-600 dark:group-hover:text-jade-400 transition-colors">
          {course.title}
        </h3>
        <div className="flex items-center gap-3 text-xs text-ink-500 dark:text-ink-400 mb-3">
          {course.rating && <span className="flex items-center gap-1"><Star size={13} className="fill-amber-400 text-amber-400" /> {course.rating}</span>}
          {course.students != null && <span className="flex items-center gap-1"><Users size={13} /> {course.students.toLocaleString()}</span>}
          {course.duration && <span className="flex items-center gap-1"><Clock size={13} /> {course.duration}</span>}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-mono font-bold text-lg">₹{Number(course.price || 0).toLocaleString()}</span>
            {discount > 0 && (
              <>
                <span className="font-mono text-xs text-ink-400 line-through">₹{Number(course.mrp).toLocaleString()}</span>
                <span className="text-xs font-semibold text-jade-600 dark:text-jade-400">{discount}% off</span>
              </>
            )}
          </div>
        </div>
        {owned ? (
          <Link to="/dashboard" className="btn-primary w-full mt-4 !py-2.5 text-sm">
            Continue Learning
          </Link>
        ) : (
          <button onClick={() => onBuy?.(course)} className="btn-primary w-full mt-4 !py-2.5 text-sm">
            Enroll Now
          </button>
        )}
      </div>
    </motion.div>
  )
}
