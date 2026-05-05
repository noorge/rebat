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

const SDG_META: Record<number, { en: string; ar: string; color: string }> = {
  1:  { en: 'No Poverty',              ar: 'القضاء على الفقر',    color: '#E5243B' },
  2:  { en: 'Zero Hunger',             ar: 'القضاء على الجوع',    color: '#DDA63A' },
  3:  { en: 'Good Health',             ar: 'الصحة الجيدة',        color: '#4C9F38' },
  7:  { en: 'Clean Energy',            ar: 'الطاقة النظيفة',      color: '#FCC30B' },
  8:  { en: 'Decent Work',             ar: 'العمل اللائق',        color: '#A21942' },
  9:  { en: 'Industry & Innovation',   ar: 'الصناعة والابتكار',   color: '#FD6925' },
  10: { en: 'Reduced Inequalities',    ar: 'الحد من التفاوتات',   color: '#DD1367' },
  11: { en: 'Sustainable Cities',      ar: 'المدن المستدامة',     color: '#FD9D24' },
  12: { en: 'Responsible Consumption', ar: 'الاستهلاك المسؤول',   color: '#BF8B2E' },
  13: { en: 'Climate Action',          ar: 'العمل المناخي',       color: '#3F7E44' },
  14: { en: 'Life Below Water',        ar: 'الحياة تحت الماء',    color: '#0A97D9' },
  17: { en: 'Partnerships',            ar: 'الشراكات',            color: '#19486A' },
}

