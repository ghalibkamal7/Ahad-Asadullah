import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Tag, Check } from 'lucide-react'
import { useCheckout } from '../hooks/useCheckout'

export default function BuyModal({ item, itemType, onClose }) {
  const { buy, applyCoupon, computeDiscount, processing } = useCheckout()
  const [code, setCode] = useState('')
  const [coupon, setCoupon] = useState(null)
  const [couponMsg, setCouponMsg] = useState('')
  const [checking, setChecking] = useState(false)

  const finalAmount = computeDiscount(item.price, coupon)

  async function handleApply() {
    setChecking(true)
    const result = await applyCoupon(code)
    setChecking(false)
    if (result.valid) {
      setCoupon(result.coupon)
      setCouponMsg(`Coupon applied — ${result.coupon.discountType === 'percent' ? result.coupon.discountValue + '% off' : '₹' + result.coupon.discountValue + ' off'}`)
    } else {
      setCoupon(null)
      setCouponMsg(result.message)
    }
  }

  function handleBuy() {
    buy({ item, itemType, coupon })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[60] bg-ink-950/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-strong rounded-2xl w-full max-w-md overflow-hidden"
      >
        <div className="flex items-center justify-between p-5 border-b border-ink-100 dark:border-white/10">
          <h4 className="font-semibold text-sm">Confirm Purchase</h4>
          <button onClick={onClose} className="w-8 h-8 grid place-items-center rounded-lg hover:bg-white/60 dark:hover:bg-white/10">
            <X size={16} />
          </button>
        </div>

        <div className="p-5">
          <p className="font-medium text-sm mb-1">{item.title}</p>
          <p className="text-xs text-ink-400 mb-5">{itemType === 'testSeries' ? 'PDF test series — download & view' : 'Course'}</p>

          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Tag size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Coupon code"
                className="input !pl-9 !py-2.5 text-sm"
              />
            </div>
            <button onClick={handleApply} disabled={checking} className="btn-secondary !px-4 !py-2.5 text-sm whitespace-nowrap">
              {checking ? 'Checking…' : 'Apply'}
            </button>
          </div>
          {couponMsg && (
            <p className={`text-xs mb-4 flex items-center gap-1.5 ${coupon ? 'text-jade-600 dark:text-jade-400' : 'text-red-500'}`}>
              {coupon && <Check size={13} />} {couponMsg}
            </p>
          )}

          <div className="rounded-xl bg-ink-50 dark:bg-white/5 p-4 mb-5">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-ink-500 dark:text-ink-400">Price</span>
              <span className="font-mono">₹{Number(item.price).toLocaleString()}</span>
            </div>
            {coupon && (
              <div className="flex justify-between text-sm mb-1 text-jade-600 dark:text-jade-400">
                <span>Discount</span>
                <span className="font-mono">- ₹{(item.price - finalAmount).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-semibold pt-2 mt-2 border-t border-ink-200 dark:border-white/10">
              <span>Total</span>
              <span className="font-mono">₹{finalAmount.toLocaleString()}</span>
            </div>
          </div>

          <button onClick={handleBuy} disabled={processing} className="btn-primary w-full">
            {processing ? 'Processing…' : `Pay ₹${finalAmount.toLocaleString()} with Razorpay`}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
