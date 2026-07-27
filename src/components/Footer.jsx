import { Link } from 'react-router-dom'
import { Instagram, Youtube, Twitter, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-ink-200/60 dark:border-white/10 bg-white/40 dark:bg-ink-950/60">
      <div className="section py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 font-display font-bold text-lg mb-3">
            <span className="w-8 h-8 rounded-lg bg-cta-gradient flex items-center justify-center text-white text-sm">AA</span>
            Ahad Asadullah
          </div>
          <p className="text-sm text-ink-500 dark:text-ink-400 leading-relaxed">
            A focused home for competitive exam preparation — courses, video lectures, PDF notes and practice material, all in one library.
          </p>
          <div className="flex gap-3 mt-4">
            {[Instagram, Youtube, Twitter, Mail].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-lg grid place-items-center bg-white/60 dark:bg-white/5 hover:bg-royal-50 dark:hover:bg-white/10 transition-colors" aria-label="social link">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-sm">Explore</h4>
          <ul className="space-y-2 text-sm text-ink-500 dark:text-ink-400">
            <li><Link to="/courses" className="hover:text-royal-600 dark:hover:text-jade-400">Courses</Link></li>
            <li><Link to="/test-series" className="hover:text-royal-600 dark:hover:text-jade-400">Test Series</Link></li>
            <li><Link to="/video-lectures" className="hover:text-royal-600 dark:hover:text-jade-400">Video Lectures</Link></li>
            <li><Link to="/pdf-library" className="hover:text-royal-600 dark:hover:text-jade-400">PDF Library</Link></li>
            <li><Link to="/previous-papers" className="hover:text-royal-600 dark:hover:text-jade-400">Previous Year Papers</Link></li>
            <li><Link to="/current-affairs" className="hover:text-royal-600 dark:hover:text-jade-400">Current Affairs</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-sm">Company</h4>
          <ul className="space-y-2 text-sm text-ink-500 dark:text-ink-400">
            <li><Link to="/about" className="hover:text-royal-600 dark:hover:text-jade-400">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-royal-600 dark:hover:text-jade-400">Contact</Link></li>
            <li><Link to="/auth" className="hover:text-royal-600 dark:hover:text-jade-400">Login / Signup</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-sm">Stay in the loop</h4>
          <p className="text-sm text-ink-500 dark:text-ink-400 mb-3">Get new batch alerts and free PDFs in your inbox.</p>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="you@email.com" className="input !py-2.5 text-sm" />
            <button className="btn-primary !px-4 !py-2.5 text-sm whitespace-nowrap">Subscribe</button>
          </form>
        </div>
      </div>
      <div className="border-t border-ink-200/60 dark:border-white/10 py-5 text-center text-xs text-ink-400">
        © {new Date().getFullYear()} Ahad Asadullah. All rights reserved.
      </div>
    </footer>
  )
}
