/**
 * صفحة إضافة عميل جديد
 */

'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import CustomerForm from '@/components/customers/CustomerForm'

/**
 * صفحة إضافة عميل جديد
 */
export default function NewCustomerPage() {
  const router = useRouter()

  return (
    <main className="space-y-6">
      {/* الرأس */}
      <div>
        <h1 className="text-3xl font-bold">إضافة عميل جديد</h1>
        <p className="text-muted mt-2">أضف عميل جديد إلى النظام</p>
      </div>

      {/* النموذج */}
      <div className="card max-w-2xl">
        <CustomerForm
          onSuccess={() => router.push('/dashboard/customers')}
          onCancel={() => router.back()}
        />
      </div>
    </main>
  )
}
