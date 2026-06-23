import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, Loader2, Lock, Mail, Shield } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { loginAdmin } from '../lib/admin'
import { getStoredSession, storeSession } from '../lib/auth'
import { isSupabaseConfigured } from '../lib/supabase'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const session = getStoredSession()
    if (session) {
      navigate('/admin/dashboard', { replace: true })
    } else {
      setChecking(false)
    }
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const session = await loginAdmin(email, password)
      storeSession(session)
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-obs-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-obs-cyan animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-obs-bg grid-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card rounded-2xl border border-obs-border p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-obs-cyan/10 text-obs-cyan">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Admin Login</h1>
            <p className="text-sm text-obs-muted">Portfolio management console</p>
          </div>
        </div>

        {!isSupabaseConfigured && (
          <div className="mb-4 p-3 rounded-lg bg-obs-amber/10 border border-obs-amber/30 text-obs-amber text-sm">
            Supabase is not configured. Add credentials to <code>.env</code>
          </div>
        )}

        {error && (
          <div className="mb-4 flex items-start gap-2 p-3 rounded-lg bg-obs-rose/10 border border-obs-rose/30 text-obs-rose text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-obs-muted mb-1.5 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obs-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                placeholder="admin@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-obs-surface border border-obs-border text-sm focus:outline-none focus:border-obs-cyan/50 disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-obs-muted mb-1.5 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obs-muted" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-obs-surface border border-obs-border text-sm focus:outline-none focus:border-obs-cyan/50 disabled:opacity-60"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-obs-cyan to-obs-teal text-obs-bg font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-obs-muted mt-6">
          <a href="#/" className="hover:text-obs-cyan transition-colors">
            ← Return to portfolio
          </a>
        </p>
      </motion.div>
    </div>
  )
}
