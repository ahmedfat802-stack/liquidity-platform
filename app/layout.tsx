/**
 * التخطيط الرئيسي للتطبيق
 * 
 * هذا الملف يحتوي على:
 * - إعدادات الـ HTML الأساسية
 * - المتغيرات الأساسية
 * - المكونات العامة (مثل الإشعارات)
 */

import type { Metadata } from 'next'
import { APP_NAME, APP_DESCRIPTION } from '@/lib/constants'
import '@/styles/globals.css'

/**
 * بيانات الـ SEO للموقع
 */
export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  viewport: 'width=device-width, initial-scale=1',
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

        {/* Toaster للإشعارات (سيتم إضافته لاحقاً) */}
        {/* <Toaster /> */}
      </body>
    </html>
  )
}
