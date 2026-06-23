import { useState } from 'react'
import { motion } from 'framer-motion'
import { Award, ExternalLink, Filter } from 'lucide-react'
import { profile } from '../../data/profile'
import { SectionHeader } from '../ui/MetricCard'

const categoryColors: Record<string, string> = {
  Dynatrace: 'border-obs-cyan/40 bg-obs-cyan/10 text-obs-cyan',
  AI: 'border-obs-purple/40 bg-obs-purple/10 text-obs-purple',
  Cloud: 'border-obs-blue/40 bg-obs-blue/10 text-obs-blue',
  Data: 'border-obs-teal/40 bg-obs-teal/10 text-obs-teal',
  Security: 'border-obs-rose/40 bg-obs-rose/10 text-obs-rose',
}

const categories = ['All', ...new Set(profile.certifications.map((c) => c.category))]

export function CertificationsSection() {
  const [filter, setFilter] = useState('All')

  const filtered =
    filter === 'All'
      ? profile.certifications
      : profile.certifications.filter((c) => c.category === filter)

  return (
    <section id="certifications" className="scroll-mt-4 mt-10">
      <SectionHeader
        title="Certifications & Badges"
        subtitle="Industry credentials across observability, cloud & AI"
        icon={<Award className="w-5 h-5" />}
      />

      <div className="flex flex-wrap items-center gap-2 mb-5">
        <Filter className="w-4 h-4 text-obs-muted" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === cat
                ? 'bg-obs-cyan/20 text-obs-cyan border border-obs-cyan/40'
                : 'bg-obs-surface text-obs-muted border border-obs-border hover:border-obs-cyan/30'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((cert, index) => (
          <motion.div
            key={cert.name}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="glass-card rounded-xl p-5 border border-obs-border group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-obs-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="p-2 rounded-lg bg-obs-surface border border-obs-border">
                  <Award className="w-5 h-5 text-obs-amber" />
                </div>
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${
                    categoryColors[cert.category] || 'border-obs-border text-obs-muted'
                  }`}
                >
                  {cert.category}
                </span>
              </div>

              <h3 className="font-semibold text-sm text-obs-text leading-snug mb-1">
                {cert.name}
              </h3>
              {cert.issuer && (
                <p className="text-xs text-obs-muted">{cert.issuer}</p>
              )}
              {cert.issuedDate && (
                <p className="text-xs font-mono text-obs-muted mt-1">
                  Issued {cert.issuedDate}
                </p>
              )}
              {cert.notes && (
                <p className="text-xs text-obs-muted mt-2 italic">{cert.notes}</p>
              )}
              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-3 text-xs text-obs-cyan hover:underline"
                >
                  Verify <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
