'use client'

import { useEffect, useState } from 'react'
import { getToken } from '@/lib/auth'
import { apiFetch } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const KYC_COLORS = {
  PENDING: 'warning', SUBMITTED_TO_ABSHER: 'info', APPROVED: 'success', REJECTED: 'danger',
} as const

export default function InvestorsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch('/admin/investors?limit=50', { token: getToken()! })
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Investors</h1>
          <p className="text-slate-500 mt-1">All registered foreign investors</p>
        </div>
        {data && <div className="text-sm text-slate-500">Total: <strong>{data.total}</strong></div>}
      </div>

      {loading ? (
        <div className="animate-pulse text-slate-400">Loading investors…</div>
      ) : (
        <Card>
          <CardContent className="pt-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Name', 'Email', 'Nationality', 'Company', 'KYC Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left py-4 px-4 text-xs font-medium text-slate-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.data?.map((inv: any) => (
                  <tr key={inv.id} className="border-b border-slate-50 hover:bg-slate-50 transition-all">
                    <td className="py-4 px-4 font-medium text-slate-800">{inv.full_name}</td>
                    <td className="py-4 px-4 text-slate-500">{inv.user.email}</td>
                    <td className="py-4 px-4 text-slate-500">{inv.nationality}</td>
                    <td className="py-4 px-4 text-slate-400">{inv.company_name || '—'}</td>
                    <td className="py-4 px-4">
                      <Badge variant={KYC_COLORS[inv.kyc_status as keyof typeof KYC_COLORS]}>
                        {inv.kyc_status.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      {inv.kyc_status === 'SUBMITTED_TO_ABSHER' && (
                        <Link href={`/admin/absher?investor=${inv.id}`}>
                          <Button size="sm" variant="secondary">Review</Button>
                        </Link>
                      )}
                    </td>
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
