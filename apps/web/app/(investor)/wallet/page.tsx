'use client'

import { useEffect, useState, useRef } from 'react'
import { getToken } from '@/lib/auth'
import { apiFetch, API } from '@/lib/utils'
import { useLang } from '@/lib/lang-context'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Lock, Upload, TrendingUp, Store, Globe, Landmark, Star, CheckCircle2, FileText } from 'lucide-react'

const MINISTRIES = [
  {
    key:       'MISA',
    nameKey:   'ministry_misa_name'   as const,
    descKey:   'ministry_misa_desc'   as const,
    icon:      TrendingUp,
    color:     'emerald',
    required:  true,
  },
  {
    key:       'MOC',
    nameKey:   'ministry_moc_name'    as const,
    descKey:   'ministry_moc_desc'    as const,
    icon:      Store,
    color:     'blue',
    required:  true,
  },
  {
    key:       'MOFA',
    nameKey:   'ministry_mofa_name'   as const,
    descKey:   'ministry_mofa_desc'   as const,
    icon:      Globe,
    color:     'violet',
    required:  true,
  },
  {
    key:       'SAMA',
    nameKey:   'ministry_sama_name'   as const,
    descKey:   'ministry_sama_desc'   as const,
    icon:      Landmark,
    color:     'amber',
    required:  false,
  },
  {
    key:       'INVEST_SA',
    nameKey:   'ministry_invest_name' as const,
    descKey:   'ministry_invest_desc' as const,
    icon:      Star,
    color:     'rose',
    required:  false,
  },
] as const

const COLOR_MAP = {
  emerald: { bg: 'bg-navy-light',  icon: 'bg-navy-light text-navy', border: 'border-navy/20', badge: 'text-navy bg-navy-light' },
  blue:    { bg: 'bg-blue-50',     icon: 'bg-blue-100 text-blue-600',       border: 'border-blue-200',    badge: 'text-blue-700 bg-blue-100'       },
  violet:  { bg: 'bg-violet-50',   icon: 'bg-violet-100 text-violet-600',   border: 'border-violet-200',  badge: 'text-violet-700 bg-violet-100'   },
  amber:   { bg: 'bg-amber-50',    icon: 'bg-amber-100 text-amber-600',     border: 'border-amber-200',   badge: 'text-amber-700 bg-amber-100'     },
  rose:    { bg: 'bg-rose-50',     icon: 'bg-rose-100 text-rose-600',       border: 'border-rose-200',    badge: 'text-rose-700 bg-rose-100'       },
} as const

const STATUS_MAP = {
  PENDING:   'warning',
  SUBMITTED: 'info',
  VERIFIED:  'success',
  REJECTED:  'danger',
  EXPIRED:   'outline',
} as const

export default function WalletPage() {
  const { t, isRTL } = useLang()
  const [docs, setDocs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pendingType, setPendingType] = useState('')

  async function loadDocs() {
    const data = await apiFetch('/wallet/documents', { token: getToken()! })
    setDocs(data)
  }

  useEffect(() => { loadDocs().finally(() => setLoading(false)) }, [])

  function triggerUpload(key: string) {
    setPendingType(key)
    fileInputRef.current?.click()
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !pendingType) return
    setUploading(pendingType)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', pendingType)
      await fetch(`${API}/api/wallet/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      })
      await loadDocs()
    } catch (err) {
      console.error(err)
    } finally {
      setUploading(null)
      e.target.value = ''
    }
  }

  const docsByMinistry = Object.fromEntries(
    MINISTRIES.map((m) => [m.key, docs.filter((d) => d.type === m.key)])
  )

  const uploadedCount = MINISTRIES.filter((m) => docsByMinistry[m.key]?.length > 0).length

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('wallet_title')}</h1>
          <p className="text-slate-500 mt-1">{t('wallet_subtitle')}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-slate-900">{uploadedCount}<span className="text-slate-400 text-base font-normal">/{MINISTRIES.length}</span></div>
          <div className="text-xs text-slate-400 mt-0.5">{isRTL ? 'مستندات مرفوعة' : 'documents uploaded'}</div>
        </div>
      </div>

      <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileChange} />

      <div className="flex items-center gap-3 p-4 bg-navy-light border border-navy/10 rounded-2xl">
        <div className="w-8 h-8 rounded-lg bg-navy-light flex items-center justify-center flex-shrink-0">
          <Lock size={16} className="text-navy" />
        </div>
        <div>
          <div className="font-medium text-navy text-sm">{t('wallet_encrypted')}</div>
          <div className="text-navy text-xs">{t('wallet_encrypted_desc')}</div>
        </div>
      </div>

      {loading ? (
        <div className="text-slate-500 animate-pulse">{t('wallet_loading')}</div>
      ) : (
        <div className="space-y-3">
          {MINISTRIES.map((ministry) => {
            const Icon = ministry.icon
            const colors = COLOR_MAP[ministry.color]
            const ministryDocs = docsByMinistry[ministry.key] || []
            const latest = ministryDocs[0]
            const isUploading = uploading === ministry.key
            const hasDoc = ministryDocs.length > 0

            return (
              <Card
                key={ministry.key}
                className={`transition-all ${hasDoc ? colors.border : 'border-slate-200'}`}
              >
                <CardContent className="p-5">
                  <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>

                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${colors.icon}`}>
                      <Icon size={22} />
                    </div>

                    {/* Ministry info */}
                    <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : ''}`}>
                      <div className={`flex items-center gap-2 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="font-semibold text-slate-900 text-sm">
                          {isRTL ? t(ministry.nameKey).split(' — ')[0] : t(ministry.nameKey)}
                        </span>
                        {ministry.required ? (
                          <span className="text-xs font-medium text-red-500">{t('wallet_ministry_required')}</span>
                        ) : (
                          <span className="text-xs text-slate-400">{t('wallet_ministry_optional')}</span>
                        )}
                        {latest && (
                          <Badge variant={STATUS_MAP[latest.status as keyof typeof STATUS_MAP]}>
                            {latest.status}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{t(ministry.descKey)}</p>

                      {hasDoc && (
                        <div className={`flex items-center gap-3 mt-2 text-xs text-slate-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="flex items-center gap-1">
                            <FileText size={11} />
                            <span className="font-mono">{latest.file_hash.slice(0, 10)}…</span>
                          </span>
                          <span className="text-slate-300">·</span>
                          <span>{new Date(latest.uploaded_at).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}</span>
                        </div>
                      )}
                    </div>

                    {/* Action */}
                    <div className="flex-shrink-0">
                      {hasDoc ? (
                        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <CheckCircle2 size={16} className="text-emerald-500" />
                          <Button size="sm" variant="secondary" onClick={() => triggerUpload(ministry.key)} disabled={isUploading}>
                            {isUploading ? t('wallet_uploading') : t('wallet_replace')}
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => triggerUpload(ministry.key)}
                          disabled={isUploading}
                          className="gap-1.5"
                        >
                          <Upload size={13} />
                          {isUploading ? t('wallet_uploading') : t('wallet_upload')}
                        </Button>
                      )}
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
