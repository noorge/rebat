'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { getToken, getRole, clearAuth } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Users, RefreshCw, ScrollText, LogOut } from 'lucide-react'

const NAV = [
  { href: '/admin',             label: 'Overview',          icon: LayoutDashboard },
  { href: '/admin/investors',   label: 'Investors',         icon: Users           },
  { href: '/admin/absher',      label: 'Absher Simulator',  icon: RefreshCw       },
  { href: '/admin/audit-logs',  label: 'Audit Logs',        icon: ScrollText      },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {}, [router])

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-slate-800 text-white flex flex-col fixed h-full z-10">
        <div className="px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-sm">ر</div>
            <div>
              <div className="font-bold text-sm">Rebat Admin</div>
              <div className="text-amber-400 text-xs">Government Panel</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          {NAV.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all',
                  pathname === item.href
                    ? 'bg-emerald-600 text-white font-medium'
                    : 'text-slate-400 hover:text-white hover:bg-white/10',
                )}>
                <Icon size={16} />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="px-4 pb-4 border-t border-white/10 pt-4">
          <button onClick={() => { clearAuth(); router.replace('/') }}
            className="w-full flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-red-400 text-sm rounded-xl transition-all">
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>
      <main className="flex-1 ml-64 min-h-screen">{children}</main>
    </div>
  )
}
