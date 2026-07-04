/**
 * صفحة إضافة منتج جديد
 */

'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import ProductForm from '@/components/products/ProductForm'

/**
 * صفحة إضافة منتج جديد
 */
export default function NewProductPage() {
  const router = useRouter()

  return (
    <main className="space-y-6">
      {/* الرأس */}
      <div>
        <h1 className="text-3xl font-bold">إضافة منتج جديد</h1>
        <p className="text-muted mt-2">أضف منتج جديد إلى المخزون</p>
      </div>

      {/* النموذج */}
      <div className="card max-w-2xl">
        <ProductForm
          onSuccess={() => router.push('/dashboard/products')}
          onCancel={() => router.back()}
        />
      </div>
    </main>
  )
}
