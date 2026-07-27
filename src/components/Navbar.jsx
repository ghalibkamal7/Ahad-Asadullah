import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sun, Moon, Bell, LogOut, LayoutDashboard } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/courses', label: 'Courses' },
  { to: '/test-series', label: 'Test Series' },
  { to: '/video-lectures', label: 'Video Lectures' },
  { to: '/pdf-library', label: 'PDF Library' },
  { to: '/previous-papers', label: 'PYQs' },
  { to: '/current-affairs', label: 'Current Affairs' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' }
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { user, profile, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50">
      <div className="glass border-b border-white/30 dark:border-white/5">
        <nav className="section flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
            <span className="w-8 h-8 rounded-lg bg-cta-gradient flex items-center justify-center text-white text-sm">AA</span>
            <span className="hidden sm:inline">Ahad Asadullah</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'text-royal-600 dark:text-jade-400 bg-royal-50 dark:bg-white/5'
                      : 'text-ink-600 dark:text-ink-300 hover:text-royal-600 dark:hover:text-jade-400'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="w-9 h-9 grid place-items-center rounded-lg hover:bg-white/60 dark:hover:bg-white/10 transition-colors"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/dashboard" className="w-9 h-9 grid place-items-center rounded-lg hover:bg-white/60 dark:hover:bg-white/10" aria-label="Notifications">
                  <Bell size={18} />
                </Link>
                <Link to={isAdmin ? '/admin' : '/dashboard'} className="btn-secondary !px-4 !py-2 text-sm">
                  <LayoutDashboard size={16} />
                  {isAdmin ? 'Admin' : profile?.name?.split(' ')[0] || 'Dashboard'}
                </Link>
                <button onClick={handleLogout} className="w-9 h-9 grid place-items-center rounded-lg hover:bg-white/60 dark:hover:bg-white/10" aria-label="Log out">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/auth" className="hidden md:inline-flex btn-primary !px-5 !py-2 text-sm">
                Login / Signup
              </Link>
            )}

            <button className="lg:hidden w-9 h-9 grid place-items-center rounded-lg" onClick={() => setOpen(!open)} aria-label="Open menu">
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden glass border-b border-white/30 dark:border-white/5 overflow-hidden"
          >
            <div className="section py-4 flex flex-col gap-1">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-white/60 dark:hover:bg-white/10"
                >
                  {l.label}
                </NavLink>
              ))}
              <div className="h-px bg-ink-200/60 dark:bg-white/10 my-2" />
              {user ? (
                <>
                  <Link to={isAdmin ? '/admin' : '/dashboard'} onClick={() => setOpen(false)} className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-white/60 dark:hover:bg-white/10">
                    {isAdmin ? 'Admin Panel' : 'My Dashboard'}
                  </Link>
                  <button onClick={handleLogout} className="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-white/60 dark:hover:bg-white/10">
                    Log out
                  </button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setOpen(false)} className="btn-primary text-sm mt-1">
                  Login / Signup
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
