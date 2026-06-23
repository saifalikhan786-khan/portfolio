import { LogOut, Shield } from 'lucide-react'
import type { AdminUser } from '../../lib/auth'
import { isSuperAdmin } from '../../lib/auth'

interface AdminLayoutProps {
  user: AdminUser
  onLogout: () => void
  children: React.ReactNode
}

export function AdminLayout({ user, onLogout, children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-obs-bg text-obs-text">
      <header className="border-b border-obs-border bg-obs-surface/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-obs-cyan/10 text-obs-cyan">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-semibold">Admin Console</h1>
              <p className="text-xs text-obs-muted">
                {user.name} · {isSuperAdmin(user) ? 'Super Admin' : 'Admin'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#/"
              className="text-sm text-obs-muted hover:text-obs-cyan transition-colors"
            >
              ← Back to Portfolio
            </a>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm border border-obs-border bg-obs-surface hover:border-obs-rose/50 hover:text-obs-rose transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
