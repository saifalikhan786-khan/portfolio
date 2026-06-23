import { useEffect, useState } from 'react'
import { motion, useSpring } from 'framer-motion'

interface AnimatedCounterProps {
  value: number
  suffix?: string
  duration?: number
}

export function AnimatedCounter({ value, suffix = '', duration = 1.5 }: AnimatedCounterProps) {
  const [display, setDisplay] = useState(0)
  const spring = useSpring(0, { duration: duration * 1000, bounce: 0 })

  useEffect(() => {
    spring.set(value)
    const unsubscribe = spring.on('change', (v) => setDisplay(Math.round(v)))
    return unsubscribe
  }, [value, spring])

  return (
    <span>
      {display}
      {suffix}
    </span>
  )
}

interface MetricCardProps {
  label: string
  value: number | string
  suffix?: string
  icon: React.ReactNode
  trend?: string
  color?: 'cyan' | 'teal' | 'purple' | 'amber'
  delay?: number
}

const colorMap = {
  cyan: 'text-obs-cyan border-obs-cyan/30 bg-obs-cyan/5',
  teal: 'text-obs-teal border-obs-teal/30 bg-obs-teal/5',
  purple: 'text-obs-purple border-obs-purple/30 bg-obs-purple/5',
  amber: 'text-obs-amber border-obs-amber/30 bg-obs-amber/5',
}

export function MetricCard({
  label,
  value,
  suffix,
  icon,
  trend,
  color = 'cyan',
  delay = 0,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`glass-card rounded-xl p-5 border ${colorMap[color].split(' ').slice(1).join(' ')}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${colorMap[color]}`}>{icon}</div>
        {trend && (
          <span className="text-xs font-mono text-obs-teal bg-obs-teal/10 px-2 py-0.5 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold font-mono text-obs-text">
        {typeof value === 'number' ? (
          <AnimatedCounter value={value} suffix={suffix} />
        ) : (
          value
        )}
      </p>
      <p className="text-sm text-obs-muted mt-1">{label}</p>
    </motion.div>
  )
}

interface ProgressBarProps {
  label: string
  value: number
  delay?: number
}

export function ProgressBar({ label, value, delay = 0 }: ProgressBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-obs-text">{label}</span>
        <span className="font-mono text-obs-cyan">{value}%</span>
      </div>
      <div className="h-2 bg-obs-border/50 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ delay, duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-obs-cyan to-obs-teal"
        />
      </div>
    </div>
  )
}

interface StatusBadgeProps {
  status: 'online' | 'active' | 'monitoring'
  label: string
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const colors = {
    online: 'bg-obs-teal',
    active: 'bg-obs-cyan',
    monitoring: 'bg-obs-amber',
  }

  return (
    <span className="inline-flex items-center gap-2 text-xs font-mono text-obs-muted bg-obs-surface border border-obs-border px-3 py-1.5 rounded-full">
      <span className={`w-2 h-2 rounded-full ${colors[status]} status-pulse`} />
      {label}
    </span>
  )
}

interface SectionHeaderProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
}

export function SectionHeader({ title, subtitle, icon }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="mb-6"
    >
      <div className="flex items-center gap-3 mb-1">
        {icon && <div className="text-obs-cyan">{icon}</div>}
        <h2 className="text-xl font-semibold text-obs-text">{title}</h2>
      </div>
      {subtitle && <p className="text-sm text-obs-muted ml-0.5">{subtitle}</p>}
    </motion.div>
  )
}

export function GlowOrb() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -40, 20, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-obs-cyan/8 blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -25, 15, 0],
          y: [0, 30, -25, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-obs-purple/8 blur-3xl"
      />
    </div>
  )
}
