import { getClient, isSupabaseConfigured } from './supabase'

export interface VisitorLog {
  id: string
  session_id: string
  visited_at: string
  page_path: string | null
  referrer: string | null
  user_agent: string | null
  language: string | null
  timezone: string | null
  screen_width: number | null
  screen_height: number | null
  is_return_visitor: boolean
  session_data: Record<string, unknown>
}

export interface AdminActionLog {
  id: string
  admin_user_id: string | null
  admin_email: string | null
  admin_name: string | null
  action: string
  details: Record<string, unknown>
  created_at: string
}

export async function fetchVisitorLogs(token: string, limit = 100): Promise<VisitorLog[]> {
  if (!isSupabaseConfigured) return []
  const supabase = getClient()
  const { data, error } = await supabase.rpc('get_visitor_logs', {
    p_token: token,
    p_limit: limit,
  })
  if (error) throw new Error(error.message)
  return (data ?? []) as VisitorLog[]
}

export async function fetchAdminActionLogs(token: string, limit = 100): Promise<AdminActionLog[]> {
  if (!isSupabaseConfigured) return []
  const supabase = getClient()
  const { data, error } = await supabase.rpc('get_admin_action_logs', {
    p_token: token,
    p_limit: limit,
  })
  if (error) throw new Error(error.message)
  return (data ?? []) as AdminActionLog[]
}
