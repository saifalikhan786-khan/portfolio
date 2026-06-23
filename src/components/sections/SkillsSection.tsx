import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { Cpu } from 'lucide-react'
import { profile } from '../../data/profile'
import { ProgressBar, SectionHeader } from '../ui/MetricCard'

const radarData = profile.skillLevels.map((s) => ({
  skill: s.skill.split(' ')[0],
  fullSkill: s.skill,
  level: s.level,
}))

export function SkillsSection() {
  const [activeTab, setActiveTab] = useState<'technical' | 'professional'>('technical')

  const skills =
    activeTab === 'technical' ? profile.skills.technical : profile.skills.professional

  return (
    <section id="skills" className="scroll-mt-4 mt-10">
      <SectionHeader
        title="Skills & Technologies"
        subtitle="Competency matrix across observability stack"
        icon={<Cpu className="w-5 h-5" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-xl p-5 border border-obs-border"
        >
          <h3 className="text-sm font-semibold mb-4">Proficiency Radar</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1e2d4a" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: '#7b8ba8', fontSize: 10 }} />
                <Radar
                  name="Proficiency"
                  dataKey="level"
                  stroke="#00d4ff"
                  fill="#00d4ff"
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
                <Tooltip
                  content={({ payload }) => {
                    if (!payload?.[0]) return null
                    const data = payload[0].payload
                    return (
                      <div className="bg-obs-card border border-obs-border rounded-lg px-3 py-2 text-xs">
                        <p className="text-obs-text font-medium">{data.fullSkill}</p>
                        <p className="text-obs-cyan font-mono">{data.level}%</p>
                      </div>
                    )
                  }}
                />
              </RadarChart>
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
          <h3 className="text-sm font-semibold mb-4">Skill Levels</h3>
          <div className="space-y-4">
            {profile.skillLevels.map((skill, i) => (
              <ProgressBar key={skill.skill} label={skill.skill} value={skill.level} delay={i * 0.1} />
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card rounded-xl p-5 border border-obs-border"
      >
        <div className="flex gap-2 mb-4">
          {(['technical', 'professional'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-obs-cyan/15 text-obs-cyan border border-obs-cyan/30'
                  : 'text-obs-muted hover:text-obs-text bg-obs-surface border border-obs-border'
              }`}
            >
              {tab === 'technical' ? 'Technical' : 'Professional'}
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2"
        >
          {skills.map((skill, i) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{
                scale: 1.08,
                boxShadow: '0 0 20px rgba(0, 212, 255, 0.2)',
              }}
              className="px-3 py-2 rounded-lg text-sm bg-obs-surface border border-obs-border text-obs-text cursor-default"
            >
              {skill}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
