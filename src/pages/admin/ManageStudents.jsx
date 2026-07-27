import toast from 'react-hot-toast'
import { Users, ShieldCheck } from 'lucide-react'
import { useCollection } from '../../hooks/useCollection'
import { COLLECTIONS, updateDocById, orderByField } from '../../firebase/firestore'
import EmptyState from '../../components/EmptyState'

export default function ManageStudents() {
  const { data: students, loading, refetch } = useCollection(COLLECTIONS.USERS, [orderByField('createdAt')])

  async function toggleAdmin(row) {
    const nextRole = row.role === 'admin' ? 'student' : 'admin'
    if (!confirm(`Make ${row.name} ${nextRole === 'admin' ? 'an admin' : 'a student'}?`)) return
    try {
      await updateDocById(COLLECTIONS.USERS, row.id, { role: nextRole })
      toast.success(`${row.name} is now ${nextRole === 'admin' ? 'an admin' : 'a student'}`)
      refetch()
    } catch {
      toast.error('Could not update role')
    }
  }

  return (
    <div className="card overflow-hidden">
      {loading ? (
        <div className="p-6 space-y-3">{[0, 1, 2].map((i) => <div key={i} className="h-10 rounded-lg bg-ink-100 dark:bg-white/5 animate-pulse" />)}</div>
      ) : students.length === 0 ? (
        <div className="p-2"><EmptyState icon={Users} title="No students yet" text="Students appear here as soon as they sign up." /></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink-400 text-xs uppercase border-b border-ink-100 dark:border-white/10">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Courses Owned</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-b last:border-0 border-ink-100 dark:border-white/10">
                  <td className="p-4 font-medium">{s.name}</td>
                  <td className="p-4 text-ink-400">{s.email}</td>
                  <td className="p-4 font-mono">{s.purchasedCourses?.length || 0}</td>
                  <td className="p-4">
                    <span className={`pill ${s.role === 'admin' ? 'text-royal-600 dark:text-jade-400 border-royal-200 dark:border-royal-800' : ''}`}>{s.role || 'student'}</span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => toggleAdmin(s)} className="btn-secondary !px-3 !py-1.5 text-xs inline-flex">
                      <ShieldCheck size={13} /> {s.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
