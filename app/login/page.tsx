/**
 * صفحة تسجيل الدخول
 * الموقع: /login
 */

import { Metadata } from 'next'
import Link from 'next/link'
import LoginForm from '@/components/auth/LoginForm'
import { APP_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: `تسجيل الدخول - ${APP_NAME}`,
  description: 'تسجيل الدخول إلى منصة إدارة السيولة والآجل',
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <h1 className="text-3xl font-bold text-foreground">💰 {APP_NAME}</h1>
          </Link>
          <p className="text-muted-foreground">تسجيل الدخول إلى حسابك</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
          <LoginForm />
        </div>
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            ليس لديك حساب؟{' '}
            <Link href="/register" className="text-primary hover:underline font-medium">
              إنشاء حساب جديد
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
