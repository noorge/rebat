'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getToken } from '@/lib/auth'
import { apiFetch } from '@/lib/utils'
import { useLang } from '@/lib/lang-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'

const SDG_LABELS: Record<number, { en: string; ar: string }> = {
  3:  { en: 'Good Health',             ar: 'الصحة الجيدة'             },
  7:  { en: 'Clean Energy',            ar: 'الطاقة النظيفة'            },
  8:  { en: 'Decent Work',             ar: 'العمل اللائق'              },
  9:  { en: 'Industry & Innovation',   ar: 'الصناعة والابتكار'         },
  10: { en: 'Reduced Inequalities',    ar: 'الحد من التفاوتات'         },
  11: { en: 'Sustainable Cities',      ar: 'المدن المستدامة'           },
  12: { en: 'Responsible Consumption', ar: 'الاستهلاك المسؤول'         },
  13: { en: 'Climate Action',          ar: 'العمل المناخي'             },
  14: { en: 'Life Below Water',        ar: 'الحياة تحت الماء'          },
  17: { en: 'Partnerships',            ar: 'الشراكات'                  },
}

export default function OpportunityDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { t, isRTL } = useLang()
  const [opp, setOpp] = useState<any>(null)
  const [kycStatus, setKycStatus] = useState<string>('PENDING')
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()!
    Promise.all([
      apiFetch(`/marketplace/opportunities/${id}`, { token }),
      apiFetch('/kyc/status', { token }),
    ]).then(([o, k]) => {
      setOpp(o)
      setKycStatus(k.kyc_status)
    }).finally(() => setLoading(false))
  }, [id])

  async function apply() {
    setApplying(true)
    try {
      await apiFetch('/applications', {
        method: 'POST',
        token: getToken()!,
        body: JSON.stringify({ opportunity_id: id }),
      })
      setApplied(true)
      setTimeout(() => router.push('/applications'), 1500)
    } catch (err) {
      console.error(err)
    } finally {
      setApplying(false)
    }
  }

  if (loading) return <div className="p-8 animate-pulse text-slate-400">{t('loading')}</div>
  if (!opp) return <div className="p-8 text-red-500">{t('market_detail_not_found')}</div>

  const canInvest = kycStatus === 'APPROVED'
  const s = opp.score
  const title = isRTL ? opp.title_ar : opp.title_en
  const description = isRTL ? opp.description_ar : opp.description_en
  const riskLabel = opp.risk_level === 'LOW'
    ? t('market_detail_risk_low')
    : opp.risk_level === 'MEDIUM'
      ? t('market_detail_risk_medium')
      : t('market_detail_risk_high')
  const riskVariant = opp.risk_level === 'LOW' ? 'success' : opp.risk_level === 'MEDIUM' ? 'warning' : 'danger'

  return (
    <div className="p-8 space-y-6 max-w-3xl">
      <div className={`flex items-center gap-2 text-sm text-slate-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Link href="/marketplace" className="hover:text-navy">{t('market_detail_breadcrumb')}</Link>
        <span>{isRTL ? '‹' : '›'}</span>
        <span className="text-slate-700">{title}</span>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className={isRTL ? 'text-right' : ''}>
          <div className={`flex gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Badge variant="outline">{opp.sector}</Badge>
            <Badge variant={riskVariant as any}>{riskLabel}</Badge>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="text-slate-400 text-sm mt-0.5">{isRTL ? opp.title_en : opp.title_ar}</p>
        </div>
        {canInvest ? (
          <Button size="lg" onClick={apply} disabled={applying || applied} className="flex-shrink-0">
            {applied ? t('market_detail_applied') : applying ? t('market_detail_applying') : t('market_detail_apply')}
          </Button>
        ) : (
          <div className="text-center flex-shrink-0">
            <Button size="lg" disabled>{t('market_detail_locked')}</Button>
            <div className="text-xs text-slate-400 mt-1">{t('market_detail_kyc_req')}</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { labelKey: 'market_detail_min_inv' as const, value: `${(opp.min_investment / 1e6).toFixed(0)}M SAR` },
          { labelKey: 'market_detail_max_inv' as const, value: `${(opp.max_investment / 1e6).toFixed(0)}M SAR` },
          { labelKey: 'market_detail_roi' as const,     value: `${opp.expected_roi_min}–${opp.expected_roi_max}%` },
        ].map((item) => (
          <Card key={item.labelKey}>
            <CardContent className="pt-5 pb-4">
              <div className={`text-xs text-slate-400 ${isRTL ? 'text-right' : ''}`}>{t(item.labelKey)}</div>
              <div className={`text-xl font-bold text-slate-900 mt-1 ${isRTL ? 'text-right' : ''}`}>{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>{t('market_detail_description')}</CardTitle></CardHeader>
        <CardContent>
          <p className={`text-slate-700 leading-relaxed ${isRTL ? 'text-right' : ''}`}>{description}</p>
        </CardContent>
      </Card>

      {s && (
        <Card>
          <CardHeader><CardTitle>{t('market_detail_score_title')}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-slate-600 font-medium">{t('market_detail_composite')}</span>
              <span className="text-3xl font-bold text-navy">{s.composite}<span className="text-base text-slate-400">/100</span></span>
            </div>
            {[
              { labelKey: 'market_detail_financial' as const, value: s.financial_score, weight: '35%', color: 'emerald' as const },
              { labelKey: 'market_detail_risk_score' as const, value: s.risk_score,     weight: '25%', color: s.risk_score >= 70 ? 'emerald' as const : s.risk_score >= 50 ? 'amber' as const : 'red' as const },
              { labelKey: 'market_detail_vision' as const,     value: s.vision_score,   weight: '25%', color: 'blue' as const },
              { labelKey: 'market_detail_sdg' as const,        value: s.sdg_score,      weight: '15%', color: 'emerald' as const },
            ].map((item) => (
              <div key={item.labelKey}>
                <div className={`flex justify-between text-sm mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-slate-600">{t(item.labelKey)}</span>
                  <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-xs text-slate-400">{t('market_detail_weight')} {item.weight}</span>
                    <span className="font-semibold text-slate-800">{item.value}</span>
                  </div>
                </div>
                <Progress value={item.value} color={item.color} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4">
        {opp.vision_2030_pillars?.length > 0 && (
          <Card>
            <CardHeader><CardTitle>{t('market_detail_vision_pillars')}</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {opp.vision_2030_pillars.map((p: string) => (
                  <Badge key={p} variant="info">{p.replace(/_/g, ' ')}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {opp.sdg_goals?.length > 0 && (
          <Card>
            <CardHeader><CardTitle>{t('market_detail_sdg_goals')}</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {opp.sdg_goals.map((g: number) => {
                  const label = SDG_LABELS[g]
                  return (
                    <Badge key={g} variant="success">
                      SDG {g}: {label ? (isRTL ? label.ar : label.en) : `Goal ${g}`}
                    </Badge>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {opp.incentives && (
        <Card className="border-navy/10 bg-navy-light">
          <CardHeader><CardTitle className="text-navy">{t('market_detail_incentives')}</CardTitle></CardHeader>
          <CardContent>
            <p className={`text-navy text-sm ${isRTL ? 'text-right' : ''}`}>{opp.incentives}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
