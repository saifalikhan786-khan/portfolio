import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Briefcase, ChevronDown, ExternalLink, MapPin } from 'lucide-react'
import { profile } from '../../data/profile'
import { SectionHeader } from '../ui/MetricCard'

function formatDate(dateStr: string) {
  const [year, month] = dateStr.split('-')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[parseInt(month, 10) - 1]} ${year}`
}

export function ExperienceSection() {
  const [expanded, setExpanded] = useState<number | null>(0)

  return (
    <section id="experience" className="scroll-mt-4 mt-10">
      <SectionHeader
        title="Experience Timeline"
        subtitle="Career progression in observability & platform product"
        icon={<Briefcase className="w-5 h-5" />}
      />

      <div className="relative">
        <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-obs-cyan via-obs-teal to-obs-border" />

        <div className="space-y-4">
          {profile.experience.map((job, index) => {
            const isExpanded = expanded === index
            const isCurrent = job.isCurrent

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-12"
              >
                <div
                  className={`absolute left-3 top-5 w-3 h-3 rounded-full border-2 ${
                    isCurrent
                      ? 'bg-obs-teal border-obs-teal status-pulse'
                      : 'bg-obs-surface border-obs-cyan'
                  }`}
                />

                <motion.div
                  layout
                  className={`glass-card rounded-xl border overflow-hidden ${
                    isCurrent ? 'border-obs-teal/40 glow-cyan' : 'border-obs-border'
                  }`}
                >
                  <button
                    onClick={() => setExpanded(isExpanded ? null : index)}
                    className="w-full text-left p-5 flex items-start justify-between gap-4 hover:bg-obs-surface/30 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold text-obs-text">{job.title}</h3>
                        {isCurrent && (
                          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-obs-teal/20 text-obs-teal border border-obs-teal/30">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-obs-muted">
                        <span className="text-obs-cyan font-medium">{job.company}</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {job.location}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-obs-muted mt-2">
                        {formatDate(job.startDate)} — {job.endDate ? formatDate(job.endDate) : 'Present'}
                        <span className="mx-2">·</span>
                        {job.duration}
                      </p>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-obs-muted shrink-0 mt-1"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 border-t border-obs-border/50 pt-4">
                          <p className="text-sm text-obs-muted mb-4">{job.description}</p>
                          {job.responsibilities.length > 0 && (
                            <ul className="space-y-2">
                              {job.responsibilities.map((resp, i) => (
                                <motion.li
                                  key={i}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.05 }}
                                  className="text-sm text-obs-muted flex gap-2"
                                >
                                  <span className="text-obs-cyan shrink-0">›</span>
                                  {resp}
                                </motion.li>
                              ))}
                            </ul>
                          )}
                          {job.companyUrl && (
                            <a
                              href={job.companyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 mt-4 text-xs text-obs-cyan hover:underline"
                            >
                              View Company <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
