import { motion } from 'framer-motion'
import { GraduationCap, MapPin } from 'lucide-react'
import { profile } from '../../data/profile'
import { SectionHeader } from '../ui/MetricCard'

export function EducationSection() {
  return (
    <section id="education" className="scroll-mt-4 mt-10">
      <SectionHeader
        title="Education"
        subtitle="Academic foundation in engineering & sciences"
        icon={<GraduationCap className="w-5 h-5" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {profile.education.map((edu, index) => (
          <motion.div
            key={edu.institution}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="glass-card rounded-xl p-5 border border-obs-border relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-obs-cyan/5 rounded-bl-full" />

            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-obs-purple/10 border border-obs-purple/30">
                  <GraduationCap className="w-4 h-4 text-obs-purple" />
                </div>
                <span className="text-xs font-mono text-obs-muted">
                  {edu.startYear} — {edu.endYear}
                </span>
              </div>

              <h3 className="font-semibold text-obs-text text-sm leading-snug">
                {edu.degree}
              </h3>
              {edu.fieldOfStudy && (
                <p className="text-xs text-obs-cyan mt-1">{edu.fieldOfStudy}</p>
              )}
              <p className="text-sm text-obs-muted mt-2">{edu.institution}</p>
              {edu.location && (
                <p className="text-xs text-obs-muted mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {edu.location}
                </p>
              )}
              <div className="mt-4 pt-3 border-t border-obs-border/50">
                <span className="text-xs font-mono text-obs-teal">
                  {edu.durationYears} {edu.durationYears === 1 ? 'year' : 'years'}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card rounded-xl p-5 border border-obs-border mt-4"
      >
        <h3 className="text-sm font-semibold mb-3">Languages</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {profile.languages.map((lang, i) => (
            <motion.div
              key={lang.language}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="text-center p-3 rounded-lg bg-obs-surface border border-obs-border"
            >
              <p className="font-medium text-sm text-obs-text">{lang.language}</p>
              <p className="text-xs text-obs-muted mt-0.5">{lang.proficiency}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
