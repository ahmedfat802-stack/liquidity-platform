/**
 * تخطيط لوحة التحكم
 */

'use client'

import React, { ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useCurrentUser } from '@/store/authStore'

/**
 * تخطيط لوحة التحكم
 */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { logout } = useAuth()
  const user = useCurrentUser()

  // ========== Handlers ==========

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  // ========== Render ==========

  return (
    <div className="flex h-screen bg-background">
      {/* الشريط الجانبي */}
      <aside className="w-64 bg-card border-r border-border overflow-y-auto">
        {/* الشعار */}
        <div className="p-6 border-b border-border">
          <Link href="/dashboard" className="text-2xl font-bold text-primary">
            💰 Liquidity
          </Link>
          <p className="text-xs text-muted mt-1">إدارة السيولة والآجل</p>
        </div>

        {/* القائمة الرئيسية */}
        <nav className="p-4 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors"
          >
            <span>📊</span>
            <span>لوحة التحكم</span>
          </Link>

          <Link
            href="/dashboard/customers"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors"
          >
            <span>👥</span>
            <span>العملاء</span>
          </Link>

          <Link
            href="/dashboard/invoices"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors"
          >
            <span>📄</span>
            <span>الفواتير</span>
          </Link>

          <Link
            href="/dashboard/products"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors"
          >
            <span>📦</span>
            <span>المنتجات</span>
          </Link>
        </nav>

        {/* الفاصل */}
        <div className="border-t border-border mx-4 my-4"></div>

        {/* القائمة الثانوية */}
        <nav className="p-4 space-y-2">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors"
          >
            <span>⚙️</span>
            <span>الإعدادات</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors text-destructive"
          >
            <span>🚪</span>
            <span>تسجيل الخروج</span>
          </button>
        </nav>

        {/* معلومات المستخدم */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-muted/50">
          <p className="text-sm font-medium truncate">{user?.email}</p>
          <p className="text-xs text-muted">مستخدم</p>
        </div>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 overflow-y-auto">
        {/* الشريط العلوي */}
        <header className="bg-card border-b border-border px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">منصة إدارة السيولة</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted">{user?.email}</span>
            </div>
          </div>
        </header>

        {/* محتوى الصفحة */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
