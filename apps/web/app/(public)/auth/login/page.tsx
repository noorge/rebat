'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { apiFetch } from '@/lib/utils'
import { setAuth } from '@/lib/auth'
import { useLang } from '@/lib/lang-context'

export default function LoginPage() {
  const router = useRouter()
  const { t, lang, setLang, isRTL } = useLang()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(form) })
      setAuth(data.access_token, data.role)
      router.push(data.role === 'ADMIN' ? '/admin' : '/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
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
          <h1 className="text-2xl font-bold text-white">{t('login_title')}</h1>
          <p className="text-white/50 mt-1 text-sm">{t('login_subtitle')}</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label={t('login_email')}
              type="email"
              placeholder="investor@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <Input
              label={t('login_password')}
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-600">
                {error}
              </div>
            )}
            <Button type="submit" size="lg" className="w-full mt-2" disabled={loading}>
              {loading ? t('login_loading') : t('login_btn')}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            {t('login_no_account')}{' '}
            <Link href="/auth/register" className="font-medium hover:underline" style={{ color: '#004AAD' }}>
              {t('login_register')}
            </Link>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-slate-50 text-xs text-slate-400">
            <strong>{t('login_demo')}</strong> admin@rebat.sa / Admin@12345
          </div>
        </div>
      </div>
    </div>
  )
}
