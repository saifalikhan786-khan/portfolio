import type { AdminUser, AuthSession } from './auth'
import type { ContactMessageRow } from './supabase'
import { getClient, isSupabaseConfigured } from './supabase'

function ensureConfigured() {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured')
  }
}

export async function loginAdmin(email: string, password: string): Promise<AuthSession> {
  ensureConfigured()
  const supabase = getClient()

  const { data, error } = await supabase.rpc('login_admin', {
    p_email: email,
    p_password: password,
  })

  if (error) throw new Error(error.message)
  return data as AuthSession
}

export async function verifySession(token: string): Promise<AdminUser> {
  ensureConfigured()
  const supabase = getClient()

  const { data, error } = await supabase.rpc('verify_admin_session', {
    p_token: token,
  })

  if (error) throw new Error(error.message)
  return data as AdminUser
}

export async function logoutAdmin(token: string) {
  ensureConfigured()
  const supabase = getClient()
  await supabase.rpc('logout_admin', { p_token: token })
}

export async function fetchContactMessages(token: string): Promise<ContactMessageRow[]> {
  ensureConfigured()
  const supabase = getClient()

  const { data, error } = await supabase.rpc('get_contact_messages', {
    p_token: token,
  })

  if (error) throw new Error(error.message)
  return (data ?? []) as ContactMessageRow[]
}

export async function removeContactMessage(token: string, messageId: string) {
  ensureConfigured()
  const supabase = getClient()

  const { error } = await supabase.rpc('delete_contact_message', {
    p_token: token,
    p_message_id: messageId,
  })

  if (error) throw new Error(error.message)
}

export async function fetchAdminUsers(token: string): Promise<AdminUser[]> {
  ensureConfigured()
  const supabase = getClient()

  const { data, error } = await supabase.rpc('get_admin_users', {
    p_token: token,
  })

  if (error) throw new Error(error.message)

  const rows = (data ?? []) as AdminUser[] | string[]
  return rows.map((row) => (typeof row === 'string' ? JSON.parse(row) : row)) as AdminUser[]
}

export interface CreateUserInput {
  name: string
  email: string
  mobile?: string
  password: string
  role: 'admin' | 'super-admin'
}

export async function createAdminUser(token: string, input: CreateUserInput): Promise<AdminUser> {
  ensureConfigured()
  const supabase = getClient()

  const { data, error } = await supabase.rpc('create_admin_user', {
    p_token: token,
    p_name: input.name,
    p_email: input.email,
    p_mobile: input.mobile ?? '',
    p_password: input.password,
    p_role: input.role,
  })

  if (error) throw new Error(error.message)
  return data as AdminUser
}

export interface UpdateUserInput {
  userId: string
  name: string
  email: string
  mobile?: string
  password?: string
  role?: 'admin' | 'super-admin'
}

export async function updateAdminUser(token: string, input: UpdateUserInput): Promise<AdminUser> {
  ensureConfigured()
  const supabase = getClient()

  const { data, error } = await supabase.rpc('update_admin_user', {
    p_token: token,
    p_user_id: input.userId,
    p_name: input.name,
    p_email: input.email,
    p_mobile: input.mobile ?? '',
    p_password: input.password ?? null,
    p_role: input.role ?? null,
  })

  if (error) throw new Error(error.message)
  return data as AdminUser
}

export async function deleteAdminUser(token: string, userId: string) {
  ensureConfigured()
  const supabase = getClient()

  const { error } = await supabase.rpc('delete_admin_user', {
    p_token: token,
    p_user_id: userId,
  })

  if (error) throw new Error(error.message)
}
