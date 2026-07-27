import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, FileText, Video, ShieldCheck } from 'lucide-react'
import StudyPulse from '../components/StudyPulse'
import CourseCard from '../components/CourseCard'
import ReviewCard from '../components/ReviewCard'
import FAQ from '../components/FAQ'
import EmptyState from '../components/EmptyState'
import { useCollection } from '../hooks/useCollection'
import { COLLECTIONS, limitTo, orderByField } from '../firebase/firestore'

const reviews = [
  { id: 'rv1', name: 'Sneha Patil', course: 'Quantitative Aptitude Study Pack', rating: 5, text: 'The PDF notes are structured so well that revision before the exam finally felt manageable instead of overwhelming.' },
  { id: 'rv2', name: 'Amit Kumar', course: 'SSC CGL Foundation Bundle', rating: 5, text: 'Previous year papers and practice sets in one place saved me hours of searching across random Telegram groups.' },
  { id: 'rv3', name: 'Fatima Sheikh', course: 'Reasoning Video Lectures', rating: 4, text: 'Video lectures are short and to the point. I could watch a full topic between college classes.' },
  { id: 'rv4', name: 'Vikram Singh', course: 'Current Affairs Digest', rating: 5, text: 'The monthly current affairs PDF alone is worth the subscription for someone with limited study time.' }
]

const faqs = [
  { q: 'What exactly do I get after purchasing a course?', a: 'Every course unlocks its video lectures, downloadable PDF notes and any linked practice material in your Student Dashboard immediately after payment is confirmed.' },
  { q: 'Are test series online exams?', a: 'No — every test series here is a downloadable and viewable PDF set. There is no timer, auto-submit, or online exam interface; you practice on paper at your own pace.' },
  { q: 'Can I get a refund if I am not satisfied?', a: 'We offer a 7-day refund window on course purchases if less than 20% of the material has been downloaded or viewed. Reach out from the Contact page to start a request.' },
  { q: 'How often is Current Affairs updated?', a: 'New current affairs PDFs are added regularly by our team and appear instantly in the Current Affairs section for enrolled students.' },
  { q: 'Is there a mobile app?', a: 'The platform is fully responsive and works like an app from your mobile browser — a dedicated app is on our roadmap.' }
]

export default function Home() {
  const { data: courses, loading } = useCollection(COLLECTIONS.COURSES, [orderByField('createdAt'), limitTo(3)])

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-grid-glow">
        <div className="section pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
            <div>
              <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="eyebrow">
                Study material, done properly
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-4 text-4xl sm:text-5xl lg:text-[3.4rem] font-bold leading-[1.08] tracking-tight"
              >
                Everything you need to<br />
                <span className="bg-gradient-to-r from-royal-600 to-jade-500 bg-clip-text text-transparent">study, in one library.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-5 text-ink-500 dark:text-ink-400 text-lg max-w-xl leading-relaxed"
              >
                Courses, video lectures, PDF notes, previous year papers and practice sets — curated by Ahad Asadullah and ready to download the moment you enroll.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 flex flex-wrap gap-4"
              >
                <Link to="/courses" className="btn-primary">
                  Explore Courses <ArrowRight size={16} />
                </Link>
                <Link to="/pdf-library" className="btn-secondary">
                  Browse Free PDFs
                </Link>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-10">
                <StudyPulse />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="relative hidden lg:block"
            >
              <div className="card p-6 animate-float">
                <p className="eyebrow mb-3">What's inside</p>
                {[
                  { icon: Video, label: 'Video Lectures', sub: 'Topic-wise, YouTube-hosted' },
                  { icon: FileText, label: 'PDF Notes & PYQs', sub: 'Download or view online' },
                  { icon: BookOpen, label: 'Practice Sets', sub: 'Print-ready, no timer' }
                ].map((r, i) => (
                  <div key={i} className="flex items-center gap-3 py-2.5 border-b last:border-0 border-ink-100 dark:border-white/10">
                    <span className="w-9 h-9 rounded-lg bg-royal-50 dark:bg-white/10 grid place-items-center text-royal-600 dark:text-jade-400 shrink-0">
                      <r.icon size={16} />
                    </span>
                    <div>
                      <p className="text-sm font-medium">{r.label}</p>
                      <p className="text-xs text-ink-400">{r.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="card p-5 mt-4 -mr-6 ml-10">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-jade-50 dark:bg-white/10 grid place-items-center text-jade-600 dark:text-jade-400">
                    <ShieldCheck size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Lifetime access</p>
                    <p className="text-xs text-ink-400">on every course & material purchase</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="section -mt-6 mb-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: BookOpen, label: 'Structured Courses' },
            { icon: Video, label: 'YouTube Video Lectures' },
            { icon: FileText, label: 'Downloadable PDFs' },
            { icon: ShieldCheck, label: 'Secure Razorpay Checkout' }
          ].map((s, i) => (
            <div key={i} className="card p-4 flex items-center gap-3">
              <span className="w-9 h-9 rounded-lg bg-royal-50 dark:bg-white/10 grid place-items-center text-royal-600 dark:text-jade-400 shrink-0">
                <s.icon size={17} />
              </span>
              <span className="text-sm font-medium">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Courses */}
      <section className="section mb-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="eyebrow">Handpicked</span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2">Featured Courses</h2>
          </div>
          <Link to="/courses" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-royal-600 dark:text-jade-400">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => <div key={i} className="card h-64 animate-pulse" />)}
          </div>
        ) : courses.length === 0 ? (
          <EmptyState icon={BookOpen} title="No courses published yet" text="Add your first course from the Admin Panel and it will appear here instantly." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((c, i) => <CourseCard key={c.id} course={c} index={i} />)}
          </div>
        )}
      </section>

      {/* Reviews */}
      <section className="section mb-24">
        <span className="eyebrow">Student voices</span>
        <h2 className="text-2xl sm:text-3xl font-bold mt-2 mb-8">What our students say</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((r, i) => <ReviewCard key={r.id} review={r} index={i} />)}
        </div>
      </section>

      {/* FAQ */}
      <section className="section mb-24 max-w-3xl">
        <span className="eyebrow">Good to know</span>
        <h2 className="text-2xl sm:text-3xl font-bold mt-2 mb-8">Frequently Asked Questions</h2>
        <FAQ items={faqs} />
      </section>

      {/* CTA */}
      <section className="section mb-24">
        <div className="rounded-3xl bg-cta-gradient p-10 sm:p-14 text-center text-white relative overflow-hidden">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Stop hunting for material. Start studying.</h2>
          <p className="text-white/85 max-w-xl mx-auto mb-7">Join students who already have their courses, notes and papers organized in one dashboard.</p>
          <Link to="/auth" className="inline-flex items-center gap-2 bg-white text-royal-700 font-semibold px-7 py-3 rounded-xl hover:bg-white/90 transition-colors">
            Get Started Free <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
