import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export interface ContactMessage {
  name: string
  email?: string
  message: string
}

export interface ContactMessageRow extends ContactMessage {
  id: string
  created_at: string
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

let client: SupabaseClient | null = null

export function getClient(): SupabaseClient {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env')
  }
  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey)
  }
  return client
}

export async function submitContactMessage(data: ContactMessage) {
  const supabase = getClient()

  const { error } = await supabase.from('contact_messages').insert({
    name: data.name.trim(),
    email: data.email?.trim() || null,
    message: data.message.trim(),
  })

  if (error) throw error
}
