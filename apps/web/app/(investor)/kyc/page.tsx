'use client'

import { useEffect, useState } from 'react'
import { getToken } from '@/lib/auth'
import { apiFetch } from '@/lib/utils'
import { useLang } from '@/lib/lang-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { AlertTriangle, Loader2, CheckCircle2, Mail, Check, ShieldCheck, Upload, ArrowRight } from 'lucide-react'

export default function KycPage() {
  const { t, isRTL } = useLang()
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function load() {
    const data = await apiFetch('/kyc/status', { token: getToken()! })
    setStatus(data)
  }

  useEffect(() => { load().finally(() => setLoading(false)) }, [])

  async function handleSubmit() {
    setSubmitting(true)
    setError('')
    try {
      const res = await apiFetch('/kyc/submit', { method: 'POST', token: getToken()! })
      setMessage(res.message)
      await load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  const kycStatus = status?.kyc_status || 'PENDING'
  const stepIndex = kycStatus === 'PENDING' ? 0 : kycStatus === 'SUBMITTED_TO_ABSHER' ? 1 : 2
  const progress = stepIndex === 0 ? 10 : stepIndex === 1 ? 55 : 100
  const hasDoc = status?.documents?.some((d: any) => d.type === 'MOFA' || d.type === 'PASSPORT' || d.type === 'MISA')

  const steps = [
    { label: t('kyc_step1'), desc: t('kyc_step1_desc') },
    { label: t('kyc_step2'), desc: t('kyc_step2_desc') },
    { label: t('kyc_step3'), desc: t('kyc_step3_desc') },
  ]

  const statusBadgeVariant = kycStatus === 'APPROVED' ? 'success' : kycStatus === 'REJECTED' ? 'danger' : 'warning'
  const statusLabelMap: Record<string, string> = {
    PENDING: t('kyc_pending_label'),
    SUBMITTED_TO_ABSHER: t('kyc_submitted_label'),
    APPROVED: t('kyc_approved_label'),
    REJECTED: t('kyc_rejected_label'),
  }
  const statusLabel = statusLabelMap[kycStatus] || kycStatus

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('kyc_title')}</h1>
          <p className="text-slate-500 mt-1">{t('kyc_subtitle')}</p>
        </div>
        <Badge variant={statusBadgeVariant} className="text-sm px-3 py-1">{statusLabel}</Badge>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-5 gap-6">

        {/* LEFT — Steps + progress (3/5 width) */}
        <div className="col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t('kyc_progress')}</CardTitle>
                <span className="text-sm text-slate-400">{stepIndex + 1} / {steps.length}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Progress value={progress} />

              <div className="space-y-2">
                {steps.map((step, i) => {
                  const isActive = i === stepIndex
                  const isDone = i < stepIndex || kycStatus === 'APPROVED'
                  return (
                    <div
                      key={i}
                      className={`flex items-start gap-4 p-4 rounded-2xl transition-all ${
                        isActive ? 'bg-navy-light' : ''
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${
                        isDone
                          ? 'bg-navy text-white'
                          : isActive
                            ? 'text-white'
                            : 'bg-slate-100 text-slate-400'
                      }`}
                        style={isActive && !isDone ? { background: '#CB6CE6' } : {}}
                      >
                        {isDone ? <Check size={16} /> : i + 1}
                      </div>
                      <div className="flex-1">
                        <div className={`font-semibold text-sm ${
                          isActive ? 'text-navy' : isDone ? 'text-slate-700' : 'text-slate-400'
                        }`}>
                          {step.label}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">{step.desc}</div>
                      </div>
                      {isDone && (
                        <CheckCircle2 size={16} className="text-navy flex-shrink-0 mt-0.5" />
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Absher ref — shown below steps when available */}
          {status?.absher_ref && (
            <Card>
              <CardContent className="pt-5 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <Mail size={18} className="text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-400">{t('kyc_absher_ref')}</div>
                    <div className="font-mono text-sm font-semibold text-navy mt-0.5">{status.absher_ref}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{t('kyc_absher_keep')}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* RIGHT — Action panel (2/5 width) */}
        <div className="col-span-2 space-y-4">

          {/* PENDING — need to upload docs */}
          {kycStatus === 'PENDING' && (
            <Card className="border-amber-200">
              <CardContent className="pt-6 space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle size={18} className="text-amber-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">{t('kyc_docs_required')}</div>
                    <div className="text-xs text-slate-500 mt-1 leading-relaxed">{t('kyc_docs_desc')}</div>
                  </div>
                </div>

                {!hasDoc ? (
                  <Link href="/wallet" className="block">
                    <Button className="w-full gap-2">
                      <Upload size={15} />
                      {t('kyc_upload_first')}
                    </Button>
                  </Link>
                ) : (
                  <>
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-sm text-emerald-700">
                      <CheckCircle2 size={15} />
                      <span>{isRTL ? 'المستندات جاهزة للإرسال' : 'Documents ready to submit'}</span>
                    </div>
                    <Button className="w-full" onClick={handleSubmit} disabled={submitting}>
                      {submitting
                        ? <span className="flex items-center gap-2"><Loader2 size={14} className="animate-spin" />{t('kyc_submitting')}</span>
                        : <span className="flex items-center gap-2">{t('kyc_submit_btn')}<ArrowRight size={14} /></span>
                      }
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* SUBMITTED — waiting on Absher */}
          {kycStatus === 'SUBMITTED_TO_ABSHER' && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Loader2 size={22} className="text-blue-500 animate-spin flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-blue-900">{t('kyc_pending_review')}</div>
                  </div>
                </div>
                <p className="text-sm text-blue-700 leading-relaxed">{t('kyc_pending_review_desc')}</p>
              </CardContent>
            </Card>
          )}

          {/* APPROVED */}
          {kycStatus === 'APPROVED' && (
            <Card style={{ borderColor: '#004AAD33', background: '#e8f0fb' }}>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: '#004AAD' }}>
                    <ShieldCheck size={22} className="text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-navy">{t('kyc_complete')}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{t('kyc_complete_desc')}</div>
                  </div>
                </div>
                <Link href="/marketplace" className="block">
                  <Button className="w-full">{t('kyc_browse')}</Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* REJECTED */}
          {kycStatus === 'REJECTED' && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6 space-y-4">
                <div className="font-semibold text-red-800">{t('kyc_rejected_label')}</div>
                <p className="text-sm text-red-600">{t('kyc_rejected_desc')}</p>
                <Link href="/wallet" className="block">
                  <Button className="w-full">{t('kyc_upload_first')}</Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Info box */}
          <Card className="border-slate-100">
            <CardContent className="pt-5 pb-5 space-y-3">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                {isRTL ? 'كيف يعمل التحقق' : 'How verification works'}
              </div>
              {[
                isRTL ? 'ارفع المستندات المطلوبة في محفظتك' : 'Upload required documents to your wallet',
                isRTL ? 'يرسل رباط مستنداتك إلى أبشر تلقائياً' : 'Rebat sends your documents to Absher',
                isRTL ? 'تصل الموافقة خلال 1-3 أيام عمل' : 'Approval arrives within 1–3 business days',
              ].map((line, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-500">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold mt-0.5"
                    style={{ background: '#CB6CE6' }}>
                    {i + 1}
                  </div>
                  {line}
                </div>
              ))}
            </CardContent>
          </Card>

          {message && <div className="p-3 rounded-xl bg-navy-light text-navy text-sm">{message}</div>}
          {error && <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>}
        </div>
      </div>
    </div>
  )
}
