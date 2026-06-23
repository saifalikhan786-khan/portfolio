import { useState } from 'react'
import { motion } from 'framer-motion'
import { Inbox, Loader2, Mail, RefreshCw, Trash2, User } from 'lucide-react'
import type { ContactMessageRow } from '../../lib/supabase'

interface MessageTableProps {
  messages: ContactMessageRow[]
  loading: boolean
  canDelete: boolean
  onRefresh: () => void
  onDelete: (id: string) => Promise<void>
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function MessageTable({
  messages,
  loading,
  canDelete,
  onRefresh,
  onDelete,
}: MessageTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message permanently?')) return
    setDeletingId(id)
    try {
      await onDelete(id)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="glass-card rounded-xl border border-obs-border overflow-hidden">
      <div className="p-5 border-b border-obs-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Inbox className="w-5 h-5 text-obs-cyan" />
          <h2 className="font-semibold">Quick Messages</h2>
          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-obs-cyan/10 text-obs-cyan border border-obs-cyan/30">
            {messages.length}
          </span>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border border-obs-border hover:border-obs-cyan/50 transition-colors disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {loading && messages.length === 0 ? (
        <div className="p-12 flex justify-center">
          <Loader2 className="w-8 h-8 text-obs-cyan animate-spin" />
        </div>
      ) : messages.length === 0 ? (
        <div className="p-12 text-center text-obs-muted text-sm">No messages yet.</div>
      ) : (
        <div className="divide-y divide-obs-border">
          {messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="p-5 hover:bg-obs-surface/30 transition-colors"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium">
                      <User className="w-3.5 h-3.5 text-obs-cyan" />
                      {msg.name}
                    </span>
                    {msg.email && (
                      <a
                        href={`mailto:${msg.email}`}
                        className="inline-flex items-center gap-1.5 text-xs text-obs-muted hover:text-obs-cyan"
                      >
                        <Mail className="w-3 h-3" />
                        {msg.email}
                      </a>
                    )}
                    <span className="text-xs font-mono text-obs-muted">
                      {formatDate(msg.created_at)}
                    </span>
                  </div>

                  <p
                    className={`text-sm text-obs-muted leading-relaxed ${
                      expandedId === msg.id ? '' : 'line-clamp-2'
                    }`}
                  >
                    {msg.message}
                  </p>

                  {msg.message.length > 120 && (
                    <button
                      onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
                      className="text-xs text-obs-cyan mt-2 hover:underline"
                    >
                      {expandedId === msg.id ? 'Show less' : 'Show more'}
                    </button>
                  )}
                </div>

                {canDelete && (
                  <button
                    onClick={() => handleDelete(msg.id)}
                    disabled={deletingId === msg.id}
                    className="p-2 rounded-lg text-obs-muted hover:text-obs-rose hover:bg-obs-rose/10 transition-colors disabled:opacity-60"
                    aria-label="Delete message"
                  >
                    {deletingId === msg.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
