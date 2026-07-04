/**
 * التخطيط الرئيسي للتطبيق
 * 
 * هذا الملف يحتوي على:
 * - إعدادات الـ HTML الأساسية
 * - المتغيرات الأساسية
 * - المكونات العامة (مثل الإشعارات)
 */

import type { Metadata, Viewport } from 'next'
import { APP_NAME, APP_DESCRIPTION } from '@/lib/constants'
import '@/styles/globals.css'

/**
 * إعدادات الـ Viewport - يجب أن تكون منفصلة عن metadata في Next.js 14+
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

/**
 * بيانات الـ SEO للموقع
 */
export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  icons: {
    icon: '/favicon.ico',
  },
}

/**
 * Props للتخطيط الرئيسي
 */
interface RootLayoutProps {
  children: React.ReactNode
}

/**
 * التخطيط الرئيسي
 * 
 * يحتوي على:
 * - إعدادات HTML الأساسية
 * - المتغيرات العامة
 * - المكونات العامة
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* الخطوط */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* المحتوى الرئيسي */}
        {children}
      </body>
    </html>
  )
}
