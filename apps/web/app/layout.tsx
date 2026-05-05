import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Rebat — Foreign Investment Platform',
  description: 'Saudi Arabia\'s digital gateway for foreign investors',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
