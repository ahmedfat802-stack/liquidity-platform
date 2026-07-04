/**
 * صفحة قائمة المنتجات
 */

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useProducts } from '@/hooks/useProducts'
import ProductTable from '@/components/products/ProductTable'
import type { Product } from '@/types'

/**
 * صفحة المنتجات
 */
export default function ProductsPage() {
  const {
    products,
    isLoading,
    deleteProduct,
    searchProducts,
    getOutOfStockProducts,
    getLowStockProducts,
  } = useProducts()

  const [searchQuery, setSearchQuery] = useState('')
  const [stockFilter, setStockFilter] = useState<string>('all')

  // ========== Handlers ==========

  const handleDelete = async (id: string) => {
    const response = await deleteProduct(id)
    if (response.status === 200) {
      // سيتم تحديث القائمة تلقائياً
    }
  }

  const handleEdit = (product: Product) => {
    console.log('تعديل المنتج:', product)
  }

  // ========== Calculations ==========

  let filteredProducts = searchQuery ? searchProducts(searchQuery) : products

  if (stockFilter === 'out-of-stock') {
    filteredProducts = getOutOfStockProducts()
  } else if (stockFilter === 'low-stock') {
    filteredProducts = getLowStockProducts()
  }

  const outOfStockCount = getOutOfStockProducts().length
  const lowStockCount = getLowStockProducts().length

  // ========== Render ==========

  return (
    <main className="space-y-6">
      {/* الرأس */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">المنتجات</h1>
          <p className="text-muted mt-2">إدارة المنتجات والمخزون</p>
        </div>
        <Link href="/dashboard/products/new" className="btn btn-primary">
          + إضافة منتج جديد
        </Link>
      </div>

      {/* الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-muted text-sm">إجمالي المنتجات</p>
          <p className="text-3xl font-bold">{products.length}</p>
        </div>
        <div className="card">
          <p className="text-muted text-sm">مخزون منخفض</p>
          <p className="text-3xl font-bold text-warning">{lowStockCount}</p>
        </div>
        <div className="card">
          <p className="text-muted text-sm">نفد المخزون</p>
          <p className="text-3xl font-bold text-destructive">{outOfStockCount}</p>
        </div>
      </div>

      {/* البحث والتصفية */}
      <div className="card space-y-4">
        <input
          type="text"
          placeholder="ابحث عن منتج..."
          className="input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setStockFilter('all')}
            className={`btn ${stockFilter === 'all' ? 'btn-primary' : 'btn-outline'}`}
          >
            الكل
          </button>
          <button
            onClick={() => setStockFilter('low-stock')}
            className={`btn ${stockFilter === 'low-stock' ? 'btn-primary' : 'btn-outline'}`}
          >
            مخزون منخفض
          </button>
          <button
            onClick={() => setStockFilter('out-of-stock')}
            className={`btn ${stockFilter === 'out-of-stock' ? 'btn-primary' : 'btn-outline'}`}
          >
            نفد المخزون
          </button>
        </div>
      </div>

      {/* الجدول */}
      <ProductTable
        products={filteredProducts}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </main>
  )
}
