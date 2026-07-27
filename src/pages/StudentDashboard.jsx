import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  LayoutGrid, BookOpen, Layers, FileText, Video, NotebookText, FileClock,
  ClipboardList, Newspaper, Bell, User, Receipt, Download, Eye, Lock, X
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCollection } from '../hooks/useCollection'
import { COLLECTIONS, orderByField, updateDocById } from '../firebase/firestore'
import EmptyState from '../components/EmptyState'
import Invoice from '../components/Invoice'
import YouTubePlayer from '../components/YouTubePlayer'
import { getYouTubeThumbnail } from '../firebase/storage'

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'courses', label: 'My Courses', icon: BookOpen },
  { id: 'testSeries', label: 'My Test Series', icon: Layers },
  { id: 'pdfs', label: 'PDF Library', icon: FileText },
  { id: 'videos', label: 'Video Lectures', icon: Video },
  { id: 'notes', label: 'Notes', icon: NotebookText },
  { id: 'papers', label: 'Previous Papers', icon: FileClock },
  { id: 'practice', label: 'Practice Sets', icon: ClipboardList },
  { id: 'affairs', label: 'Current Affairs', icon: Newspaper },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'purchases', label: 'Purchase History', icon: Receipt }
]

export default function StudentDashboard() {
  const [active, setActive] = useState('overview')
  const { profile } = useAuth()

  return (
    <div className="section py-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-cta-gradient grid place-items-center text-white font-display font-bold text-lg">
          {profile?.name?.[0]?.toUpperCase() || <User size={20} />}
        </div>
        <div>
          <h1 className="text-xl font-bold">Welcome back, {profile?.name?.split(' ')[0] || 'Student'}</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">Everything you've purchased, in one place.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-8">
        <aside className="card p-3 h-fit lg:sticky lg:top-24">
          <div className="flex lg:flex-col gap-1 overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  active === t.id
                    ? 'bg-royal-50 dark:bg-white/10 text-royal-600 dark:text-jade-400'
                    : 'text-ink-500 dark:text-ink-400 hover:bg-white/60 dark:hover:bg-white/5'
                }`}
              >
                <t.icon size={16} /> {t.label}
              </button>
            ))}
          </div>
        </aside>

        <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {active === 'overview' && <Overview />}
          {active === 'courses' && <MyCourses />}
          {active === 'testSeries' && <MyTestSeries />}
          {active === 'pdfs' && <MyPDFs />}
          {active === 'videos' && <MyVideos />}
          {active === 'notes' && <MyNotes />}
          {active === 'papers' && <MyPapers />}
          {active === 'practice' && <MyPractice />}
          {active === 'affairs' && <MyCurrentAffairs />}
          {active === 'notifications' && <MyNotifications />}
          {active === 'profile' && <Profile />}
          {active === 'purchases' && <PurchaseHistory />}
        </motion.div>
      </div>
    </div>
  )
}

function Overview() {
  const { profile } = useAuth()
  const { data: orders } = useCollection(COLLECTIONS.ORDERS, [])
  const myOrders = orders.filter((o) => o.userEmail === profile?.email)
  const totalSpent = myOrders.reduce((sum, o) => sum + (o.amountPaid || 0), 0)

  const stats = [
    { label: 'Courses owned', value: profile?.purchasedCourses?.length || 0 },
    { label: 'Test series owned', value: profile?.purchasedTestSeries?.length || 0 },
    { label: 'Orders placed', value: myOrders.length },
    { label: 'Total spent', value: `₹${totalSpent.toLocaleString()}` }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <div key={i} className="card p-5">
          <p className="stat-num text-2xl mb-1">{s.value}</p>
          <p className="text-xs text-ink-400">{s.label}</p>
        </div>
      ))}
    </div>
  )
}

function MyCourses() {
  const { profile } = useAuth()
  const { data: courses, loading } = useCollection(COLLECTIONS.COURSES, [orderByField('createdAt')])
  const owned = courses.filter((c) => profile?.purchasedCourses?.includes(c.id))

  if (loading) return <div className="card h-48 animate-pulse" />
  if (owned.length === 0) return <EmptyState icon={BookOpen} title="No courses purchased yet" text="Browse the Courses page to enroll in your first course." />

  return (
    <div className="grid sm:grid-cols-2 gap-5">
      {owned.map((c) => (
        <div key={c.id} className="card p-5 flex gap-4">
          <div className="w-16 h-16 rounded-xl bg-cta-gradient shrink-0 bg-cover bg-center" style={c.thumbnailUrl ? { backgroundImage: `url(${c.thumbnailUrl})` } : {}} />
          <div className="flex-1">
            <h4 className="font-semibold text-sm mb-1">{c.title}</h4>
            <p className="text-xs text-ink-400">{c.duration || c.category}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function MyTestSeries() {
  const { profile } = useAuth()
  const { data: series, loading } = useCollection(COLLECTIONS.TEST_SERIES, [orderByField('createdAt')])
  const owned = series.filter((s) => profile?.purchasedTestSeries?.includes(s.id))

  if (loading) return <div className="card h-48 animate-pulse" />
  if (owned.length === 0) return <EmptyState icon={Layers} title="No test series purchased yet" text="Test series here are PDF paper sets — enroll from the Test Series page." />

  return (
    <div className="space-y-4">
      {owned.map((s) => (
        <div key={s.id} className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="font-semibold text-sm">{s.title}</h4>
            <p className="text-xs text-ink-400">{s.paperCount || 0} papers</p>
          </div>
          {s.fileUrl && (
            <a href={s.fileUrl} target="_blank" rel="noreferrer" className="btn-primary !px-5 !py-2 text-sm">
              <Download size={14} /> Download
            </a>
          )}
        </div>
      ))}
    </div>
  )
}

function LockedGrid({ items, loading, icon: Icon, emptyTitle, emptyText, isUnlocked, subject }) {
  const [preview, setPreview] = useState(null)
  if (loading) return <div className="card h-48 animate-pulse" />
  if (items.length === 0) return <EmptyState icon={Icon} title={emptyTitle} text={emptyText} />

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const unlocked = isUnlocked(item)
          return (
            <div key={item.id} className="card p-6">
              <span className="w-11 h-11 rounded-xl bg-royal-50 dark:bg-white/10 grid place-items-center text-royal-600 dark:text-jade-400 mb-4">
                <Icon size={20} />
              </span>
              <h3 className="font-display font-semibold mb-1">{item.title}</h3>
              <p className="text-xs text-ink-400 mb-5">{subject?.(item) || ''}</p>
              <div className="flex gap-2">
                <button onClick={() => unlocked && setPreview(item)} disabled={!unlocked} className="btn-secondary flex-1 !py-2 text-sm disabled:opacity-50">
                  {unlocked ? <><Eye size={15} /> Preview</> : <><Lock size={15} /> Locked</>}
                </button>
                {unlocked && item.fileUrl && (
                  <a href={item.fileUrl} target="_blank" rel="noreferrer" className="btn-primary flex-1 !py-2 text-sm">
                    <Download size={15} /> Download
                  </a>
                )}
              </div>
            </div>
          )
        })}
      </div>
      {preview && (
        <div className="fixed inset-0 z-[60] bg-ink-950/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={(e) => e.stopPropagation()} className="glass-strong rounded-2xl w-full max-w-3xl h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-ink-100 dark:border-white/10 shrink-0">
              <h4 className="font-semibold text-sm">{preview.title}</h4>
              <button onClick={() => setPreview(null)} className="w-8 h-8 grid place-items-center rounded-lg hover:bg-white/60 dark:hover:bg-white/10"><X size={16} /></button>
            </div>
            <div className="flex-1">
              {preview.fileUrl ? <iframe src={preview.fileUrl} title={preview.title} className="w-full h-full" /> : <div className="h-full grid place-items-center text-sm text-ink-400">No file uploaded yet.</div>}
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}

function MyPDFs() {
  const { profile } = useAuth()
  const { data, loading } = useCollection(COLLECTIONS.PDFS, [orderByField('createdAt')])
  return (
    <LockedGrid
      items={data} loading={loading} icon={FileText}
      emptyTitle="No PDFs available yet" emptyText="Free PDFs and your purchases will appear here."
      isUnlocked={(p) => p.free || profile?.purchasedItems?.includes(p.id)}
      subject={(p) => p.subject}
    />
  )
}

function MyNotes() {
  const { profile } = useAuth()
  const { data, loading } = useCollection(COLLECTIONS.NOTES, [orderByField('createdAt')])
  return (
    <LockedGrid
      items={data} loading={loading} icon={NotebookText}
      emptyTitle="No notes available yet" emptyText="Notes linked to your courses will appear here."
      isUnlocked={(n) => n.free || (n.courseId && profile?.purchasedCourses?.includes(n.courseId)) || profile?.purchasedItems?.includes(n.id)}
      subject={(n) => n.subject}
    />
  )
}

function MyPractice() {
  const { profile } = useAuth()
  const { data, loading } = useCollection(COLLECTIONS.PRACTICE_SETS, [orderByField('createdAt')])
  return (
    <LockedGrid
      items={data} loading={loading} icon={ClipboardList}
      emptyTitle="No practice sets available yet" emptyText="Free sets and your purchases will appear here."
      isUnlocked={(s) => s.free || profile?.purchasedItems?.includes(s.id)}
      subject={(s) => s.subject}
    />
  )
}

function MyPapers() {
  const { data, loading } = useCollection(COLLECTIONS.PREVIOUS_PAPERS, [orderByField('createdAt')])
  if (loading) return <div className="card h-48 animate-pulse" />
  if (data.length === 0) return <EmptyState icon={FileClock} title="No previous year papers yet" />
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((p) => (
        <div key={p.id} className="card p-6">
          <span className="w-11 h-11 rounded-xl bg-royal-50 dark:bg-white/10 grid place-items-center text-royal-600 dark:text-jade-400 mb-4"><FileClock size={20} /></span>
          <h3 className="font-display font-semibold mb-1">{p.exam} {p.year}</h3>
          <p className="text-xs text-ink-400 mb-5">{p.shift}</p>
          {p.fileUrl && <a href={p.fileUrl} target="_blank" rel="noreferrer" className="btn-primary w-full !py-2 text-sm"><Download size={15} /> Download</a>}
        </div>
      ))}
    </div>
  )
}

function MyCurrentAffairs() {
  const { data, loading } = useCollection(COLLECTIONS.CURRENT_AFFAIRS, [orderByField('createdAt')])
  if (loading) return <div className="card h-48 animate-pulse" />
  if (data.length === 0) return <EmptyState icon={Newspaper} title="No current affairs posted yet" />
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((c) => (
        <div key={c.id} className="card p-6">
          <span className="w-11 h-11 rounded-xl bg-jade-50 dark:bg-white/10 grid place-items-center text-jade-600 dark:text-jade-400 mb-4"><Newspaper size={20} /></span>
          <h3 className="font-display font-semibold mb-1">{c.title}</h3>
          <p className="text-xs text-ink-400 mb-5">{c.period}</p>
          {c.fileUrl && <a href={c.fileUrl} target="_blank" rel="noreferrer" className="btn-primary w-full !py-2 text-sm"><Download size={15} /> Download</a>}
        </div>
      ))}
    </div>
  )
}

function MyVideos() {
  const { profile } = useAuth()
  const { data, loading } = useCollection(COLLECTIONS.VIDEO_LECTURES, [orderByField('createdAt')])
  const [active, setActive] = useState(null)

  function isUnlocked(v) {
    return v.free || (v.courseId && profile?.purchasedCourses?.includes(v.courseId)) || profile?.purchasedItems?.includes(v.id)
  }

  if (loading) return <div className="card h-48 animate-pulse" />
  if (data.length === 0) return <EmptyState icon={Video} title="No video lectures yet" />

  return (
    <div>
      {active && (
        <div className="card p-5 mb-6">
          <YouTubePlayer url={active.youtubeUrl} title={active.title} locked={!isUnlocked(active)} />
          <h3 className="font-semibold mt-4">{active.title}</h3>
        </div>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((v) => {
          const unlocked = isUnlocked(v)
          const thumb = getYouTubeThumbnail(v.youtubeUrl)
          return (
            <button key={v.id} onClick={() => setActive(v)} className="card overflow-hidden text-left">
              <div className="h-32 bg-ink-900 bg-cover bg-center relative" style={thumb ? { backgroundImage: `url(${thumb})` } : {}}>
                {!unlocked && <span className="absolute top-2 right-2 pill bg-white/90 text-ink-800 border-0">Locked</span>}
              </div>
              <div className="p-4">
                <p className="font-medium text-sm line-clamp-2">{v.title}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function MyNotifications() {
  const { data, loading } = useCollection(COLLECTIONS.NOTIFICATIONS, [orderByField('createdAt')])
  if (loading) return <div className="card h-48 animate-pulse" />
  if (data.length === 0) return <EmptyState icon={Bell} title="No notifications yet" text="Announcements from the team will appear here." />
  return (
    <div className="card divide-y divide-ink-100 dark:divide-white/10">
      {data.map((n) => (
        <div key={n.id} className="p-4 flex items-start gap-3">
          <span className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-jade-500" />
          <div>
            <p className="text-sm font-medium">{n.title}</p>
            <p className="text-sm text-ink-500 dark:text-ink-400 mt-0.5">{n.message}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function Profile() {
  const { user, profile, refreshProfile } = useAuth()
  const [name, setName] = useState(profile?.name || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [saving, setSaving] = useState(false)

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await updateDocById(COLLECTIONS.USERS, user.uid, { name, phone })
      await refreshProfile(user.uid)
      toast.success('Profile updated')
    } catch {
      toast.error('Could not update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="card p-6 max-w-lg space-y-4">
      <div>
        <label className="text-sm font-medium mb-1.5 block">Full Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="input" />
      </div>
      <div>
        <label className="text-sm font-medium mb-1.5 block">Email</label>
        <input value={profile?.email || ''} disabled className="input opacity-60" />
      </div>
      <div>
        <label className="text-sm font-medium mb-1.5 block">Phone</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} className="input" placeholder="+91 …" />
      </div>
      <button disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Save Changes'}</button>
    </form>
  )
}

function PurchaseHistory() {
  const { profile } = useAuth()
  const { data: orders, loading } = useCollection(COLLECTIONS.ORDERS, [orderByField('createdAt')])
  const [viewing, setViewing] = useState(null)
  const mine = orders.filter((o) => o.userEmail === profile?.email)

  if (loading) return <div className="card h-48 animate-pulse" />
  if (mine.length === 0) return <EmptyState icon={Receipt} title="No purchases yet" text="Your orders and invoices will appear here after checkout." />

  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-ink-100 dark:border-white/10 text-left text-ink-400 text-xs uppercase">
            <th className="p-4 font-medium">Item</th>
            <th className="p-4 font-medium">Amount</th>
            <th className="p-4 font-medium">Status</th>
            <th className="p-4 font-medium text-right">Invoice</th>
          </tr>
        </thead>
        <tbody>
          {mine.map((h) => (
            <tr key={h.id} className="border-b last:border-0 border-ink-100 dark:border-white/10">
              <td className="p-4 font-medium">{h.itemTitle}</td>
              <td className="p-4 font-mono">₹{h.amountPaid?.toLocaleString()}</td>
              <td className="p-4"><span className="pill text-jade-600 dark:text-jade-400 border-jade-200 dark:border-jade-800">{h.status}</span></td>
              <td className="p-4 text-right">
                <button onClick={() => setViewing(h)} className="btn-secondary !px-3 !py-1.5 text-xs">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {viewing && <Invoice order={viewing} onClose={() => setViewing(null)} />}
    </div>
  )
}
