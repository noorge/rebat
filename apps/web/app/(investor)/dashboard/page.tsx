'use client'

import { useEffect, useState } from 'react'
import { getToken } from '@/lib/auth'
import { apiFetch } from '@/lib/utils'
import { useLang } from '@/lib/lang-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileText, CheckCircle, ClipboardList } from 'lucide-react'

const APP_STATUS = {
  DRAFT: 'outline', SUBMITTED: 'info', UNDER_REVIEW: 'warning', APPROVED: 'success', REJECTED: 'danger',
} as const

export default function DashboardPage() {
  const { t, isRTL } = useLang()
  const [dashboard, setDashboard] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch('/investor/dashboard', { token: getToken()! })
      .then(setDashboard)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-8 text-slate-500 animate-pulse">{t('loading')}</div>
  if (!dashboard) return <div className="p-8 text-red-500">Failed to load dashboard</div>

  const kycStatus = dashboard.kyc_status as string
  const kycConfig = {
    PENDING:             { label: t('kyc_pending_label'),   desc: t('kyc_pending_desc'),   variant: 'warning', action: 'start' },
    SUBMITTED_TO_ABSHER: { label: t('kyc_submitted_label'), desc: t('kyc_submitted_desc'), variant: 'info',    action: 'none' },
    APPROVED:            { label: t('kyc_approved_label'),  desc: t('kyc_approved_desc'),  variant: 'success', action: 'browse' },
    REJECTED:            { label: t('kyc_rejected_label'),  desc: t('kyc_rejected_desc'),  variant: 'danger',  action: 'start' },
  }[kycStatus] ?? { label: kycStatus, desc: '', variant: 'default', action: 'none' }

  const bannerColor = {
    APPROVED: 'bg-navy-light border-navy/10',
    SUBMITTED_TO_ABSHER: 'bg-blue-50 border-blue-100',
    REJECTED: 'bg-red-50 border-red-100',
    PENDING: 'bg-amber-50 border-amber-100',
  }[kycStatus] || 'bg-amber-50 border-amber-100'

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t('dashboard_title')}</h1>
        <p className="text-slate-500 mt-1">{t('dashboard_welcome')}</p>
      </div>

      <div className={`rounded-2xl p-5 border ${bannerColor}`}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="font-semibold text-slate-800">
              {t('dashboard_kyc_status')}: <Badge variant={kycConfig.variant as any}>{kycConfig.label}</Badge>
            </div>
            <p className="text-sm text-slate-600 mt-0.5">{kycConfig.desc}</p>
          </div>
          {kycConfig.action === 'start' && (
            <Link href="/kyc"><Button size="sm">{t('btn_start_kyc')}</Button></Link>
          )}
          {kycConfig.action === 'browse' && (
            <Link href="/marketplace"><Button size="sm">{t('btn_browse_investments')}</Button></Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { labelKey: 'dashboard_total_docs'   as const, value: dashboard.total_documents,              icon: FileText },
          { labelKey: 'dashboard_verified_docs' as const, value: dashboard.verified_documents,           icon: CheckCircle },
          { labelKey: 'dashboard_applications'  as const, value: dashboard.recent_applications.length,  icon: ClipboardList },
        ].map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.labelKey}>
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  <Icon size={18} className="text-slate-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{s.value}</div>
                  <div className="text-sm text-slate-500">{t(s.labelKey)}</div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>{t('dashboard_recent_apps')}</CardTitle></CardHeader>
          <CardContent>
            {dashboard.recent_applications.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <ClipboardList size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">{t('dashboard_no_apps')}</p>
                {kycStatus === 'APPROVED' && (
                  <Link href="/marketplace" className="text-navy text-sm font-medium mt-2 inline-block">
                    {t('dashboard_browse')}
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {dashboard.recent_applications.map((app: any) => (
                  <Link key={app.id} href={`/applications/${app.id}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all">
                    <div>
                      <div className="text-sm font-medium text-slate-800">
                        {isRTL ? app.opportunity?.title_ar : app.opportunity?.title_en || 'General Application'}
                      </div>
                      <div className="text-xs text-slate-400">{app.opportunity?.sector}</div>
                    </div>
                    <Badge variant={APP_STATUS[app.status as keyof typeof APP_STATUS]}>{app.status}</Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{t('dashboard_recent_activity')}</CardTitle></CardHeader>
          <CardContent>
            {dashboard.recent_activity.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">{t('dashboard_no_activity')}</div>
            ) : (
              <div className="space-y-3">
                {dashboard.recent_activity.slice(0, 6).map((log: any) => (
                  <div key={log.id} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand mt-2 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-slate-700">{log.action.replace(/_/g, ' ')}</div>
                      <div className="text-xs text-slate-400">
                        {new Date(log.created_at).toLocaleString(isRTL ? 'ar-SA' : 'en-US')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
