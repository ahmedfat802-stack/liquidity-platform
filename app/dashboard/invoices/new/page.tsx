/**
 * صفحة إضافة فاتورة جديدة
 */

'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import InvoiceForm from '@/components/invoices/InvoiceForm'

/**
 * صفحة إضافة فاتورة جديدة
 */
export default function NewInvoicePage() {
  const router = useRouter()

  return (
    <main className="space-y-6">
      {/* الرأس */}
      <div>
        <h1 className="text-3xl font-bold">إضافة فاتورة جديدة</h1>
        <p className="text-muted mt-2">أنشئ فاتورة جديدة للعميل</p>
      </div>

      {/* النموذج */}
      <div className="card">
        <InvoiceForm
          onSuccess={() => router.push('/dashboard/invoices')}
          onCancel={() => router.back()}
        />
      </div>
    </main>
  )
}
