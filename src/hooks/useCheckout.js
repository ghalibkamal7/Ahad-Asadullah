import { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { openRazorpayCheckout } from '../utils/razorpay'
import { validateCoupon, createOrder, addPurchaseToUser } from '../firebase/firestore'

/**
 * Handles the full purchase flow for a course, test series, or any
 * paid item: optional coupon discount -> Razorpay checkout -> Firestore
 * order record -> mark item as purchased on the user's profile.
 */
export function useCheckout() {
  const { user, profile, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [processing, setProcessing] = useState(false)
  const [lastInvoice, setLastInvoice] = useState(null)

  async function applyCoupon(code) {
    if (!code) return { valid: false, message: 'Enter a coupon code' }
    return validateCoupon(code)
  }

  function computeDiscount(amount, coupon) {
    if (!coupon) return amount
    if (coupon.discountType === 'percent') {
      return Math.max(0, Math.round(amount - (amount * coupon.discountValue) / 100))
    }
    return Math.max(0, Math.round(amount - coupon.discountValue))
  }

  function buy({ item, itemType, coupon }) {
    if (!user) {
      toast('Log in to purchase')
      navigate('/auth')
      return
    }
    const finalAmount = computeDiscount(item.price, coupon)
    setProcessing(true)

    openRazorpayCheckout({
      amount: finalAmount,
      name: item.title,
      description: itemType === 'testSeries' ? 'Test series (PDF)' : 'Course',
      user: { name: profile?.name, email: profile?.email, contact: profile?.phone },
      onSuccess: async (response) => {
        try {
          const { invoiceNumber } = await createOrder({
            userId: user.uid,
            userName: profile?.name || '',
            userEmail: profile?.email || '',
            itemId: item.id,
            itemType,
            itemTitle: item.title,
            originalAmount: item.price,
            amountPaid: finalAmount,
            couponCode: coupon?.code || null,
            paymentId: response.razorpay_payment_id
          })
          await addPurchaseToUser(user.uid, item.id, itemType)
          await refreshProfile(user.uid)
          setLastInvoice(invoiceNumber)
          toast.success(`Purchased "${item.title}"! Check your dashboard.`)
        } catch (err) {
          toast.error('Payment succeeded but saving the order failed — contact support with your payment ID.')
        } finally {
          setProcessing(false)
        }
      },
      onFailure: (err) => {
        setProcessing(false)
        toast.error(err?.description || err?.message || 'Payment could not be completed')
      }
    })
  }

  return { buy, applyCoupon, computeDiscount, processing, lastInvoice }
}
