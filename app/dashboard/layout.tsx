/**
 * تخطيط لوحة التحكم - Server Component
 * 
 * ملاحظة: هذا الملف Server Component عمداً
 * الـ 'use client' موجود في مكونات منفصلة (SidebarClient, HeaderClient)
 * لتجنب مشكلة client-reference-manifest على Vercel
 */

import React, { ReactNode, Suspense } from 'react'
import DashboardLayoutClient from '@/components/dashboard/DashboardLayoutClient'

/**
 * تخطيط لوحة التحكم الرئيسي
 */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary mb-2">💰 Liquidity</div>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    }>
      <DashboardLayoutClient>
        {children}
      </DashboardLayoutClient>
    </Suspense>
  )
}
