'use client'

/**
 * =====================================================================
 * Dashboard Layout — تخطيط لوحة التحكم لمنصة "سيولة"
 * =====================================================================
 * - Sidebar ثابت على اليمين (RTL) + محتوى رئيسي بمسافات مريحة
 * - max-w-7xl لضبط عرض المحتوى على الشاشات الكبيرة
 * =====================================================================
 */

import Sidebar from '@/components/layout/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background" dir="rtl">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 px-6 py-8 lg:px-10 lg:py-10 overflow-y-auto">
          <div className="max-w-7xl mx-auto animate-fade-in">{children}</div>
        </div>
      </main>
    </div>
  )
}
