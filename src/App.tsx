import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import { ContactSection } from './components/sections/ContactSection'
import { EducationSection } from './components/sections/EducationSection'
import { ExperienceSection } from './components/sections/ExperienceSection'
import { ProjectsSection } from './components/sections/ProjectsSection'
import { CommandPaletteHint, NetworkBackground } from './components/ui/NetworkBackground'
import { GlowOrb } from './components/ui/MetricCard'
import { navItems, type SectionId } from './data/profile'
import { useActiveSection } from './hooks/useActiveSection'
import { trackPortfolioVisit } from './lib/visitor'

const OverviewSection = lazy(() =>
  import('./components/sections/OverviewSection').then((m) => ({ default: m.OverviewSection })),
)
const SkillsSection = lazy(() =>
  import('./components/sections/SkillsSection').then((m) => ({ default: m.SkillsSection })),
)
const CertificationsSection = lazy(() =>
  import('./components/sections/CertificationsSection').then((m) => ({
    default: m.CertificationsSection,
  })),
)

function SectionLoader() {
  return (
    <div className="glass-card rounded-xl p-8 border border-obs-border animate-pulse">
      <div className="h-4 w-48 bg-obs-border rounded mb-4" />
      <div className="h-32 bg-obs-border/50 rounded" />
    </div>
  )
}

function App() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const sectionIds = navItems.map((n) => n.id)
  const activeSection = useActiveSection(sectionIds)

  const handleNavigate = useCallback((id: SectionId) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    trackPortfolioVisit()
  }, [])

  return (
    <div className="min-h-screen scan-overlay relative">
      <NetworkBackground />
      <GlowOrb />
      <div className="grid-bg fixed inset-0 pointer-events-none z-0 opacity-30" />

      <Sidebar
        activeSection={activeSection}
        mobileOpen={mobileOpen}
        onMobileToggle={() => setMobileOpen((o) => !o)}
        onNavigate={handleNavigate}
      />

      <div className="lg:pl-64 relative z-10">
        <Header />
        <main className="px-4 lg:px-8 py-6 max-w-6xl mx-auto space-y-2">
          <Suspense fallback={<SectionLoader />}>
            <OverviewSection />
          </Suspense>
          <ExperienceSection />
          <Suspense fallback={<SectionLoader />}>
            <SkillsSection />
          </Suspense>
          <Suspense fallback={<SectionLoader />}>
            <CertificationsSection />
          </Suspense>
          <EducationSection />
          <ProjectsSection />
          <ContactSection />
        </main>
      </div>

      <CommandPaletteHint />

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

export default App
