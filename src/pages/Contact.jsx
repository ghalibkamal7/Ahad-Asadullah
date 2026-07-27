import { useState } from 'react'
import toast from 'react-hot-toast'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSending(true)
    // In production: write to a "messages" collection in Firestore, or call a Cloud Function.
    await new Promise((r) => setTimeout(r, 900))
    setSending(false)
    toast.success('Message sent — we\'ll get back to you within 24 hours.')
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <div className="section py-14">
      <span className="eyebrow">We'd love to hear from you</span>
      <h1 className="text-3xl sm:text-4xl font-bold mt-2 mb-10">Contact Us</h1>

      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10">
        <div className="space-y-5">
          {[
            { icon: Mail, label: 'Email', value: 'support@ahadasadullah.com' },
            { icon: Phone, label: 'Phone', value: '+91 98765 43210' },
            { icon: MapPin, label: 'Office', value: 'Patna, Bihar, India' }
          ].map((c, i) => (
            <div key={i} className="card p-5 flex items-center gap-4">
              <span className="w-11 h-11 rounded-xl bg-royal-50 dark:bg-white/10 grid place-items-center text-royal-600 dark:text-jade-400 shrink-0">
                <c.icon size={19} />
              </span>
              <div>
                <p className="text-xs text-ink-400">{c.label}</p>
                <p className="text-sm font-medium">{c.value}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="card p-7 space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Name</label>
            <input required name="name" value={form.name} onChange={handleChange} className="input" placeholder="Your full name" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Email</label>
            <input required type="email" name="email" value={form.email} onChange={handleChange} className="input" placeholder="you@email.com" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Message</label>
            <textarea required name="message" value={form.message} onChange={handleChange} rows={5} className="input resize-none" placeholder="How can we help?" />
          </div>
          <button disabled={sending} className="btn-primary w-full">
            {sending ? 'Sending…' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  )
}
