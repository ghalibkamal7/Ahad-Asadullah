import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Auth() {
  const [mode, setMode] = useState('login')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const { login, signup, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(form.email, form.password)
        toast.success('Welcome back!')
      } else {
        await signup(form.name, form.email, form.password)
        toast.success('Account created!')
      }
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message.replace('Firebase: ', ''))
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setLoading(true)
    try {
      await loginWithGoogle()
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message.replace('Firebase: ', ''))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] grid place-items-center bg-grid-glow py-14">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-4 card p-8"
      >
        <div className="text-center mb-7">
          <span className="w-12 h-12 rounded-xl bg-cta-gradient inline-grid place-items-center text-white font-display font-bold mb-4">AA</span>
          <h1 className="text-2xl font-bold">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">
            {mode === 'login' ? 'Log in to continue your preparation.' : 'Start your preparation journey today.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {mode === 'signup' && (
              <motion.div
                key="name"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="relative"
              >
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
                <input required name="name" value={form.name} onChange={handleChange} placeholder="Full name" className="input !pl-10" />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
            <input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email address" className="input !pl-10" />
          </div>

          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              required
              type={showPw ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              minLength={6}
              className="input !pl-10 !pr-10"
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button disabled={loading} className="btn-primary w-full">
            {loading ? 'Please wait…' : mode === 'login' ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="h-px bg-ink-200 dark:bg-white/10 flex-1" />
          <span className="text-xs text-ink-400">OR</span>
          <div className="h-px bg-ink-200 dark:bg-white/10 flex-1" />
        </div>

        <button onClick={handleGoogle} disabled={loading} className="btn-secondary w-full">
          Continue with Google
        </button>

        <p className="text-center text-sm text-ink-500 dark:text-ink-400 mt-6">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="font-semibold text-royal-600 dark:text-jade-400">
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </motion.div>
    </div>
  )
}
