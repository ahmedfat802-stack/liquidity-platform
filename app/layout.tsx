/**
 * التخطيط الرئيسي للتطبيق
 * يحتوي على إعدادات HTML الأساسية والـ Metadata والـ Fonts
 */

import type { Metadata, Viewport } from 'next'
import { Cairo } from 'next/font/google'
import { APP_NAME, APP_DESCRIPTION } from '@/lib/constants'
import '@/styles/globals.css'

// ========== Fonts ==========
const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
})

// ========== Viewport ==========
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

// ========== Metadata ==========
export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  icons: {
    icon: '/favicon.ico',
  },
}

// ========== Root Layout ==========
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
