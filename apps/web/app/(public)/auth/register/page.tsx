'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { apiFetch } from '@/lib/utils'
import { setAuth } from '@/lib/auth'
import { useLang } from '@/lib/lang-context'

export default function RegisterPage() {
  const router = useRouter()
  const { t, lang, setLang, isRTL } = useLang()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    email: '', password: '', full_name: '',
    nationality: '', passport_number: '', company_name: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const STEPS = [t('reg_step1'), t('reg_step2'), t('reg_step3')]

  function update(key: string, val: string) {
    setForm((f) => ({ ...f, [key]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (step < 2) { setStep(step + 1); return }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    router.push('/dashboard')
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{ background: 'linear-gradient(135deg, #004AAD 0%, #002d6b 50%, #1a0533 100%)' }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="text-white/50 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all"
            >
              {lang === 'en' ? 'العربية' : 'English'}
            </button>
          </div>
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
              style={{ background: 'linear-gradient(135deg, #CB6CE6, #9b4fc0)' }}
            >
              ر
            </div>
            <span className="text-white font-bold text-xl">{isRTL ? 'رباط' : 'Rebat'}</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">{t('reg_title')}</h1>
          <p className="text-white/50 mt-1 text-sm">
            {t('reg_step_prefix')} {step + 1} {t('reg_step_of')} {STEPS.length}: {STEPS[step]}
          </p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-2 mb-6">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className="flex-1 h-1 rounded-full transition-all"
              style={{ background: i <= step ? '#CB6CE6' : 'rgba(255,255,255,0.2)' }}
            />
          ))}
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {step === 0 && (
              <>
                <Input label={t('reg_full_name')} placeholder="John Smith" value={form.full_name}
                  onChange={(e) => update('full_name', e.target.value)} required />
                <Input label={t('reg_email')} type="email" placeholder="john@company.com" value={form.email}
                  onChange={(e) => update('email', e.target.value)} required />
                <Input label={t('reg_password')} type="password" placeholder={t('reg_password_hint')} value={form.password}
                  onChange={(e) => update('password', e.target.value)} required minLength={8} />
              </>
            )}

            {step === 1 && (
              <>
                <Input label={t('reg_nationality')} placeholder={t('reg_nationality_hint')} value={form.nationality}
                  onChange={(e) => update('nationality', e.target.value)} required />
                <Input label={t('reg_passport')} placeholder={t('reg_passport_hint')} value={form.passport_number}
                  onChange={(e) => update('passport_number', e.target.value)} required />
                <Input label={t('reg_company')} placeholder={t('reg_company_hint')} value={form.company_name}
                  onChange={(e) => update('company_name', e.target.value)} />
              </>
            )}

            {step === 2 && (
              <div className="rounded-xl bg-slate-50 p-4 space-y-3 text-sm">
                <h3 className="font-semibold text-slate-800">{t('reg_review_title')}</h3>
                {[
                  [t('reg_review_name'),        form.full_name],
                  [t('reg_review_email'),       form.email],
                  [t('reg_review_nationality'), form.nationality],
                  [t('reg_review_passport'),    `${form.passport_number.slice(0, 3)}***`],
                  [t('reg_review_company'),     form.company_name || 'N/A'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-slate-500">{k}</span>
                    <span className="text-slate-800 font-medium">{v}</span>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-600">{error}</div>
            )}

            <div className={`flex gap-3 mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {step > 0 && (
                <Button type="button" variant="secondary" onClick={() => setStep(step - 1)} className="flex-1">
                  {t('reg_back')}
                </Button>
              )}
              <Button type="submit" className="flex-1" disabled={loading}>
                {step < 2 ? t('reg_continue') : loading ? t('reg_creating') : t('reg_create')}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            {t('reg_have_account')}{' '}
            <Link href="/auth/login" className="font-medium hover:underline" style={{ color: '#004AAD' }}>
              {t('reg_signin')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
