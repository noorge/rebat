'use client'

import { useEffect, useState } from 'react'
import { getToken } from '@/lib/auth'
import { apiFetch } from '@/lib/utils'
import { useLang } from '@/lib/lang-context'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ClipboardList } from 'lucide-react'

const STATUS_CONFIG = {
  DRAFT:        { variant: 'outline'  },
  SUBMITTED:    { variant: 'info'     },
  UNDER_REVIEW: { variant: 'warning'  },
  APPROVED:     { variant: 'success'  },
  REJECTED:     { variant: 'danger'   },
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

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t('apps_title')}</h1>
        <p className="text-slate-500 mt-1">{t('apps_subtitle')}</p>
      </div>

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
        <div className="space-y-3">
          {apps.map((app) => {
            const cfg = STATUS_CONFIG[app.status as keyof typeof STATUS_CONFIG]
            const title = isRTL ? app.opportunity?.title_ar : app.opportunity?.title_en
            return (
              <Link key={app.id} href={`/applications/${app.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-5 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-800">
                          {title || t('app_general')}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {app.opportunity?.sector && (
                            <Badge variant="outline">{app.opportunity.sector}</Badge>
                          )}
                          <span className="text-xs text-slate-400">
                            {t('apps_submitted_on')} {new Date(app.submitted_at || app.created_at).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {app.absher_ref && (
                          <span className="font-mono text-xs text-slate-400">{app.absher_ref}</span>
                        )}
                        <Badge variant={cfg.variant as any}>{app.status}</Badge>
                        <span className="text-slate-300">{isRTL ? '‹' : '›'}</span>
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
