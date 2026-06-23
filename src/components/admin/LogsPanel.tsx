import { useState } from 'react'
import { Loader2, RefreshCw, ScrollText, Users } from 'lucide-react'
import type { AdminActionLog, VisitorLog } from '../../lib/logs'

interface LogsPanelProps {
  visitorLogs: VisitorLog[]
  actionLogs: AdminActionLog[]
  loading: boolean
  onRefresh: () => void
}

type Tab = 'visitors' | 'actions'

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function parseUserAgent(ua: string | null) {
  if (!ua) return 'Unknown'
  if (ua.includes('Chrome')) return 'Chrome'
  if (ua.includes('Firefox')) return 'Firefox'
  if (ua.includes('Safari')) return 'Safari'
  if (ua.includes('Edge')) return 'Edge'
  return ua.slice(0, 40) + (ua.length > 40 ? '…' : '')
}

export function LogsPanel({ visitorLogs, actionLogs, loading, onRefresh }: LogsPanelProps) {
  const [tab, setTab] = useState<Tab>('visitors')

  return (
    <div className="glass-card rounded-xl border border-obs-border overflow-hidden">
      <div className="p-5 border-b border-obs-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ScrollText className="w-5 h-5 text-obs-amber" />
          <h2 className="font-semibold">Activity Logs</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-obs-border overflow-hidden text-xs">
            <button
              type="button"
              onClick={() => setTab('visitors')}
              className={`px-3 py-1.5 ${tab === 'visitors' ? 'bg-obs-cyan/15 text-obs-cyan' : 'text-obs-muted hover:bg-obs-surface'}`}
            >
              Visitors ({visitorLogs.length})
            </button>
            <button
              type="button"
              onClick={() => setTab('actions')}
              className={`px-3 py-1.5 ${tab === 'actions' ? 'bg-obs-amber/15 text-obs-amber' : 'text-obs-muted hover:bg-obs-surface'}`}
            >
              Admin ({actionLogs.length})
            </button>
          </div>
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border border-obs-border hover:border-obs-cyan/50 disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 flex justify-center">
          <Loader2 className="w-8 h-8 text-obs-amber animate-spin" />
        </div>
      ) : tab === 'visitors' ? (
        <div className="overflow-x-auto">
          {visitorLogs.length === 0 ? (
            <p className="p-8 text-center text-sm text-obs-muted">No visitor logs yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-obs-border text-obs-muted text-left">
                  <th className="p-3 font-medium">Visited</th>
                  <th className="p-3 font-medium">Session</th>
                  <th className="p-3 font-medium">Page</th>
                  <th className="p-3 font-medium">Browser</th>
                  <th className="p-3 font-medium">Language</th>
                  <th className="p-3 font-medium">Timezone</th>
                  <th className="p-3 font-medium">Return</th>
                </tr>
              </thead>
              <tbody>
                {visitorLogs.map((log) => (
                  <tr key={log.id} className="border-b border-obs-border/50 hover:bg-obs-surface/30">
                    <td className="p-3 font-mono text-xs whitespace-nowrap">{formatDate(log.visited_at)}</td>
                    <td className="p-3 font-mono text-xs text-obs-muted" title={log.session_id}>
                      {log.session_id.slice(0, 8)}…
                    </td>
                    <td className="p-3 text-xs text-obs-muted max-w-[120px] truncate" title={log.page_path ?? ''}>
                      {log.page_path || '—'}
                    </td>
                    <td className="p-3 text-xs">{parseUserAgent(log.user_agent)}</td>
                    <td className="p-3 text-xs">{log.language || '—'}</td>
                    <td className="p-3 text-xs">{log.timezone || '—'}</td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          log.is_return_visitor
                            ? 'bg-obs-teal/10 text-obs-teal'
                            : 'bg-obs-purple/10 text-obs-purple'
                        }`}
                      >
                        {log.is_return_visitor ? 'return' : 'new'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          {actionLogs.length === 0 ? (
            <p className="p-8 text-center text-sm text-obs-muted">No admin action logs yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-obs-border text-obs-muted text-left">
                  <th className="p-3 font-medium">Time</th>
                  <th className="p-3 font-medium">Admin</th>
                  <th className="p-3 font-medium">Action</th>
                  <th className="p-3 font-medium">Details</th>
                </tr>
              </thead>
              <tbody>
                {actionLogs.map((log) => (
                  <tr key={log.id} className="border-b border-obs-border/50 hover:bg-obs-surface/30">
                    <td className="p-3 font-mono text-xs whitespace-nowrap">{formatDate(log.created_at)}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3 h-3 text-obs-muted" />
                        <span className="text-xs">{log.admin_name || log.admin_email || '—'}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-obs-amber/10 text-obs-amber border border-obs-amber/30">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-obs-muted max-w-xs truncate" title={JSON.stringify(log.details)}>
                      {Object.keys(log.details || {}).length > 0
                        ? JSON.stringify(log.details)
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
