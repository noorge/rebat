'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useLang } from '@/lib/lang-context'

export default function LandingPage() {
  const { t, lang, setLang, isRTL } = useLang()

  return (
    <div
      className="min-h-screen flex flex-col"
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{ background: 'linear-gradient(135deg, #004AAD 0%, #002d6b 50%, #1a0533 100%)' }}
    >
      <header className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-lg"
            style={{ background: 'linear-gradient(135deg, #CB6CE6, #9b4fc0)' }}
          >
            ر
          </div>
          <span className="text-white font-bold text-xl tracking-tight">{isRTL ? 'رباط' : 'Rebat'}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="text-white/60 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all"
          >
            {lang === 'en' ? 'العربية' : 'English'}
          </button>
          <Link href="/auth/login">
            <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
              {t('landing_signin')}
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button className="text-white" style={{ background: '#CB6CE6' }}>
              {t('landing_start')}
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8 border"
          style={{ background: 'rgba(203,108,230,0.12)', borderColor: 'rgba(203,108,230,0.3)' }}
        >
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#CB6CE6' }} />
          <span className="text-sm font-medium" style={{ color: '#CB6CE6' }}>{t('landing_badge')}</span>
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight max-w-3xl mb-6">
          {t('landing_hero1')}<br />
          <span style={{ color: '#CB6CE6' }}>{t('landing_hero2')}</span>
        </h1>

        <p className="text-white/60 text-lg max-w-2xl mb-10 leading-relaxed">
          {t('landing_desc')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/register">
            <Button size="lg" className="text-white" style={{ background: '#CB6CE6' }}>
              {t('landing_start')}
            </Button>
          </Link>
          <Link href="/marketplace">
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
              {t('landing_browse')}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-12 mt-24 border-t border-white/10 pt-12">
          {[
            { label: t('landing_stat1'), value: '50+' },
            { label: t('landing_stat2'), value: '12'  },
            { label: t('landing_stat3'), value: '14%' },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <span className="text-3xl font-bold" style={{ color: '#CB6CE6' }}>{s.value}</span>
              <span className="text-white/50 text-sm mt-1">{s.label}</span>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center py-6 text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
        {t('landing_footer')}
      </footer>
    </div>
  )
}
