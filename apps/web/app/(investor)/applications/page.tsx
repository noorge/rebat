'use client'

import { useEffect, useState } from 'react'
import { getToken } from '@/lib/auth'
import { apiFetch } from '@/lib/utils'
import { useLang } from '@/lib/lang-context'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ClipboardList, ArrowRight, Calendar, Hash, TrendingUp } from 'lucide-react'

const STATUS_CONFIG = {
  DRAFT:        { variant: 'outline',  bar: 'bg-slate-300'  },
  SUBMITTED:    { variant: 'info',     bar: 'bg-blue-400'   },
  UNDER_REVIEW: { variant: 'warning',  bar: 'bg-amber-400'  },
  APPROVED:     { variant: 'success',  bar: 'bg-navy'       },
  REJECTED:     { variant: 'danger',   bar: 'bg-red-500'    },
} as const

export default function ApplicationsPage() {
  const { t, isRTL } = useLang()
  const [apps, setApps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch('/applications', { token: getToken()! })
      .then(setApps)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const counts = {
    total:       apps.length,
    approved:    apps.filter((a) => a.status === 'APPROVED').length,
    under_review: apps.filter((a) => a.status === 'UNDER_REVIEW').length,
    submitted:   apps.filter((a) => a.status === 'SUBMITTED').length,
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t('apps_title')}</h1>
        <p className="text-slate-500 mt-1">{t('apps_subtitle')}</p>
      </div>

      {!loading && apps.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: isRTL ? 'إجمالي الطلبات' : 'Total', value: counts.total, color: 'text-slate-700' },
            { label: isRTL ? 'مقبولة' : 'Approved',      value: counts.approved,     color: 'text-navy' },
            { label: isRTL ? 'قيد المراجعة' : 'Under Review', value: counts.under_review, color: 'text-amber-600' },
            { label: isRTL ? 'مُرسلة' : 'Submitted',     value: counts.submitted,    color: 'text-blue-600' },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="pt-5 pb-4">
                <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {loading ? (
        <div className="animate-pulse text-slate-400">{t('apps_loading')}</div>
      ) : apps.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-16">
            <ClipboardList size={40} className="mx-auto mb-4 text-slate-300" />
            <div className="text-slate-700 font-medium">{t('apps_empty')}</div>
            <div className="text-slate-400 text-sm mt-1">{t('apps_empty_desc')}</div>
            <Link href="/marketplace" className="inline-block mt-4">
              <span className="text-navy font-medium text-sm">{t('apps_go_market')}</span>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {apps.map((app) => {
            const cfg = STATUS_CONFIG[app.status as keyof typeof STATUS_CONFIG]
            const title = isRTL ? app.opportunity?.title_ar : app.opportunity?.title_en
            const locale = isRTL ? 'ar-SA' : 'en-US'
            return (
              <Link key={app.id} href={`/applications/${app.id}`}>
                <Card className="hover:shadow-md transition-all cursor-pointer group overflow-hidden">
                  <div className={`h-1 w-full ${cfg.bar}`} />
                  <CardContent className="pt-5 pb-5">
                    <div className={`flex items-start justify-between gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>

                      <div className="flex-1 min-w-0">
                        <div className={`flex items-center gap-2 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Badge variant={cfg.variant as any}>{app.status.replace(/_/g, ' ')}</Badge>
                          {app.opportunity?.sector && (
                            <Badge variant="outline">{app.opportunity.sector}</Badge>
                          )}
                        </div>
                        <div className={`font-semibold text-slate-900 text-base mt-2 ${isRTL ? 'text-right' : ''}`}>
                          {title || t('app_general')}
                        </div>
                        {app.opportunity && (
                          <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                            {isRTL ? app.opportunity.title_en : app.opportunity.title_ar}
                          </div>
                        )}

                        <div className={`flex items-center gap-5 mt-4 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                          {app.opportunity?.expected_roi_min && (
                            <div className={`flex items-center gap-1.5 text-xs text-slate-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <TrendingUp size={12} className="text-navy" />
                              <span>{app.opportunity.expected_roi_min}–{app.opportunity.expected_roi_max}% ROI</span>
                            </div>
                          )}
                          {app.absher_ref && (
                            <div className={`flex items-center gap-1.5 text-xs text-slate-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <Hash size={12} />
                              <span className="font-mono">{app.absher_ref}</span>
                            </div>
                          )}
                          <div className={`flex items-center gap-1.5 text-xs text-slate-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Calendar size={12} />
                            <span>{new Date(app.submitted_at || app.created_at).toLocaleDateString(locale)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex-shrink-0 flex items-center self-center">
                        <ArrowRight size={18} className="text-slate-300 group-hover:text-navy transition-colors"
                          style={isRTL ? { transform: 'rotate(180deg)' } : {}} />
                      </div>

                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
