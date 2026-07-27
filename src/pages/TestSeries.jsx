import { useState } from 'react'
import { Layers } from 'lucide-react'
import TestSeriesCard from '../components/TestSeriesCard'
import EmptyState from '../components/EmptyState'
import BuyModal from '../components/BuyModal'
import { useCollection } from '../hooks/useCollection'
import { COLLECTIONS, orderByField } from '../firebase/firestore'
import { useAuth } from '../context/AuthContext'

export default function TestSeries() {
  const [buyItem, setBuyItem] = useState(null)
  const { profile } = useAuth()
  const { data: series, loading } = useCollection(COLLECTIONS.TEST_SERIES, [orderByField('createdAt')])

  return (
    <div className="section py-14">
      <span className="eyebrow">PDF-based practice</span>
      <h1 className="text-3xl sm:text-4xl font-bold mt-2 mb-3">Test Series</h1>
      <p className="text-ink-500 dark:text-ink-400 max-w-xl mb-10">
        Practice paper sets you download and solve on your own time — no online timer, no auto-submit. Just the papers, ready to print or view.
      </p>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => <div key={i} className="card h-48 animate-pulse" />)}
        </div>
      ) : series.length === 0 ? (
        <EmptyState icon={Layers} title="No test series published yet" text="Add one from the Admin Panel under Manage Test Series." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {series.map((t, i) => (
            <TestSeriesCard
              key={t.id}
              series={t}
              index={i}
              owned={profile?.purchasedTestSeries?.includes(t.id)}
              onBuy={setBuyItem}
            />
          ))}
        </div>
      )}

      {buyItem && <BuyModal item={buyItem} itemType="testSeries" onClose={() => setBuyItem(null)} />}
    </div>
  )
}
