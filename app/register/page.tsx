/**
 * صفحة التسجيل
 * الموقع: /register
 */

import { Metadata } from 'next'
import Link from 'next/link'
import RegisterForm from '@/components/auth/RegisterForm'
import { APP_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: `إنشاء حساب - ${APP_NAME}`,
  description: 'إنشاء حساب جديد على منصة إدارة السيولة والآجل',
}

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <h1 className="text-3xl font-bold text-foreground">💰 {APP_NAME}</h1>
          </Link>
          <p className="text-muted-foreground">إنشاء حساب جديد</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
          <RegisterForm />
        </div>
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            لديك حساب بالفعل؟{' '}
            <Link href="/login" className="text-primary hover:underline font-medium">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
