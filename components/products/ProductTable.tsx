/**
 * ProductTable Component
 * 
 * مكون جدول المنتجات
 */

'use client'

import React, { FC } from 'react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import type { Product } from '@/types'

// ==================== Types ====================

interface ProductTableProps {
  products: Product[]
  isLoading?: boolean
  onEdit?: (product: Product) => void
  onDelete?: (id: string) => void
  onView?: (product: Product) => void
}

// ==================== Component ====================

const ProductTable: FC<ProductTableProps> = ({
  products,
  isLoading,
  onEdit,
  onDelete,
  onView,
}) => {
  // ========== Helpers ==========

  const getStockStatus = (quantity: number, minimum: number) => {
    if (quantity === 0) return { label: 'نفد', class: 'badge-error' }
    if (quantity <= minimum) return { label: 'منخفض', class: 'badge-warning' }
    return { label: 'متوفر', class: 'badge-success' }
  }

  // ========== Render ==========

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex justify-center items-center py-12">
          <p className="text-muted">جاري تحميل المنتجات...</p>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="card">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted mb-4">لا توجد منتجات حالياً</p>
          <Link href="/dashboard/products/new" className="btn btn-primary">
            إضافة منتج جديد
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* رأس الجدول */}
          <thead>
            <tr>
              <th>اسم المنتج</th>
              <th>الكود (SKU)</th>
              <th>السعر</th>
              <th>الكمية</th>
              <th>الحد الأدنى</th>
              <th>الحالة</th>
              <th>الفئة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>

          {/* جسم الجدول */}
          <tbody>
            {products.map((product) => {
              const stockStatus = getStockStatus(product.quantityOnHand, product.minimumQuantity)

              return (
                <tr key={product.id} className="hover:bg-muted/50">
                  {/* الاسم */}
                  <td>
                    <button
                      onClick={() => onView?.(product)}
                      className="text-primary hover:underline font-medium"
                    >
                      {product.name}
                    </button>
                  </td>

                  {/* الكود */}
                  <td className="font-mono text-sm">{product.sku}</td>

                  {/* السعر */}
                  <td className="font-medium">
                    {formatCurrency(product.price)}
                  </td>

                  {/* الكمية */}
                  <td className="font-medium">
                    {product.quantityOnHand}
                  </td>

                  {/* الحد الأدنى */}
                  <td>{product.minimumQuantity}</td>

                  {/* الحالة */}
                  <td>
                    <span className={`badge ${stockStatus.class}`}>
                      {stockStatus.label}
                    </span>
                  </td>

                  {/* الفئة */}
                  <td>{product.category || '-'}</td>

                  {/* الإجراءات */}
                  <td>
                    <div className="flex gap-2">
                      {/* تعديل */}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(product)}
                          className="btn btn-sm btn-outline"
                          title="تعديل"
                        >
                          ✏️
                        </button>
                      )}

                      {/* حذف */}
                      {onDelete && (
                        <button
                          onClick={() => {
                            if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
                              onDelete(product.id)
                            }
                          }}
                          className="btn btn-sm btn-danger"
                          title="حذف"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductTable
