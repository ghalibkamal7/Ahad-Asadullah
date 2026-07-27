import { useEffect, useState } from 'react'
import { BookOpen, Users, Receipt, IndianRupee } from 'lucide-react'
import { listDocs, COLLECTIONS } from '../../firebase/firestore'
import EmptyState from '../../components/EmptyState'

export default function AdminDashboardHome() {
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])

  useEffect(() => {
    async function load() {
      const [courses, testSeries, students, orders] = await Promise.all([
        listDocs(COLLECTIONS.COURSES),
        listDocs(COLLECTIONS.TEST_SERIES),
        listDocs(COLLECTIONS.USERS),
        listDocs(COLLECTIONS.ORDERS)
      ])
      const revenue = orders.reduce((sum, o) => sum + (o.amountPaid || 0), 0)
      setStats({
        courses: courses.length,
        testSeries: testSeries.length,
        students: students.filter((s) => s.role !== 'admin').length,
        revenue
      })
      setRecentOrders(orders.slice(-5).reverse())
    }
    load()
  }, [])

  const cards = stats && [
    { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: IndianRupee },
    { label: 'Students', value: stats.students, icon: Users },
    { label: 'Courses Live', value: stats.courses, icon: BookOpen },
    { label: 'Test Series Live', value: stats.testSeries, icon: Receipt }
  ]

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {(cards || [0, 1, 2, 3]).map((s, i) => (
          <div key={i} className="card p-5">
            {stats ? (
              <>
                <p className="stat-num text-2xl mb-1">{s.value}</p>
                <p className="text-xs text-ink-400">{s.label}</p>
              </>
            ) : (
              <div className="h-10 animate-pulse bg-ink-100 dark:bg-white/5 rounded-lg" />
            )}
          </div>
        ))}
      </div>

      <div className="card p-6">
        <h3 className="font-semibold mb-4 text-sm">Recent Orders</h3>
        {recentOrders.length === 0 ? (
          <EmptyState icon={Receipt} title="No orders yet" text="Recent purchases will show up here." />
        ) : (
          <div className="space-y-3">
            {recentOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between text-sm border-b last:border-0 border-ink-100 dark:border-white/10 pb-3 last:pb-0">
                <div>
                  <p className="font-medium">{o.itemTitle}</p>
                  <p className="text-xs text-ink-400">{o.userName}</p>
                </div>
                <span className="font-mono">₹{o.amountPaid?.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
