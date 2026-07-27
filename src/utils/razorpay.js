// Loads the Razorpay checkout script once and exposes a helper to open
// the payment sheet. In production, order creation and payment
// verification must happen on a trusted backend (Cloud Function) —
// never trust amounts calculated only on the client.

export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

/**
 * Opens the Razorpay checkout modal.
 * @param {Object} opts
 * @param {number} opts.amount - Amount in rupees (converted to paise internally)
 * @param {string} opts.name - Item name shown in checkout
 * @param {string} opts.description
 * @param {Object} opts.user - { name, email, contact }
 * @param {Function} opts.onSuccess - called with payment response
 * @param {Function} opts.onFailure
 */
export async function openRazorpayCheckout({ amount, name, description, user, onSuccess, onFailure }) {
  const loaded = await loadRazorpayScript()
  if (!loaded) {
    onFailure?.(new Error('Razorpay SDK failed to load. Check your connection.'))
    return
  }

  // NOTE: order_id should come from your backend (POST /create-order)
  // which calls Razorpay's Orders API with your KEY_SECRET server-side.
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: Math.round(amount * 100),
    currency: 'INR',
    name: 'Ahad Asadullah',
    description,
    image: '/favicon.svg',
    prefill: {
      name: user?.name || '',
      email: user?.email || '',
      contact: user?.contact || ''
    },
    theme: { color: '#2454E0' },
    handler: function (response) {
      onSuccess?.(response)
    },
    modal: {
      ondismiss: function () {
        onFailure?.(new Error('Payment cancelled'))
      }
    },
    notes: { item: name }
  }

  const rzp = new window.Razorpay(options)
  rzp.on('payment.failed', function (response) {
    onFailure?.(response.error)
  })
  rzp.open()
}
