import { PlayCircle } from 'lucide-react'
import { getYouTubeId } from '../firebase/storage'

export default function YouTubePlayer({ url, title = 'Video lecture', locked = false }) {
  const videoId = getYouTubeId(url)

  if (locked) {
    return (
      <div className="aspect-video rounded-xl bg-ink-900 grid place-items-center relative overflow-hidden">
        {videoId && (
          <img
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
        )}
        <div className="relative text-center text-white px-4">
          <PlayCircle size={36} className="mx-auto mb-2 opacity-80" />
          <p className="text-sm font-medium">Purchase this course to watch</p>
        </div>
      </div>
    )
  }

  if (!videoId) {
    return (
      <div className="aspect-video rounded-xl bg-ink-100 dark:bg-white/5 grid place-items-center text-sm text-ink-400">
        Invalid YouTube link
      </div>
    )
  }

  return (
    <div className="aspect-video rounded-xl overflow-hidden bg-black">
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
