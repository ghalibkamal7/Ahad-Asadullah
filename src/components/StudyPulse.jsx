import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Radio } from 'lucide-react'
import { listDocs, COLLECTIONS } from '../firebase/firestore'

function useCounter(target, duration = 1200) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start = null
    let frame
    const step = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      setVal(Math.floor(progress * target))
      if (progress < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])
  return val
}

export default function StudyPulse() {
  const [counts, setCounts] = useState({ courses: 0, materials: 0, videos: 0 })

  useEffect(() => {
    async function load() {
      try {
        const [courses, pdfs, materials, videos] = await Promise.all([
          listDocs(COLLECTIONS.COURSES),
          listDocs(COLLECTIONS.PDFS),
          listDocs(COLLECTIONS.STUDY_MATERIALS),
          listDocs(COLLECTIONS.VIDEO_LECTURES)
        ])
        setCounts({
          courses: courses.length,
          materials: pdfs.length + materials.length,
          videos: videos.length
        })
      } catch {
        // Firestore not configured yet — the widget just shows zeros.
      }
    }
    load()
  }, [])

  const coursesN = useCounter(counts.courses)
  const materialsN = useCounter(counts.materials)
  const videosN = useCounter(counts.videos)

  return (
    <div className="glass-strong rounded-2xl px-5 py-4 flex flex-wrap items-center gap-x-8 gap-y-3">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-jade-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-jade-500" />
        </span>
        <span className="text-xs font-semibold tracking-wide uppercase text-ink-500 dark:text-ink-400 flex items-center gap-1">
          <Radio size={12} /> Library, live
        </span>
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="stat-num text-lg text-royal-600 dark:text-royal-300">{coursesN}</span>
        <span className="text-xs text-ink-500 dark:text-ink-400">courses</span>
      </div>

      <div className="h-4 w-px bg-ink-200 dark:bg-white/10 hidden sm:block" />

      <div className="flex items-baseline gap-1.5">
        <span className="stat-num text-lg text-jade-600 dark:text-jade-400">{materialsN}</span>
        <span className="text-xs text-ink-500 dark:text-ink-400">PDFs & notes</span>
      </div>

      <div className="h-4 w-px bg-ink-200 dark:bg-white/10 hidden sm:block" />

      <div className="flex items-baseline gap-1.5">
        <span className="stat-num text-lg">{videosN}</span>
        <span className="text-xs text-ink-500 dark:text-ink-400">video lectures</span>
      </div>
    </div>
  )
}
