'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getToken } from '@/lib/auth'
import { apiFetch } from '@/lib/utils'
import { useLang } from '@/lib/lang-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Check } from 'lucide-react'

const STATUS_CONFIG = {
  DRAFT:        { variant: 'outline',  descKey: 'app_status_draft'        },
  SUBMITTED:    { variant: 'info',     descKey: 'app_status_submitted'     },
  UNDER_REVIEW: { variant: 'warning',  descKey: 'app_status_under_review'  },
  APPROVED:     { variant: 'success',  descKey: 'app_status_approved'      },
  REJECTED:     { variant: 'danger',   descKey: 'app_status_rejected'      },
} as const

const STATUS_COLOR = {
  DRAFT:        'bg-slate-200',
  SUBMITTED:    'bg-blue-400',
  UNDER_REVIEW: 'bg-amber-400',
  APPROVED:     'bg-navy',
  REJECTED:     'bg-red-500',
} as const

export default function ApplicationDetailPage() {
  const { id } = useParams()
  const { t, isRTL } = useLang()
  const [app, setApp] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch(`/applications/${id}/timeline`, { token: getToken()! })
      .then(setApp)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="p-8 animate-pulse text-slate-400">{t('loading')}</div>
  if (!app) return <div className="p-8 text-red-500">{t('app_not_found')}</div>

  const cfg = STATUS_CONFIG[app.status as keyof typeof STATUS_CONFIG]
  const title = isRTL ? app.opportunity?.title_ar : app.opportunity?.title_en
  const locale = isRTL ? 'ar-SA' : 'en-US'

  return (
    <div className="p-8 space-y-6 max-w-2xl">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/applications" className="hover:text-navy">{t('app_breadcrumb')}</Link>
        <span>{isRTL ? '‹' : '›'}</span>
        <span className="font-mono text-xs">{app.id.slice(0, 8)}…</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">
          {title || t('app_general')}
        </h1>
        <Badge variant={cfg.variant as any} className="text-sm px-3 py-1">{app.status}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { labelKey: 'app_id_label'        as const, value: app.id.slice(0, 12) + '…' },
          { labelKey: 'app_absher_ref_label' as const, value: app.absher_ref || 'N/A' },
          { labelKey: 'app_submitted_label'  as const, value: app.submitted_at ? new Date(app.submitted_at).toLocaleDateString(locale) : '—' },
          { labelKey: 'app_resolved_label'   as const, value: app.resolved_at  ? new Date(app.resolved_at).toLocaleDateString(locale)  : t('app_pending') },
        ].map((item) => (
          <Card key={item.labelKey}>
            <CardContent className="pt-4 pb-3">
              <div className="text-xs text-slate-400">{t(item.labelKey)}</div>
              <div className="font-mono text-sm font-medium text-slate-800 mt-0.5">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>{t('app_timeline_title')}</CardTitle></CardHeader>
        <CardContent>
          <div className="relative">
            <div className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-0 bottom-0 w-0.5 bg-slate-100`} />
            <div className="space-y-6">
              {app.status_history.map((event: any, i: number) => {
                const eCfg = STATUS_CONFIG[event.status as keyof typeof STATUS_CONFIG]
                const dotColor = STATUS_COLOR[event.status as keyof typeof STATUS_COLOR] || 'bg-slate-200'
                return (
                  <div key={event.id} className={`flex items-start gap-4 relative ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${dotColor} ${i === 0 ? 'ring-4 ring-white' : ''}`}>
                      {event.status === 'APPROVED' ? (
                        <Check size={14} className="text-white" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-white/80" />
                      )}
                    </div>
                    <div className="flex-1 pb-2">
                      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Badge variant={eCfg.variant as any}>{event.status}</Badge>
                        <span className="text-xs text-slate-400">{new Date(event.created_at).toLocaleString(locale)}</span>
                      </div>
                      {event.note && <div className={`text-sm text-slate-600 mt-1 ${isRTL ? 'text-right' : ''}`}>{event.note}</div>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {app.opportunity && (
        <Card>
          <CardHeader><CardTitle>{t('app_opportunity_title')}</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">{t('app_sector_label')}</span>
              <Badge variant="outline">{app.opportunity.sector}</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">{t('app_roi_label')}</span>
              <span className="text-navy font-medium">
                {app.opportunity.expected_roi_min}% – {app.opportunity.expected_roi_max}%
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
