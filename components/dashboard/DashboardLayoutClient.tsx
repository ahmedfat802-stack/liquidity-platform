/**
 * DashboardLayoutClient
 * 
 * Client Component للـ Dashboard Layout
 * يحتوي على الـ sidebar والـ header والـ navigation
 * 
 * تم فصله عن الـ layout.tsx الرئيسي لتجنب مشكلة
 * client-reference-manifest على Vercel
 */

'use client'

import React, { ReactNode } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useCurrentUser } from '@/store/authStore'

/**
 * Props للـ DashboardLayoutClient
 */
interface DashboardLayoutClientProps {
  children: ReactNode
}

/**
 * مكون تخطيط لوحة التحكم (Client Side)
 */
export default function DashboardLayoutClient({ children }: DashboardLayoutClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { logout } = useAuth()
  const user = useCurrentUser()

  // ========== Handlers ==========

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  // ========== Helpers ==========

  /**
   * التحقق من أن الرابط نشط
   */
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname?.startsWith(href)
  }

  // ========== Navigation Items ==========

  const navItems = [
    { href: '/', label: 'لوحة التحكم', icon: '📊' },
    { href: '/customers', label: 'العملاء', icon: '👥' },
    { href: '/invoices', label: 'الفواتير', icon: '📄' },
    { href: '/products', label: 'المنتجات', icon: '📦' },
  ]

  // ========== Render ==========

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* الشريط الجانبي */}
      <aside className="w-64 bg-card border-l border-border flex flex-col overflow-y-auto flex-shrink-0">
        {/* الشعار */}
        <div className="p-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">💰</span>
            <div>
              <h1 className="text-lg font-bold text-foreground leading-tight">Liquidity</h1>
              <p className="text-xs text-muted-foreground">إدارة السيولة والآجل</p>
            </div>
          </Link>
        </div>

        {/* القائمة الرئيسية */}
        <nav className="p-4 space-y-1 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                isActive(item.href)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* الفاصل */}
        <div className="border-t border-border mx-4"></div>

        {/* معلومات المستخدم وتسجيل الخروج */}
        <div className="p-4 space-y-2">
          {/* معلومات المستخدم */}
          <div className="px-4 py-2 rounded-lg bg-muted/50">
            <p className="text-sm font-medium truncate text-foreground">
              {user?.email || 'مستخدم'}
            </p>
            <p className="text-xs text-muted-foreground">حساب نشط</p>
          </div>

          {/* زر تسجيل الخروج */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-destructive/10 transition-colors text-sm font-medium text-destructive"
          >
            <span>🚪</span>
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* الشريط العلوي */}
        <header className="bg-card border-b border-border px-8 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">منصة إدارة السيولة</h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{user?.email}</span>
            </div>
          </div>
        </header>

        {/* محتوى الصفحة */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
