'use client'

import { useEffect, useState } from 'react'
import { getToken } from '@/lib/auth'
import { apiFetch } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Users, RefreshCw, CheckCircle } from 'lucide-react'

export default function AdminDashboard() {
  const [investors, setInvestors] = useState<any>(null)
  const [logs, setLogs] = useState<any[]>([])

  useEffect(() => {
    const token = getToken()!
    Promise.all([
      apiFetch('/admin/investors?limit=5', { token }),
      apiFetch('/admin/audit-logs?limit=8', { token }),
    ]).then(([i, l]) => {
      setInvestors(i)
      setLogs(l.data)
    }).catch(console.error)
  }, [])

  const KYC_COLORS = {
    PENDING: 'warning', SUBMITTED_TO_ABSHER: 'info', APPROVED: 'success', REJECTED: 'danger',
  } as const

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Overview</h1>
        <p className="text-slate-500 mt-1">Rebat Government Management Panel</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Investors',  value: investors?.total || 0,                                                                                    icon: Users        },
          { label: 'Pending KYC',      value: investors?.data?.filter((i: any) => i.kyc_status === 'SUBMITTED_TO_ABSHER').length || 0,                  icon: RefreshCw    },
          { label: 'Approved',         value: investors?.data?.filter((i: any) => i.kyc_status === 'APPROVED').length || 0,                             icon: CheckCircle  },
        ].map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label}>
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  <Icon size={18} className="text-slate-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{s.value}</div>
                  <div className="text-sm text-slate-500">{s.label}</div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Investors</CardTitle>
              <Link href="/admin/investors" className="text-sm text-emerald-600 hover:underline">View all</Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {investors?.data?.map((inv: any) => (
                <div key={inv.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50">
                  <div>
                    <div className="font-medium text-sm text-slate-800">{inv.full_name}</div>
                    <div className="text-xs text-slate-400">{inv.user.email}</div>
                  </div>
                  <Badge variant={KYC_COLORS[inv.kyc_status as keyof typeof KYC_COLORS]}>
                    {inv.kyc_status.replace(/_/g, ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Audit Logs</CardTitle>
              <Link href="/admin/audit-logs" className="text-sm text-emerald-600 hover:underline">View all</Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-slate-700">{log.action.replace(/_/g, ' ')}</div>
                    <div className="text-xs text-slate-400">
                      {log.user?.email || 'System'} · {new Date(log.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <RefreshCw size={18} className="text-amber-600" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-amber-800">Absher Simulator</div>
              <div className="text-amber-600 text-sm">Approve or reject investor KYC applications for demo purposes</div>
            </div>
            <Link href="/admin/absher">
              <span className="text-amber-700 font-medium text-sm border border-amber-300 rounded-xl px-4 py-2 hover:bg-amber-100 transition-all">
                Open Simulator
              </span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
