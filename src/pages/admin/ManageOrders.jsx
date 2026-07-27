import { useState } from 'react'
import { Receipt, FileText } from 'lucide-react'
import { useCollection } from '../../hooks/useCollection'
import { COLLECTIONS, orderByField } from '../../firebase/firestore'
import EmptyState from '../../components/EmptyState'
import Invoice from '../../components/Invoice'

export default function ManageOrders() {
  const { data: orders, loading } = useCollection(COLLECTIONS.ORDERS, [orderByField('createdAt')])
  const [viewing, setViewing] = useState(null)

  return (
    <div className="card overflow-hidden">
      {loading ? (
        <div className="p-6 space-y-3">{[0, 1, 2].map((i) => <div key={i} className="h-10 rounded-lg bg-ink-100 dark:bg-white/5 animate-pulse" />)}</div>
      ) : orders.length === 0 ? (
        <div className="p-2"><EmptyState icon={Receipt} title="No orders yet" text="Orders appear here the moment a student completes a Razorpay payment." /></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink-400 text-xs uppercase border-b border-ink-100 dark:border-white/10">
                <th className="p-4 font-medium">Student</th>
                <th className="p-4 font-medium">Item</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b last:border-0 border-ink-100 dark:border-white/10">
                  <td className="p-4 font-medium">{o.userName}</td>
                  <td className="p-4 text-ink-400">{o.itemTitle}</td>
                  <td className="p-4 font-mono">₹{o.amountPaid?.toLocaleString()}</td>
                  <td className="p-4">
                    <span className="pill text-jade-600 dark:text-jade-400 border-jade-200 dark:border-jade-800">{o.status}</span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => setViewing(o)} className="btn-secondary !px-3 !py-1.5 text-xs inline-flex">
                      <FileText size={13} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {viewing && <Invoice order={viewing} onClose={() => setViewing(null)} />}
    </div>
  )
}
