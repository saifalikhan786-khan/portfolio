import { useState } from 'react'
import { AlertCircle, Edit2, Loader2, Plus, Shield, Trash2, UserCog, Users } from 'lucide-react'
import type { AdminUser } from '../../lib/auth'
import type { CreateUserInput } from '../../lib/admin'
import { Modal } from '../ui/Modal'

interface UserManagementProps {
  users: AdminUser[]
  currentUserId: string
  loading: boolean
  onRefresh: () => void
  onCreate: (input: CreateUserInput) => Promise<AdminUser>
  onUpdate: (input: {
    userId: string
    name: string
    email: string
    mobile?: string
    password?: string
    role?: 'admin' | 'super-admin'
  }) => Promise<AdminUser>
  onDelete: (userId: string) => Promise<void>
}

const emptyForm = {
  name: '',
  email: '',
  mobile: '',
  password: '',
  role: 'admin' as 'admin' | 'super-admin',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { dateStyle: 'medium' })
}

export function UserManagement({
  users,
  currentUserId,
  loading,
  onRefresh,
  onCreate,
  onUpdate,
  onDelete,
}: UserManagementProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [formError, setFormError] = useState('')

  const openCreate = () => {
    setEditingUser(null)
    setForm(emptyForm)
    setFormError('')
    setShowForm(true)
  }

  const openEdit = (user: AdminUser) => {
    setEditingUser(user)
    setForm({
      name: user.name,
      email: user.email,
      mobile: user.mobile ?? '',
      password: '',
      role: user.role,
    })
    setFormError('')
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingUser(null)
    setForm(emptyForm)
    setFormError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setFormError('')

    try {
      if (editingUser) {
        await onUpdate({
          userId: editingUser.id,
          name: form.name,
          email: form.email,
          mobile: form.mobile,
          password: form.password || undefined,
          role: form.role,
        })
      } else {
        if (form.password.length < 8) {
          setFormError('Password must be at least 8 characters')
          return
        }
        await onCreate({
          name: form.name,
          email: form.email,
          mobile: form.mobile,
          password: form.password,
          role: form.role,
        })
      }
      closeForm()
      onRefresh()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save user')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm('Delete this admin user permanently?')) return
    setDeletingId(userId)
    try {
      await onDelete(userId)
      onRefresh()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to delete user')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <div className="glass-card rounded-xl border border-obs-border overflow-hidden">
        <div className="p-5 border-b border-obs-border flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-obs-purple" />
            <h2 className="font-semibold">Admin Users</h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-obs-purple/10 text-obs-purple border border-obs-purple/30">
              {users.length}
            </span>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-obs-purple/15 text-obs-purple border border-obs-purple/30 hover:bg-obs-purple/25 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Admin
          </button>
        </div>

        {loading && users.length === 0 ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-8 h-8 text-obs-purple animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-obs-border text-obs-muted text-left">
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Mobile</th>
                  <th className="p-4 font-medium">Role</th>
                  <th className="p-4 font-medium">Created</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-obs-border/50 hover:bg-obs-surface/30">
                    <td className="p-4 font-medium">{user.name}</td>
                    <td className="p-4 text-obs-muted">{user.email}</td>
                    <td className="p-4 text-obs-muted">{user.mobile || '—'}</td>
                    <td className="p-4">
                      <span
                        className={`text-xs font-mono px-2 py-0.5 rounded-full border ${
                          user.role === 'super-admin'
                            ? 'bg-obs-amber/10 text-obs-amber border-obs-amber/30'
                            : 'bg-obs-cyan/10 text-obs-cyan border-obs-cyan/30'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-obs-muted font-mono text-xs">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(user)}
                          className="p-2 rounded-lg text-obs-muted hover:text-obs-cyan hover:bg-obs-cyan/10 transition-colors"
                          aria-label="Edit user"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {user.id !== currentUserId && (
                          <button
                            type="button"
                            onClick={() => handleDelete(user.id)}
                            disabled={deletingId === user.id}
                            className="p-2 rounded-lg text-obs-muted hover:text-obs-rose hover:bg-obs-rose/10 transition-colors disabled:opacity-60"
                            aria-label="Delete user"
                          >
                            {deletingId === user.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={showForm}
        onClose={closeForm}
        title={
          <span className="flex items-center gap-2">
            <UserCog className="w-5 h-5 text-obs-purple" />
            {editingUser ? 'Edit Admin User' : 'Create Admin User'}
          </span>
        }
      >
        {formError && (
          <div className="mb-4 flex items-start gap-2 p-3 rounded-lg bg-obs-rose/10 border border-obs-rose/30 text-obs-rose text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-obs-muted mb-1 block">Name</label>
            <input
              required
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={submitting}
              className="w-full px-4 py-2.5 rounded-lg bg-obs-surface border border-obs-border text-sm focus:outline-none focus:border-obs-cyan/50 disabled:opacity-60"
            />
          </div>
          <div>
            <label className="text-xs text-obs-muted mb-1 block">Email</label>
            <input
              required
              type="email"
              placeholder="admin@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={submitting}
              className="w-full px-4 py-2.5 rounded-lg bg-obs-surface border border-obs-border text-sm focus:outline-none focus:border-obs-cyan/50 disabled:opacity-60"
            />
          </div>
          <div>
            <label className="text-xs text-obs-muted mb-1 block">Mobile (optional)</label>
            <input
              placeholder="+91 9876543210"
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              disabled={submitting}
              className="w-full px-4 py-2.5 rounded-lg bg-obs-surface border border-obs-border text-sm focus:outline-none focus:border-obs-cyan/50 disabled:opacity-60"
            />
          </div>
          <div>
            <label className="text-xs text-obs-muted mb-1 block">Password</label>
            <input
              type="password"
              required={!editingUser}
              placeholder={editingUser ? 'Leave blank to keep current password' : 'Minimum 8 characters'}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              minLength={editingUser ? undefined : 8}
              disabled={submitting}
              className="w-full px-4 py-2.5 rounded-lg bg-obs-surface border border-obs-border text-sm focus:outline-none focus:border-obs-cyan/50 disabled:opacity-60"
            />
          </div>
          <div>
            <label className="text-xs text-obs-muted mb-1 block">Role</label>
            <select
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value as 'admin' | 'super-admin' })
              }
              disabled={submitting}
              className="w-full px-4 py-2.5 rounded-lg bg-obs-surface border border-obs-border text-sm focus:outline-none focus:border-obs-cyan/50 disabled:opacity-60"
            >
              <option value="admin">Admin (view messages only)</option>
              <option value="super-admin">Super Admin (full access)</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={closeForm}
              disabled={submitting}
              className="flex-1 py-2.5 rounded-lg border border-obs-border text-sm hover:bg-obs-surface transition-colors disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-obs-purple to-obs-cyan text-obs-bg font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Shield className="w-4 h-4" />
              )}
              {submitting ? 'Saving...' : editingUser ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
