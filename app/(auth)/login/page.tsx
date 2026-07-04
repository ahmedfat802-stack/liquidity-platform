/**
 * صفحة تسجيل الدخول
 * 
 * الموقع: /login
 */

import { Metadata } from 'next'
import Link from 'next/link'
import LoginForm from '@/components/auth/LoginForm'
import { APP_NAME } from '@/lib/constants'

/**
 * بيانات الـ SEO
 */
export const metadata: Metadata = {
  title: `تسجيل الدخول - ${APP_NAME}`,
  description: 'تسجيل الدخول إلى منصة إدارة السيولة والآجل',
}

/**
 * صفحة تسجيل الدخول
 */
export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <div className="w-full max-w-md">
        {/* الرأس */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <h1 className="text-3xl font-bold text-foreground">
              {APP_NAME}
            </h1>
          </Link>
          <p className="text-muted">تسجيل الدخول إلى حسابك</p>
        </div>

        {/* البطاقة */}
        <div className="card">
          <LoginForm />
        </div>

        {/* الرابط للصفحة الرئيسية */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-primary hover:underline">
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </main>
  )
}
