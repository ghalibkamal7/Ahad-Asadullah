import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  LayoutGrid, BookOpen, Layers, FileStack, FileText, Video, FolderTree, Users, Receipt, Ticket, Bell, BarChart3
} from 'lucide-react'

import AdminDashboardHome from './admin/AdminDashboardHome'
import ManageCourses from './admin/ManageCourses'
import ManageTestSeries from './admin/ManageTestSeries'
import ManageStudyMaterials from './admin/ManageStudyMaterials'
import ManagePDFs from './admin/ManagePDFs'
import ManageVideoLectures from './admin/ManageVideoLectures'
import ManageCategories from './admin/ManageCategories'
import ManageStudents from './admin/ManageStudents'
import ManageOrders from './admin/ManageOrders'
import ManageCoupons from './admin/ManageCoupons'
import ManageNotifications from './admin/ManageNotifications'
import Analytics from './admin/Analytics'

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, component: AdminDashboardHome },
  { id: 'courses', label: 'Manage Courses', icon: BookOpen, component: ManageCourses },
  { id: 'testSeries', label: 'Manage Test Series', icon: Layers, component: ManageTestSeries },
  { id: 'materials', label: 'Manage Study Materials', icon: FileStack, component: ManageStudyMaterials },
  { id: 'pdfs', label: 'Manage PDFs', icon: FileText, component: ManagePDFs },
  { id: 'videos', label: 'Upload Video Lectures', icon: Video, component: ManageVideoLectures },
  { id: 'categories', label: 'Manage Categories', icon: FolderTree, component: ManageCategories },
  { id: 'students', label: 'Manage Students', icon: Users, component: ManageStudents },
  { id: 'orders', label: 'Manage Orders', icon: Receipt, component: ManageOrders },
  { id: 'coupons', label: 'Coupons', icon: Ticket, component: ManageCoupons },
  { id: 'notifications', label: 'Notifications', icon: Bell, component: ManageNotifications },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, component: Analytics }
]

export default function AdminPanel() {
  const [active, setActive] = useState('dashboard')
  const ActiveComponent = tabs.find((t) => t.id === active)?.component

  return (
    <div className="section py-10">
      <div className="flex items-center gap-2 mb-8">
        <LayoutGrid size={22} className="text-royal-600 dark:text-jade-400" />
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        <aside className="card p-3 h-fit lg:sticky lg:top-24">
          <div className="flex lg:flex-col gap-1 overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  active === t.id
                    ? 'bg-royal-50 dark:bg-white/10 text-royal-600 dark:text-jade-400'
                    : 'text-ink-500 dark:text-ink-400 hover:bg-white/60 dark:hover:bg-white/5'
                }`}
              >
                <t.icon size={16} /> {t.label}
              </button>
            ))}
          </div>
        </aside>

        <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {ActiveComponent && <ActiveComponent />}
        </motion.div>
      </div>
    </div>
  )
}
