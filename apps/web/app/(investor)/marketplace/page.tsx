'use client'

import { useEffect, useState } from 'react'
import { getToken } from '@/lib/auth'
import { apiFetch } from '@/lib/utils'
import { useLang } from '@/lib/lang-context'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { Lock } from 'lucide-react'

const RISK_CONFIG = {
  LOW:    { variant: 'success', color: 'emerald' },
  MEDIUM: { variant: 'warning', color: 'amber'   },
  HIGH:   { variant: 'danger',  color: 'red'      },
} as const

export default function MarketplacePage() {
  const { t, isRTL } = useLang()
  const [opps, setOpps] = useState<any[]>([])
  const [sectors, setSectors] = useState<string[]>([])
  const [filter, setFilter] = useState({ sector: '', risk: '' })
  const [kycStatus, setKycStatus] = useState<string>('PENDING')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()!
    Promise.all([
      apiFetch('/marketplace/opportunities', { token }),
      apiFetch('/marketplace/sectors', { token }),
      apiFetch('/kyc/status', { token }),
    ]).then(([o, s, k]) => {
      setOpps(o)
      setSectors(s)
      setKycStatus(k.kyc_status)
    }).finally(() => setLoading(false))
  }, [])

  const filtered = opps.filter((o) =>
    (!filter.sector || o.sector === filter.sector) &&
    (!filter.risk || o.risk_level === filter.risk)
  )

  const canInvest = kycStatus === 'APPROVED'

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('market_title')}</h1>
          <p className="text-slate-500 mt-1">{t('market_subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <select value={filter.sector} onChange={(e) => setFilter({ ...filter, sector: e.target.value })}
            className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand">
            <option value="">{t('market_all_sectors')}</option>
            {sectors.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filter.risk} onChange={(e) => setFilter({ ...filter, risk: e.target.value })}
            className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand">
            <option value="">{t('market_all_risk')}</option>
            <option value="LOW">{t('market_low_risk')}</option>
            <option value="MEDIUM">{t('market_medium_risk')}</option>
            <option value="HIGH">{t('market_high_risk')}</option>
          </select>
        </div>
      </div>

      {!canInvest && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Lock size={16} className="text-amber-600" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-amber-800 text-sm">{t('market_kyc_required')}</div>
            <div className="text-amber-600 text-xs">{t('market_kyc_desc')}</div>
          </div>
          <Link href="/kyc"><Button size="sm" variant="outline">{t('market_verify')}</Button></Link>
        </div>
      )}

      {loading ? (
        <div className="text-slate-500 animate-pulse">{t('market_loading')}</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((opp) => {
            const risk = RISK_CONFIG[opp.risk_level as keyof typeof RISK_CONFIG]
            const title = isRTL ? opp.title_ar : opp.title_en
            const description = isRTL ? opp.description_ar : opp.description_en
            return (
              <Card key={opp.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{opp.sector}</Badge>
                        <Badge variant={risk.variant as any}>
                          {opp.risk_level === 'LOW' ? t('market_low_risk') : opp.risk_level === 'MEDIUM' ? t('market_medium_risk') : t('market_high_risk')}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                      <p className="text-slate-500 text-sm mt-1 line-clamp-2">{description}</p>

                      <div className="flex items-center gap-6 mt-4 flex-wrap">
                        <div>
                          <div className="text-xs text-slate-400">{t('market_investment_range')}</div>
                          <div className="font-semibold text-slate-800 text-sm">
                            {(opp.min_investment / 1e6).toFixed(0)}M – {(opp.max_investment / 1e6).toFixed(0)}M SAR
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-400">{t('market_roi')}</div>
                          <div className="font-semibold text-navy text-sm">
                            {opp.expected_roi_min}% – {opp.expected_roi_max}%
                          </div>
                        </div>
                        {opp.score && (
                          <div>
                            <div className="text-xs text-slate-400">{t('market_score')}</div>
                            <div className="font-bold text-slate-900 text-sm">
                              {opp.score.composite}<span className="text-xs text-slate-400">/100</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {opp.sdg_goals?.length > 0 && (
                        <div className="flex items-center gap-2 mt-3 flex-wrap">
                          <span className="text-xs text-slate-400 font-medium">{t('market_sdg')}</span>
                          {opp.sdg_goals.map((g: number) => {
                            const colors: Record<number, string> = { 1:'#E5243B',2:'#DDA63A',3:'#4C9F38',7:'#FCC30B',8:'#A21942',9:'#FD6925',10:'#DD1367',11:'#FD9D24',12:'#BF8B2E',13:'#3F7E44',14:'#0A97D9',17:'#19486A' }
                            const c = colors[g] || '#64748b'
                            return (
                              <span key={g}
                                className="text-xs font-bold px-2 py-0.5 rounded-lg text-white"
                                style={{ background: c }}
                              >
                                {g}
                              </span>
                            )
                          })}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-3 min-w-[140px]">
                      {opp.score && (
                        <div className="w-full">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-400">{t('market_score')}</span>
                            <span className="font-medium">{opp.score.composite}%</span>
                          </div>
                          <Progress value={opp.score.composite}
                            color={opp.score.composite >= 70 ? 'emerald' : opp.score.composite >= 50 ? 'amber' : 'red'} />
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Link href={`/marketplace/${opp.id}`}>
                          <Button size="sm" variant="secondary">{t('btn_details')}</Button>
                        </Link>
                        {canInvest ? (
                          <Link href={`/marketplace/${opp.id}`}>
                            <Button size="sm">{t('btn_apply')}</Button>
                          </Link>
                        ) : (
                          <Button size="sm" disabled>
                            <Lock size={12} className="mr-1" />{t('btn_apply')}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
