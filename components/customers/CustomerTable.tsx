/**
 * CustomerTable Component
 * 
 * مكون جدول العملاء
 * 
 * الخصائص:
 * - customers: Customer[] - قائمة العملاء
 * - isLoading?: boolean - حالة التحميل
 * - onEdit?: (customer: Customer) => void - دالة التعديل
 * - onDelete?: (id: string) => void - دالة الحذف
 * - onView?: (customer: Customer) => void - دالة عرض التفاصيل
 */

'use client'

import React, { FC } from 'react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import type { Customer } from '@/types'

// ==================== Types ====================

interface CustomerTableProps {
  /** قائمة العملاء */
  customers: Customer[]
  /** حالة التحميل */
  isLoading?: boolean
  /** دالة التعديل */
  onEdit?: (customer: Customer) => void
  /** دالة الحذف */
  onDelete?: (id: string) => void
  /** دالة عرض التفاصيل */
  onView?: (customer: Customer) => void
}

// ==================== Component ====================

const CustomerTable: FC<CustomerTableProps> = ({
  customers,
  isLoading,
  onEdit,
  onDelete,
  onView,
}) => {
  // ========== Render ==========

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex justify-center items-center py-12">
          <p className="text-muted">جاري تحميل العملاء...</p>
        </div>
      </div>
    )
  }

  if (customers.length === 0) {
    return (
      <div className="card">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted mb-4">لا توجد عملاء حالياً</p>
          <Link href="/dashboard/customers/new" className="btn btn-primary">
            إضافة عميل جديد
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
              <th>الاسم</th>
              <th>الهاتف</th>
              <th>البريد الإلكتروني</th>
              <th>الحد الائتماني</th>
              <th>المستحقات</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>

          {/* جسم الجدول */}
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-muted/50">
                {/* الاسم */}
                <td>
                  <button
                    onClick={() => onView?.(customer)}
                    className="text-primary hover:underline font-medium"
                  >
                    {customer.name}
                  </button>
                </td>

                {/* الهاتف */}
                <td>
                  <a href={`tel:${customer.phone}`} className="text-primary hover:underline">
                    {customer.phone}
                  </a>
                </td>

                {/* البريد الإلكتروني */}
                <td>
                  {customer.email ? (
                    <a href={`mailto:${customer.email}`} className="text-primary hover:underline">
                      {customer.email}
                    </a>
                  ) : (
                    <span className="text-muted">-</span>
                  )}
                </td>

                {/* الحد الائتماني */}
                <td className="font-medium">
                  {formatCurrency(customer.creditLimit)}
                </td>

                {/* المستحقات */}
                <td className="font-medium">
                  {formatCurrency(customer.currentBalance)}
                </td>

                {/* الحالة */}
                <td>
                  <span
                    className={`badge ${
                      customer.status === 'active'
                        ? 'badge-success'
                        : customer.status === 'suspended'
                          ? 'badge-warning'
                          : 'badge-error'
                    }`}
                  >
                    {customer.status === 'active'
                      ? 'نشط'
                      : customer.status === 'suspended'
                        ? 'معلق'
                        : 'متعثر'}
                  </span>
                </td>

                {/* الإجراءات */}
                <td>
                  <div className="flex gap-2">
                    {/* زر التعديل */}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(customer)}
                        className="btn btn-sm btn-outline"
                        title="تعديل"
                      >
                        ✏️
                      </button>
                    )}

                    {/* زر الحذف */}
                    {onDelete && (
                      <button
                        onClick={() => {
                          if (confirm('هل أنت متأكد من حذف هذا العميل؟')) {
                            onDelete(customer.id)
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CustomerTable