const VISION_META: Record<string, { en: string; ar: string }> = {
  DIGITAL_ECONOMY:              { en: 'Digital Economy',             ar: 'الاقتصاد الرقمي'    },
  URBAN_DEVELOPMENT:            { en: 'Urban Development',           ar: 'التطوير العمراني'    },
  CLEAN_ENERGY:                 { en: 'Clean Energy',                ar: 'الطاقة النظيفة'      },
  TOURISM:                      { en: 'Tourism',                     ar: 'السياحة'             },
  ENVIRONMENTAL_SUSTAINABILITY: { en: 'Environmental Sustainability', ar: 'الاستدامة البيئية'  },
  INDUSTRIAL_DEVELOPMENT:       { en: 'Industrial Development',      ar: 'التطوير الصناعي'     },
  FOOD_SECURITY:                { en: 'Food Security',               ar: 'الأمن الغذائي'       },
  CULTURAL_HERITAGE:            { en: 'Cultural Heritage',           ar: 'التراث الثقافي'      },
  REGIONAL_DEVELOPMENT:         { en: 'Regional Development',        ar: 'التطوير الإقليمي'    },
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
  const riskLabel = opp.risk_level === 'LOW' ? t('market_detail_risk_low') : opp.risk_level === 'MEDIUM' ? t('market_detail_risk_medium') : t('market_detail_risk_high')
  const riskVariant = opp.risk_level === 'LOW' ? 'success' : opp.risk_level === 'MEDIUM' ? 'warning' : 'danger'

  const sidebar = (
    <div className="space-y-5 sticky top-8">

      {/* SDG Goals */}
      {opp.sdg_goals?.length > 0 && (
        <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
          <div className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-white text-center"
            style={{ background: 'linear-gradient(90deg, #0A97D9, #4C9F38)' }}>
            {isRTL ? 'أهداف التنمية المستدامة' : 'UN SDG Goals'}
          </div>
          <div className="p-3 bg-white space-y-2">
            {opp.sdg_goals.map((g: number) => {
              const meta = SDG_META[g]
              if (!meta) return null
              return (
                <div key={g} className="flex items-center gap-3 rounded-xl p-2.5"
                  style={{ background: meta.color + '12', border: `1px solid ${meta.color}30` }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-white text-sm flex-shrink-0"
                    style={{ background: meta.color }}>
                    {g}
                  </div>
                  <div>
                    <div className="text-[9px] font-bold uppercase tracking-wider" style={{ color: meta.color }}>SDG {g}</div>
                    <div className="text-xs font-semibold text-slate-800 leading-tight">{isRTL ? meta.ar : meta.en}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Vision 2030 */}
      {opp.vision_2030_pillars?.length > 0 && (
        <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
          <div className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-white text-center"
            style={{ background: 'linear-gradient(90deg, #004AAD, #006C35)' }}>
            {isRTL ? 'رؤية 2030' : 'Vision 2030'}
          </div>
          <div className="p-3 bg-white space-y-2">
            <div className="text-[10px] text-slate-400 text-center mb-2">
              {isRTL ? 'المملكة العربية السعودية' : 'Kingdom of Saudi Arabia'}
            </div>
            {opp.vision_2030_pillars.map((p: string) => {
              const meta = VISION_META[p]
              return (
                <div key={p} className="flex items-center gap-2 px-3 py-2 rounded-xl"
                  style={{ background: '#004AAD0D', border: '1px solid #004AAD20' }}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#006C35' }} />
                  <span className="text-xs font-medium" style={{ color: '#004AAD' }}>
                    {meta ? (isRTL ? meta.ar : meta.en) : p.replace(/_/g, ' ')}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

    </div>
  )

  return (
    <div className="p-8" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Breadcrumb */}
      <div className={`flex items-center gap-2 text-sm text-slate-500 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Link href="/marketplace" className="hover:text-navy">{t('market_detail_breadcrumb')}</Link>
        <span>{isRTL ? '‹' : '›'}</span>
        <span className="text-slate-700">{title}</span>
      </div>

      {/* Two-column layout */}
      <div className={`flex gap-8 items-start ${isRTL ? 'flex-row-reverse' : ''}`}>

        {/* LEFT — main content */}
        <div className="flex-1 min-w-0 space-y-6">

          {/* Title + badges + apply */}
          <div className={`flex items-start justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={isRTL ? 'text-right' : ''}>
              <div className={`flex gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Badge variant="outline">{opp.sector}</Badge>
                <Badge variant={riskVariant as any}>{riskLabel}</Badge>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
              <p className="text-slate-400 text-sm mt-0.5">{isRTL ? opp.title_en : opp.title_ar}</p>
            </div>
            <div className="flex-shrink-0">
              {canInvest ? (
                <Button size="lg" onClick={apply} disabled={applying || applied}>
                  {applied ? t('market_detail_applied') : applying ? t('market_detail_applying') : t('market_detail_apply')}
                </Button>
              ) : (
                <div className="text-center">
                  <Button size="lg" disabled>{t('market_detail_locked')}</Button>
                  <p className="text-xs text-slate-400 mt-1">{t('market_detail_kyc_req')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { labelKey: 'market_detail_min_inv' as const, value: `${(opp.min_investment / 1e6).toFixed(0)}M SAR` },
              { labelKey: 'market_detail_max_inv' as const, value: `${(opp.max_investment / 1e6).toFixed(0)}M SAR` },
              { labelKey: 'market_detail_roi'     as const, value: `${opp.expected_roi_min}–${opp.expected_roi_max}%` },
            ].map((item) => (
              <Card key={item.labelKey}>
                <CardContent className="pt-5 pb-4">
                  <div className={`text-xs text-slate-400 ${isRTL ? 'text-right' : ''}`}>{t(item.labelKey)}</div>
                  <div className={`text-xl font-bold text-slate-900 mt-1 ${isRTL ? 'text-right' : ''}`}>{item.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Description */}
          <Card>
            <CardHeader><CardTitle>{t('market_detail_description')}</CardTitle></CardHeader>
            <CardContent>
              <p className={`text-slate-700 leading-relaxed ${isRTL ? 'text-right' : ''}`}>{description}</p>
            </CardContent>
          </Card>

          {/* Score breakdown */}
          {s && (
            <Card>
              <CardHeader><CardTitle>{t('market_detail_score_title')}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-slate-600 font-medium">{t('market_detail_composite')}</span>
                  <span className="text-3xl font-bold text-navy">{s.composite}<span className="text-base text-slate-400">/100</span></span>
                </div>
                {[
                  { labelKey: 'market_detail_financial'   as const, value: s.financial_score, weight: '35%', color: 'emerald' as const },
                  { labelKey: 'market_detail_risk_score'  as const, value: s.risk_score,       weight: '25%', color: s.risk_score >= 70 ? 'emerald' as const : s.risk_score >= 50 ? 'amber' as const : 'red' as const },
                  { labelKey: 'market_detail_vision'      as const, value: s.vision_score,     weight: '25%', color: 'blue' as const },
                  { labelKey: 'market_detail_sdg'         as const, value: s.sdg_score,        weight: '15%', color: 'emerald' as const },
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

          {/* Incentives */}
          {opp.incentives && (
            <Card className="border-navy/10 bg-navy-light">
              <CardHeader><CardTitle className="text-navy">{t('market_detail_incentives')}</CardTitle></CardHeader>
              <CardContent>
                <p className={`text-navy text-sm ${isRTL ? 'text-right' : ''}`}>{opp.incentives}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* RIGHT — sticky sidebar */}
        <div className="w-72 flex-shrink-0">
          {sidebar}
        </div>

      </div>
    </div>
  )
}
