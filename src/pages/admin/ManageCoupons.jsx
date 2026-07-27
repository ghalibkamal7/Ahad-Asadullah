import { Ticket } from 'lucide-react'
import ResourceManager from '../../components/admin/ResourceManager'
import { COLLECTIONS } from '../../firebase/firestore'

const fields = [
  { name: 'code', label: 'Coupon Code', type: 'text', required: true, placeholder: 'e.g. WELCOME20' },
  { name: 'discountType', label: 'Discount Type', type: 'select', options: ['percent', 'flat'], required: true },
  { name: 'discountValue', label: 'Discount Value', type: 'number', required: true, placeholder: '20 for 20% or ₹20' },
  { name: 'expiryDate', label: 'Expiry Date', type: 'date' },
  { name: 'usageLimit', label: 'Usage Limit (optional)', type: 'number' },
  { name: 'active', label: 'Active', type: 'checkbox' }
]

const columns = [
  { key: 'code', label: 'Code', render: (r) => <span className="font-mono font-semibold">{r.code}</span> },
  { key: 'discount', label: 'Discount', render: (r) => (r.discountType === 'percent' ? `${r.discountValue}%` : `₹${r.discountValue}`) },
  { key: 'expiryDate', label: 'Expires' },
  { key: 'active', label: 'Status', render: (r) => (r.active ? <span className="pill text-jade-600 dark:text-jade-400 border-jade-200 dark:border-jade-800">Active</span> : <span className="pill text-red-500 border-red-200 dark:border-red-900">Inactive</span>) }
]

export default function ManageCoupons() {
  return (
    <div>
      <p className="text-xs text-ink-400 mb-4">Choose "percent" for a % discount or "flat" for a fixed ₹ amount off — students apply the code at checkout.</p>
      <ResourceManager collectionName={COLLECTIONS.COUPONS} resourceLabel="Coupon" fields={fields} columns={columns} emptyIcon={Ticket} />
    </div>
  )
}
