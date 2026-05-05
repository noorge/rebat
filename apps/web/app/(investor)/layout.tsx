'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { getToken, getRole, clearAuth } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { useLang } from '@/lib/lang-context'
import Image from 'next/image'
import {
  LayoutDashboard, Wallet, ShieldCheck, Store, ClipboardList,
  Globe, LogOut,
} from 'lucide-react'

function InvestorSidebar() {
  const { lang, setLang, t, isRTL } = useLang()
  const pathname = usePathname()
  const router = useRouter()

  const NAV = [
    { href: '/dashboard',    labelKey: 'nav_dashboard'    as const, icon: LayoutDashboard },
    { href: '/wallet',       labelKey: 'nav_wallet'       as const, icon: Wallet          },
    { href: '/kyc',          labelKey: 'nav_kyc'          as const, icon: ShieldCheck     },
    { href: '/marketplace',  labelKey: 'nav_marketplace'  as const, icon: Store           },
    { href: '/applications', labelKey: 'nav_applications' as const, icon: ClipboardList   },
  ]

  function logout() {
    clearAuth()
    router.replace('/')
  }

  return (
    <aside
      className={cn('w-64 flex flex-col fixed h-full z-10', isRTL ? 'right-0' : 'left-0')}
      style={{ background: 'linear-gradient(180deg, #004AAD 0%, #003a8a 100%)' }}
    >
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Rebat" width={44} height={44} className="flex-shrink-0" />
          <div className="text-xs" style={{ color: '#CB6CE6' }}>{t('nav_investor_portal')}</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {NAV.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all',
                isRTL ? 'flex-row-reverse text-right' : '',
                active
                  ? 'text-white font-medium'
                  : 'text-white/60 hover:text-white hover:bg-white/10',
              )}
              style={active ? { background: '#CB6CE6' } : {}}
            >
              <Icon size={16} />
              {t(item.labelKey)}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 pb-4 space-y-1 border-t border-white/10 pt-4">
        <button
          onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 text-sm transition-all"
        >
          <Globe size={16} />
          {lang === 'en' ? 'العربية' : 'English'}
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white/60 hover:text-red-300 hover:bg-red-500/10 text-sm transition-all"
        >
          <LogOut size={16} />
          {t('nav_signout')}
        </button>
      </div>
    </aside>
  )
}

function InvestorShell({ children }: { children: React.ReactNode }) {
  const { isRTL } = useLang()
  const router = useRouter()

  useEffect(() => {}, [router])

  return (
    <div className={cn('min-h-screen flex')} dir={isRTL ? 'rtl' : 'ltr'}>
      <InvestorSidebar />
      <main className={cn('flex-1 min-h-screen', isRTL ? 'mr-64' : 'ml-64')}>
        {children}
      </main>
    </div>
  )
}

export default function InvestorLayout({ children }: { children: React.ReactNode }) {
  return <InvestorShell>{children}</InvestorShell>
}
