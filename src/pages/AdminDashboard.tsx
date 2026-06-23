import { useCallback, useEffect, useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AdminLayout } from '../components/admin/AdminLayout'
import { MessageTable } from '../components/admin/MessageTable'
import { UserManagement } from '../components/admin/UserManagement'
import {
  createAdminUser,
  deleteAdminUser,
  fetchAdminUsers,
  fetchContactMessages,
  logoutAdmin,
  removeContactMessage,
  updateAdminUser,
  verifySession,
} from '../lib/admin'
import {
  clearSession,
  getStoredSession,
  isSuperAdmin,
  storeSession,
  type AdminUser,
} from '../lib/auth'
import type { ContactMessageRow } from '../lib/supabase'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState<AdminUser | null>(null)
  const [messages, setMessages] = useState<ContactMessageRow[]>([])
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loadingMessages, setLoadingMessages] = useState(true)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [error, setError] = useState('')
  const [initDone, setInitDone] = useState(false)

  const session = getStoredSession()
  const token = session?.token

  const loadMessages = useCallback(async () => {
    if (!token) return
    setLoadingMessages(true)
    setError('')
    try {
      const data = await fetchContactMessages(token)
      setMessages(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages')
    } finally {
      setLoadingMessages(false)
    }
  }, [token])

  const loadUsers = useCallback(async () => {
    if (!token || !user || !isSuperAdmin(user)) return
    setLoadingUsers(true)
    try {
      const data = await fetchAdminUsers(token)
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users')
    } finally {
      setLoadingUsers(false)
    }
  }, [token, user])

  useEffect(() => {
    async function init() {
      if (!token) {
        navigate('/admin', { replace: true })
        return
      }

      try {
        const verified = await verifySession(token)
        setUser(verified)
        storeSession({ token, user: verified })
      } catch {
        clearSession()
        navigate('/admin', { replace: true })
      } finally {
        setInitDone(true)
      }
    }
    init()
  }, [token, navigate])

  useEffect(() => {
    if (user && token) loadMessages()
  }, [user, token, loadMessages])

  useEffect(() => {
    if (user && isSuperAdmin(user)) loadUsers()
  }, [user, loadUsers])

  const handleLogout = async () => {
    if (token) {
      try {
        await logoutAdmin(token)
      } catch {
        /* ignore */
      }
    }
    clearSession()
    navigate('/admin', { replace: true })
  }

  const handleDeleteMessage = async (id: string) => {
    if (!token) return
    await removeContactMessage(token, id)
    setMessages((prev) => prev.filter((m) => m.id !== id))
  }

  const handleCreateUser = async (input: Parameters<typeof createAdminUser>[1]) => {
    if (!token) throw new Error('Not authenticated')
    setError('')
    const newUser = await createAdminUser(token, input)
    setUsers((prev) => [newUser, ...prev.filter((u) => u.id !== newUser.id)])
    return newUser
  }

  const handleUpdateUser = async (input: Parameters<typeof updateAdminUser>[1]) => {
    if (!token) throw new Error('Not authenticated')
    setError('')
    const updated = await updateAdminUser(token, input)
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)))
    return updated
  }

  const handleDeleteUser = async (userId: string) => {
    if (!token) throw new Error('Not authenticated')
    setError('')
    await deleteAdminUser(token, userId)
    setUsers((prev) => prev.filter((u) => u.id !== userId))
  }

  if (!initDone || !user) {
    return (
      <div className="min-h-screen bg-obs-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-obs-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <AdminLayout user={user} onLogout={handleLogout}>
      <div className="space-y-6">
        {error && (
          <div className="flex items-start gap-2 p-4 rounded-lg bg-obs-rose/10 border border-obs-rose/30 text-obs-rose text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <MessageTable
          messages={messages}
          loading={loadingMessages}
          canDelete={isSuperAdmin(user)}
          onRefresh={loadMessages}
          onDelete={handleDeleteMessage}
        />

        {isSuperAdmin(user) && (
          <UserManagement
            users={users}
            currentUserId={user.id}
            loading={loadingUsers}
            onRefresh={loadUsers}
            onCreate={handleCreateUser}
            onUpdate={handleUpdateUser}
            onDelete={handleDeleteUser}
          />
        )}
      </div>
    </AdminLayout>
  )
}
