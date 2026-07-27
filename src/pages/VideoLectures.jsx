import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { PlayCircle, Search, Video } from 'lucide-react'
import EmptyState from '../components/EmptyState'
import YouTubePlayer from '../components/YouTubePlayer'
import { useCollection } from '../hooks/useCollection'
import { COLLECTIONS, orderByField } from '../firebase/firestore'
import { useAuth } from '../context/AuthContext'
import { getYouTubeThumbnail } from '../firebase/storage'

export default function VideoLectures() {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(null)
  const { profile } = useAuth()
  const { data: videos, loading } = useCollection(COLLECTIONS.VIDEO_LECTURES, [orderByField('createdAt')])

  const filtered = useMemo(
    () => videos.filter((v) => (v.title || '').toLowerCase().includes(query.toLowerCase())),
    [videos, query]
  )

  function isUnlocked(v) {
    return v.free || (v.courseId && profile?.purchasedCourses?.includes(v.courseId)) || profile?.purchasedItems?.includes(v.id)
  }

  return (
    <div className="section py-14">
      <span className="eyebrow">Watch, don't just read</span>
      <h1 className="text-3xl sm:text-4xl font-bold mt-2 mb-3">Video Lectures</h1>
      <p className="text-ink-500 dark:text-ink-400 max-w-xl mb-8">
        Topic-wise lectures hosted on YouTube — free previews for everyone, full lectures unlock with the linked course.
      </p>

      <div className="relative max-w-sm mb-8">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search lectures…" className="input !pl-10" />
      </div>

      {active && (
        <div className="card p-5 mb-8">
          <YouTubePlayer url={active.youtubeUrl} title={active.title} locked={!isUnlocked(active)} />
          <h3 className="font-semibold mt-4">{active.title}</h3>
          {active.category && <p className="text-xs text-ink-400 mt-1">{active.category}</p>}
        </div>
      )}

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => <div key={i} className="card h-48 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Video} title="No video lectures yet" text="Upload one from the Admin Panel with a YouTube link." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((v, i) => {
            const unlocked = isUnlocked(v)
            const thumb = getYouTubeThumbnail(v.youtubeUrl)
            return (
              <motion.button
                key={v.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setActive(v)}
                className="card overflow-hidden text-left group"
              >
                <div className="h-36 relative bg-ink-900 bg-cover bg-center" style={thumb ? { backgroundImage: `url(${thumb})` } : {}}>
                  <div className="absolute inset-0 bg-black/25 grid place-items-center">
                    <PlayCircle size={34} className="text-white/90 group-hover:scale-110 transition-transform" />
                  </div>
                  {!unlocked && <span className="absolute top-2 right-2 pill bg-white/90 text-ink-800 border-0">Locked</span>}
                </div>
                <div className="p-4">
                  <p className="font-medium text-sm line-clamp-2">{v.title}</p>
                  {v.category && <p className="text-xs text-ink-400 mt-1">{v.category}</p>}
                </div>
              </motion.button>
            )
          })}
        </div>
      )}
    </div>
  )
}
