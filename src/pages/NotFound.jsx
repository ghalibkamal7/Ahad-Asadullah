import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] grid place-items-center text-center px-6">
      <div>
        <p className="font-mono text-6xl font-bold text-royal-200 dark:text-royal-800 mb-4">404</p>
        <h1 className="text-2xl font-bold mb-2">This page took a wrong turn</h1>
        <p className="text-ink-500 dark:text-ink-400 mb-6">The page you're looking for doesn't exist or has moved.</p>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    </div>
  )
}
