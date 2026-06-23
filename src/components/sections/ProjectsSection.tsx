import { motion } from 'framer-motion'
import { FolderKanban, Layers } from 'lucide-react'
import { profile } from '../../data/profile'
import { SectionHeader } from '../ui/MetricCard'

export function ProjectsSection() {
  return (
    <section id="projects" className="scroll-mt-4 mt-10">
      <SectionHeader
        title="Projects"
        subtitle="Engineering projects & technical initiatives"
        icon={<FolderKanban className="w-5 h-5" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profile.projects.map((project, index) => (
          <motion.article
            key={project.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="glass-card rounded-xl p-6 border border-obs-border group relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-obs-cyan/10 via-transparent to-obs-purple/10" />
            </div>

            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-obs-surface border border-obs-border">
                  <Layers className="w-5 h-5 text-obs-cyan" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-obs-amber/10 text-obs-amber border border-obs-amber/30">
                  {project.type}
                </span>
              </div>

              <h3 className="font-semibold text-obs-text mb-2">{project.title}</h3>
              <p className="text-sm text-obs-muted leading-relaxed mb-4">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-2.5 py-1 rounded-md bg-obs-surface border border-obs-border text-obs-muted font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
