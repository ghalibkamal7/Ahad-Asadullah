import { motion } from 'framer-motion'
import { Target, Heart, Sparkles } from 'lucide-react'

export default function About() {
  return (
    <div className="section py-14">
      <div className="max-w-2xl">
        <span className="eyebrow">Our story</span>
        <h1 className="text-3xl sm:text-4xl font-bold mt-2 mb-5">About Ahad Asadullah</h1>
        <p className="text-ink-500 dark:text-ink-400 leading-relaxed mb-4">
          Ahad Asadullah started as a single doubt-clearing session for a handful of exam aspirants and grew into a
          full preparation platform — because the gap between "studying hard" and "studying right" is where most
          attempts are won or lost.
        </p>
        <p className="text-ink-500 dark:text-ink-400 leading-relaxed">
          Today, the platform brings together structured courses, live batches, exam-accurate test series and free
          resources in one place, so aspirants spend less time hunting for material and more time practicing.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 mt-14">
        {[
          { icon: Target, title: 'Focused Curriculum', text: 'Every course maps directly to the actual exam syllabus — no filler chapters.' },
          { icon: Sparkles, title: 'Exam-Accurate Material', text: 'Papers and practice sets mirror the pattern and difficulty of the real exam.' },
          { icon: Heart, title: 'Student First', text: 'Doubt sessions, progress tracking and honest feedback — not just video lectures.' }
        ].map((v, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="card p-6"
          >
            <span className="w-11 h-11 rounded-xl bg-royal-50 dark:bg-white/10 grid place-items-center text-royal-600 dark:text-jade-400 mb-4">
              <v.icon size={20} />
            </span>
            <h3 className="font-semibold mb-2">{v.title}</h3>
            <p className="text-sm text-ink-500 dark:text-ink-400 leading-relaxed">{v.text}</p>
          </motion.div>
        ))}
      </div>

      <div className="card p-8 sm:p-10 mt-14 flex flex-col sm:flex-row items-center gap-8">
        <div className="w-28 h-28 rounded-2xl bg-cta-gradient shrink-0 grid place-items-center text-white text-3xl font-display font-bold">
          AA
        </div>
        <div>
          <h3 className="text-xl font-bold mb-1">Ahad Asadullah</h3>
          <p className="text-sm text-royal-600 dark:text-jade-400 font-medium mb-3">Founder & Lead Educator</p>
          <p className="text-sm text-ink-500 dark:text-ink-400 leading-relaxed">
            Years of experience mentoring competitive exam aspirants across banking, SSC and railway exams —
            now building the platform to scale that mentorship to everyone preparing seriously.
          </p>
        </div>
      </div>
    </div>
  )
}
