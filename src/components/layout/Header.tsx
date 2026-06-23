import { motion } from 'framer-motion'
import { MapPin, Radio } from 'lucide-react'
import { profile } from '../../data/profile'
import { StatusBadge } from '../ui/MetricCard'

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-30 border-b border-obs-border bg-obs-bg/80 backdrop-blur-xl"
    >
      <div className="px-4 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="pl-12 lg:pl-0">
          <h1 className="text-lg font-semibold text-obs-text">
            {profile.personal.title}
          </h1>
          <p className="text-sm text-obs-muted mt-0.5">{profile.personal.tagline}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status="online" label="Available" />
          <StatusBadge status="monitoring" label="APM Active" />
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-obs-muted font-mono bg-obs-surface border border-obs-border px-3 py-1.5 rounded-full">
            <MapPin className="w-3 h-3" />
            {profile.personal.location}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-obs-cyan font-mono bg-obs-cyan/10 border border-obs-cyan/20 px-3 py-1.5 rounded-full">
            <Radio className="w-3 h-3" />
            {profile.personal.totalExperience}
          </span>
        </div>
      </div>
    </motion.header>
  )
}
