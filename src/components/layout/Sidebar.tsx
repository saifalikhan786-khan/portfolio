import { motion } from 'framer-motion'
import {
  Activity,
  Award,
  Briefcase,
  Cpu,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  Mail,
  Menu,
  X,
} from 'lucide-react'
import { navItems, profile, type SectionId } from '../../data/profile'
import { useClock } from '../../hooks/useActiveSection'

const iconMap = {
  'layout-dashboard': LayoutDashboard,
  briefcase: Briefcase,
  cpu: Cpu,
  award: Award,
  'graduation-cap': GraduationCap,
  'folder-kanban': FolderKanban,
  mail: Mail,
}

interface SidebarProps {
  activeSection: SectionId
  mobileOpen: boolean
  onMobileToggle: () => void
  onNavigate: (id: SectionId) => void
}

export function Sidebar({ activeSection, mobileOpen, onMobileToggle, onNavigate }: SidebarProps) {
  const time = useClock()

  const handleNav = (id: SectionId) => {
    onNavigate(id)
    if (mobileOpen) onMobileToggle()
  }

  const sidebarContent = (
    <>
      <div className="p-5 border-b border-obs-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-obs-cyan to-obs-teal flex items-center justify-center font-bold text-obs-bg text-sm">
            SK
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">{profile.personal.fullName}</p>
            <p className="text-xs text-obs-muted truncate">Observability Console</p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs font-mono text-obs-muted">
          <span className="flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-obs-teal" />
            LIVE
          </span>
          <span>{time} IST</span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap]
          const isActive = activeSection === item.id

          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'text-obs-cyan bg-obs-cyan/10'
                  : 'text-obs-muted hover:text-obs-text hover:bg-obs-surface'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 rounded-lg border border-obs-cyan/30 bg-obs-cyan/5"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                />
              )}
              <Icon className="w-4 h-4 relative z-10" />
              <span className="relative z-10">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-obs-border">
        <div className="glass-card rounded-lg p-3 text-xs">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-obs-teal status-pulse" />
            <span className="text-obs-teal font-mono">SYSTEM HEALTH</span>
          </div>
          <p className="text-obs-muted">All modules operational</p>
          <div className="mt-2 h-1 bg-obs-border rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '98%' }}
              transition={{ duration: 2, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-obs-teal to-obs-cyan rounded-full"
            />
          </div>
        </div>
      </div>
    </>
  )

  return (
    <>
      <button
        onClick={onMobileToggle}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg glass-card border border-obs-border text-obs-text"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <aside className="hidden lg:flex flex-col w-64 border-r border-obs-border bg-obs-surface/80 backdrop-blur-xl fixed inset-y-0 left-0 z-40">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <motion.aside
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          exit={{ x: -280 }}
          className="lg:hidden flex flex-col w-72 border-r border-obs-border bg-obs-surface fixed inset-y-0 left-0 z-40"
        >
          {sidebarContent}
        </motion.aside>
      )}
    </>
  )
}
