import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal, BookOpen } from 'lucide-react'
import CourseCard from '../components/CourseCard'
import EmptyState from '../components/EmptyState'
import BuyModal from '../components/BuyModal'
import { useCollection } from '../hooks/useCollection'
import { COLLECTIONS, orderByField } from '../firebase/firestore'
import { useAuth } from '../context/AuthContext'

export default function Courses() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('newest')
  const [buyItem, setBuyItem] = useState(null)
  const { profile } = useAuth()

  const { data: allCourses, loading } = useCollection(COLLECTIONS.COURSES, [orderByField('createdAt')])
  const categories = useMemo(() => ['All', ...new Set(allCourses.map((c) => c.category).filter(Boolean))], [allCourses])

  const filtered = useMemo(() => {
    let list = allCourses.filter((c) => (c.title || '').toLowerCase().includes(query.toLowerCase()))
    if (category !== 'All') list = list.filter((c) => c.category === category)
    if (sort === 'price-low') list = [...list].sort((a, b) => (a.price || 0) - (b.price || 0))
    if (sort === 'price-high') list = [...list].sort((a, b) => (b.price || 0) - (a.price || 0))
    if (sort === 'rating') list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0))
    return list
  }, [allCourses, query, category, sort])

  return (
    <div className="section py-14">
      <span className="eyebrow">Structured learning</span>
      <h1 className="text-3xl sm:text-4xl font-bold mt-2 mb-3">All Courses</h1>
      <p className="text-ink-500 dark:text-ink-400 max-w-xl mb-8">
        Courses built by Ahad Asadullah — each one bundles video lectures and downloadable PDF notes.
      </p>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search courses…" className="input !pl-10" />
        </div>
        <div className="flex gap-3">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="input !w-auto">
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="relative">
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="input !w-auto !pl-9">
              <option value="newest">Newest</option>
              <option value="rating">Top Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <SlidersHorizontal size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="card h-64 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={BookOpen} title="No courses match your search" text="Try a different keyword, or clear filters to see everything available." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c, i) => (
            <CourseCard
              key={c.id}
              course={c}
              index={i}
              owned={profile?.purchasedCourses?.includes(c.id)}
              onBuy={setBuyItem}
            />
          ))}
        </div>
      )}

      {buyItem && <BuyModal item={buyItem} itemType="course" onClose={() => setBuyItem(null)} />}
    </div>
  )
}
