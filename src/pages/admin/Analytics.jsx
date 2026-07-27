import { useEffect, useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar
} from 'recharts'
import { listDocs, COLLECTIONS } from '../../firebase/firestore'

function monthKey(ts) {
  const d = ts?.toDate ? ts.toDate() : ts ? new Date(ts) : null
  if (!d) return null
  return d.toLocaleDateString('en-IN', { month: 'short' })
}

function bucketByMonth(items, valueFn) {
  const map = {}
  items.forEach((item) => {
    const key = monthKey(item.createdAt)
    if (!key) return
    map[key] = (map[key] || 0) + valueFn(item)
  })
  return Object.entries(map).map(([month, value]) => ({ month, value }))
}

export default function Analytics() {
  const [revenueData, setRevenueData] = useState([])
  const [signupData, setSignupData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [orders, users] = await Promise.all([
        listDocs(COLLECTIONS.ORDERS),
        listDocs(COLLECTIONS.USERS)
      ])
      setRevenueData(bucketByMonth(orders, (o) => o.amountPaid || 0))
      setSignupData(bucketByMonth(users, () => 1))
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card h-64 animate-pulse" />
        <div className="card h-64 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="card p-6">
        <h3 className="font-semibold mb-4 text-sm">Revenue by Month</h3>
        {revenueData.length === 0 ? (
          <p className="text-sm text-ink-400 py-10 text-center">No orders yet — this fills in as students purchase.</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CBD6E6" opacity={0.3} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#2454E0" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="card p-6">
        <h3 className="font-semibold mb-4 text-sm">New Signups by Month</h3>
        {signupData.length === 0 ? (
          <p className="text-sm text-ink-400 py-10 text-center">No signups yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={signupData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CBD6E6" opacity={0.3} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#17A876" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      <p className="text-xs text-ink-400 lg:col-span-2">
        These charts aggregate from Firestore on the client for simplicity. For large-scale analytics, move this aggregation to a scheduled Cloud Function writing daily rollups instead.
      </p>
    </div>
  )
}
