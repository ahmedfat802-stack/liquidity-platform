/**
 * تخطيط المصادقة
 * 
 * هذا التخطيط يتم تطبيقه على جميع صفحات المصادقة
 * مثل: /login, /register, /forgot-password
 */

import { ReactNode } from 'react'

/**
 * Props للتخطيط
 */
interface AuthLayoutProps {
  children: ReactNode
}

/**
 * تخطيط المصادقة
 * 
 * يوفر تخطيط موحد لجميع صفحات المصادقة
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen">
      {/* المحتوى الرئيسي */}
      {children}
    </div>
  )
}
