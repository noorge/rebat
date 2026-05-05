'use client'

import { useEffect, useState } from 'react'
import { getToken } from '@/lib/auth'
import { apiFetch } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck } from 'lucide-react'

const ACTION_COLORS: Record<string, 'success' | 'info' | 'warning' | 'danger' | 'default'> = {
  UPLOADED: 'info',
  VIEWED: 'default',
  KYC_SUBMITTED_TO_ABSHER: 'warning',
  ABSHER_APPROVED: 'success',
  ABSHER_REJECTED: 'danger',
  CREATED: 'info',
}

export default function AuditLogsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch('/admin/audit-logs?limit=100', { token: getToken()! })
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Audit Logs</h1>
        <p className="text-slate-500 mt-1">Complete audit trail for regulatory compliance</p>
      </div>

      <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-500">
        <ShieldCheck size={16} className="text-slate-400 flex-shrink-0" />
        All document accesses, status changes, and submissions are permanently logged and cannot be modified.
      </div>

      {loading ? (
        <div className="animate-pulse text-slate-400">Loading logs…</div>
      ) : (
        <Card>
          <CardContent className="pt-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Action', 'Entity', 'User', 'IP', 'Timestamp'].map((h) => (
                    <th key={h} className="text-left py-4 px-4 text-xs font-medium text-slate-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.data?.map((log: any) => (
                  <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50 transition-all">
                    <td className="py-3 px-4">
                      <Badge variant={ACTION_COLORS[log.action] || 'default'}>
                        {log.action.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      <span className="text-xs">{log.entity_type}</span>
                      <br />
                      <span className="font-mono text-xs text-slate-400">{log.entity_id.slice(0, 8)}…</span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{log.user?.email || '—'}</td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-400">{log.ip_address || '—'}</td>
                    <td className="py-3 px-4 text-slate-400 text-xs">{new Date(log.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
