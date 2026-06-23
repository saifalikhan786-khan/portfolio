export type UserRole = 'admin' | 'super-admin'

export interface AdminUser {
  id: string
  name: string
  email: string
  mobile: string | null
  role: UserRole
  created_at: string
}

export interface AuthSession {
  token: string
  user: AdminUser
}

const SESSION_KEY = 'portfolio_admin_session'

export function getStoredSession(): AuthSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthSession
  } catch {
    return null
  }
}

export function storeSession(session: AuthSession) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY)
}

export function isSuperAdmin(user: AdminUser) {
  return user.role === 'super-admin'
}
