import { motion } from 'framer-motion'
import { X, Printer } from 'lucide-react'

export default function Invoice({ order, onClose }) {
  function formatDate(ts) {
    if (!ts) return '—'
    const d = ts.toDate ? ts.toDate() : new Date(ts)
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  return (
    <div className="fixed inset-0 z-[70] bg-ink-950/60 backdrop-blur-sm flex items-center justify-center p-4 print:bg-white print:p-0" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-strong print:bg-white print:shadow-none rounded-2xl w-full max-w-lg overflow-hidden"
      >
        <div className="flex items-center justify-between p-5 border-b border-ink-100 dark:border-white/10 print:hidden">
          <h4 className="font-semibold text-sm">Invoice</h4>
          <div className="flex items-center gap-2">
            <button onClick={() => window.print()} className="btn-secondary !px-3 !py-1.5 text-xs">
              <Printer size={13} /> Print
            </button>
            <button onClick={onClose} className="w-8 h-8 grid place-items-center rounded-lg hover:bg-white/60 dark:hover:bg-white/10">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="p-8 bg-white dark:bg-ink-900 print:dark:bg-white">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-2 font-display font-bold text-lg">
              <span className="w-8 h-8 rounded-lg bg-cta-gradient flex items-center justify-center text-white text-sm">AA</span>
              Ahad Asadullah
            </div>
            <div className="text-right">
              <p className="text-xs text-ink-400">Invoice No.</p>
              <p className="font-mono font-semibold text-sm">{order.invoiceNumber}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
            <div>
              <p className="text-xs text-ink-400 mb-1">Billed To</p>
              <p className="font-medium">{order.userName}</p>
              <p className="text-ink-500 dark:text-ink-400">{order.userEmail}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-ink-400 mb-1">Date</p>
              <p className="font-medium">{formatDate(order.createdAt)}</p>
            </div>
          </div>

          <div className="rounded-xl border border-ink-100 dark:border-white/10 overflow-hidden mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-ink-50 dark:bg-white/5 text-left text-xs uppercase text-ink-400">
                  <th className="p-3 font-medium">Item</th>
                  <th className="p-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3">{order.itemTitle}</td>
                  <td className="p-3 text-right font-mono">₹{order.originalAmount?.toLocaleString()}</td>
                </tr>
                {order.couponCode && (
                  <tr>
                    <td className="p-3 text-jade-600 dark:text-jade-400">Coupon ({order.couponCode})</td>
                    <td className="p-3 text-right font-mono text-jade-600 dark:text-jade-400">
                      - ₹{(order.originalAmount - order.amountPaid).toLocaleString()}
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="border-t border-ink-100 dark:border-white/10 font-semibold">
                  <td className="p-3">Total Paid</td>
                  <td className="p-3 text-right font-mono">₹{order.amountPaid?.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <p className="text-xs text-ink-400">Payment ID: <span className="font-mono">{order.paymentId || '—'}</span></p>
          <p className="text-xs text-ink-400 mt-4 text-center">Thank you for studying with Ahad Asadullah.</p>
        </div>
      </motion.div>
    </div>
  )
}
