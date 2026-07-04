/**
 * صفحة لوحة التحكم الرئيسية
 * 
 * ملاحظة: هذه الصفحة تستخدم 'use client' مباشرة
 * لضمان توليد client-reference-manifest على Vercel
 */

'use client'

import DashboardOverview from '@/components/dashboard/DashboardOverview'

/**
 * صفحة لوحة التحكم
 */
export default function DashboardPage() {
  return (
    <main>
      <DashboardOverview />
    </main>
  )
}
