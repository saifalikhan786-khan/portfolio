import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Award,
  Briefcase,
  Clock,
  LayoutDashboard,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react'
import { profile } from '../../data/profile'
import { MetricCard, SectionHeader } from '../ui/MetricCard'

const activityData = [
  { month: 'Feb', value: 20 },
  { month: 'Apr', value: 35 },
  { month: 'Jun', value: 45 },
  { month: 'Aug', value: 55 },
  { month: 'Oct', value: 70 },
  { month: 'Dec', value: 78 },
  { month: 'Feb', value: 92 },
]

export function OverviewSection() {
  const themes = useMemo(() => profile.themes, [])

  return (
    <section id="overview" className="scroll-mt-4">
      <SectionHeader
        title="Platform Overview"
        subtitle="Real-time profile metrics & career trajectory"
        icon={<LayoutDashboard className="w-5 h-5" />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <MetricCard
          label="Years Experience"
          value={profile.metrics.experienceYears}
          suffix="+"
          icon={<Clock className="w-5 h-5" />}
          trend="+1 role"
          color="cyan"
          delay={0}
        />
        <MetricCard
          label="Certifications"
          value={profile.metrics.certifications}
          icon={<Award className="w-5 h-5" />}
          trend="6x Dynatrace"
          color="teal"
          delay={0.1}
        />
        <MetricCard
          label="LinkedIn Network"
          value={profile.personal.connections}
          suffix="+"
          icon={<Users className="w-5 h-5" />}
          trend={`${profile.personal.followers} followers`}
          color="purple"
          delay={0.2}
        />
        <MetricCard
          label="Core Skills"
          value={profile.metrics.skills}
          icon={<Zap className="w-5 h-5" />}
          trend="Active"
          color="amber"
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-2 glass-card rounded-xl p-5 border border-obs-border"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-obs-cyan" />
              Career Growth Index
            </h3>
            <span className="text-xs font-mono text-obs-teal">↑ 92% trajectory</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#00d4ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4a" />
                <XAxis dataKey="month" stroke="#7b8ba8" fontSize={11} tickLine={false} />
                <YAxis stroke="#7b8ba8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#111b2e',
                    border: '1px solid #1e2d4a',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#00d4ff"
                  strokeWidth={2}
                  fill="url(#growthGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-5 border border-obs-border"
        >
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-obs-purple" />
            Focus Domains
          </h3>
          <div className="flex flex-wrap gap-2">
            {themes.map((theme, i) => (
              <motion.span
                key={theme}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="text-xs px-3 py-1.5 rounded-full border border-obs-border bg-obs-surface text-obs-muted hover:border-obs-cyan/50 hover:text-obs-cyan transition-colors cursor-default"
              >
                {theme}
              </motion.span>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-obs-border">
            <h4 className="text-xs font-mono text-obs-muted mb-3">CAREER HIGHLIGHTS</h4>
            <ul className="space-y-2">
              {profile.careerHighlights.slice(0, 3).map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-xs text-obs-muted flex gap-2"
                >
                  <span className="text-obs-teal shrink-0">▸</span>
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-xl p-5 border border-obs-border"
        >
          <h3 className="text-sm font-semibold mb-3">About</h3>
          <p className="text-sm text-obs-muted leading-relaxed">{profile.about.summary}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-5 border border-obs-border"
        >
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
            <Briefcase className="w-4 h-4 text-obs-cyan" />
            Recent Activity Feed
          </h3>
          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
            {profile.recentActivity.map((activity, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-3 p-3 rounded-lg bg-obs-surface/50 border border-obs-border/50 hover:border-obs-cyan/30 transition-colors"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-obs-cyan mt-2 shrink-0 status-pulse" />
                <div>
                  <p className="text-xs font-semibold text-obs-text">{activity.topic}</p>
                  <p className="text-xs text-obs-muted mt-0.5">{activity.summary}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
