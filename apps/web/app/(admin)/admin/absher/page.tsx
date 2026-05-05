'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { getToken } from '@/lib/auth'
import { apiFetch } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Info, CheckCircle2 } from 'lucide-react'

function AbsherContent() {
  const searchParams = useSearchParams()
  const preSelected = searchParams.get('investor')
  const [investors, setInvestors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [results, setResults] = useState<Record<string, string>>({})

  useEffect(() => {
    apiFetch('/admin/investors?limit=50', { token: getToken()! })
      .then((d) => setInvestors(d.data.filter((i: any) => i.kyc_status === 'SUBMITTED_TO_ABSHER')))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  async function simulate(investorId: string, status: 'approved' | 'rejected') {
    setProcessing(investorId)
    try {
      const res = await apiFetch(`/admin/absher/simulate/${investorId}`, {
        method: 'POST',
        token: getToken()!,
        body: JSON.stringify({ status }),
      })
      setResults((r) => ({ ...r, [investorId]: res.message }))
      setInvestors((prev) => prev.filter((i) => i.id !== investorId))
    } catch (err: unknown) {
      setResults((r) => ({ ...r, [investorId]: err instanceof Error ? err.message : 'Failed' }))
    } finally {
      setProcessing(null)
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Absher KYC Simulator</h1>
        <p className="text-slate-500 mt-1">
          In production, Absher processes these automatically. This simulator demonstrates the approval flow.
        </p>
      </div>

      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-5 pb-4">
          <div className="flex items-start gap-3">
            <Info size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-700">
              <strong>Demo Mode:</strong> This panel simulates Absher's webhook response.
              In production, Absher would automatically call <code className="font-mono bg-amber-100 px-1 rounded">POST /api/absher/webhook</code> with approval decisions.
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="animate-pulse text-slate-400">Loading pending applications…</div>
      ) : investors.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <CheckCircle2 size={36} className="mx-auto mb-3 text-emerald-400" />
            <div className="text-slate-700 font-medium">No pending KYC applications</div>
            <div className="text-slate-400 text-sm mt-1">All applications have been processed</div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {investors.map((inv) => (
            <Card key={inv.id} className={preSelected === inv.id ? 'border-emerald-300 ring-2 ring-emerald-200' : ''}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-800">{inv.full_name}</span>
                      <Badge variant="outline">{inv.nationality}</Badge>
                      {inv.company_name && <Badge variant="outline">{inv.company_name}</Badge>}
                    </div>
                    <div className="text-sm text-slate-500">{inv.user.email}</div>
                    {inv.absher_ref && (
                      <div className="font-mono text-xs text-emerald-600 mt-1">Ref: {inv.absher_ref}</div>
                    )}
                  </div>

                  {results[inv.id] ? (
                    <div className="text-sm text-emerald-600 font-medium">{results[inv.id]}</div>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => simulate(inv.id, 'rejected')}
                        disabled={processing === inv.id}
                      >
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => simulate(inv.id, 'approved')}
                        disabled={processing === inv.id}
                      >
                        {processing === inv.id ? 'Processing…' : 'Approve'}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AbsherPage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-400 animate-pulse">Loading…</div>}>
      <AbsherContent />
    </Suspense>
  )
}
