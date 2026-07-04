/**
 * InvoiceTable Component
 * 
 * مكون جدول الفواتير
 */

'use client'

import React, { FC } from 'react'
import Link from 'next/link'
import { formatCurrency, formatDate, daysUntilDue } from '@/lib/utils'
import type { Invoice } from '@/types'

// ==================== Types ====================

interface InvoiceTableProps {
  invoices: Invoice[]
  isLoading?: boolean
  onEdit?: (invoice: Invoice) => void
  onDelete?: (id: string) => void
  onView?: (invoice: Invoice) => void
  onMarkPaid?: (id: string) => void
}

// ==================== Component ====================

const InvoiceTable: FC<InvoiceTableProps> = ({
  invoices,
  isLoading,
  onEdit,
  onDelete,
  onView,
  onMarkPaid,
}) => {
  // ========== Helpers ==========

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'paid':
        return 'badge-success'
      case 'pending':
        return 'badge-warning'
      case 'overdue':
        return 'badge-error'
      default:
        return 'badge-primary'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return 'مدفوعة'
      case 'pending':
        return 'معلقة'
      case 'overdue':
        return 'متأخرة'
      default:
        return status
    }
  }

  // ========== Render ==========

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex justify-center items-center py-12">
          <p className="text-muted">جاري تحميل الفواتير...</p>
        </div>
      </div>
    )
  }

  if (invoices.length === 0) {
    return (
      <div className="card">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted mb-4">لا توجد فواتير حالياً</p>
          <Link href="/dashboard/invoices/new" className="btn btn-primary">
            إضافة فاتورة جديدة
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
              <th>رقم الفاتورة</th>
              <th>العميل</th>
              <th>المبلغ</th>
              <th>المدفوع</th>
              <th>تاريخ الاستحقاق</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>

          {/* جسم الجدول */}
          <tbody>
            {invoices.map((invoice) => {
              const days = daysUntilDue(invoice.dueDate)
              const isOverdue = days < 0

              return (
                <tr key={invoice.id} className={isOverdue ? 'bg-destructive/10' : ''}>
                  {/* رقم الفاتورة */}
                  <td>
                    <button
                      onClick={() => onView?.(invoice)}
                      className="text-primary hover:underline font-medium"
                    >
                      {invoice.invoiceNumber}
                    </button>
                  </td>

                  {/* العميل */}
                  <td>{invoice.customer?.name || '-'}</td>

                  {/* المبلغ */}
                  <td className="font-medium">
                    {formatCurrency(invoice.totalAmount)}
                  </td>

                  {/* المدفوع */}
                  <td className="font-medium">
                    {formatCurrency(invoice.paidAmount)}
                  </td>

                  {/* تاريخ الاستحقاق */}
                  <td>
                    <div>
                      <p>{formatDate(invoice.dueDate)}</p>
                      <p className="text-sm text-muted">
                        {isOverdue
                          ? `متأخر ${Math.abs(days)} أيام`
                          : `متبقي ${days} أيام`}
                      </p>
                    </div>
                  </td>

                  {/* الحالة */}
                  <td>
                    <span className={`badge ${getStatusBadgeClass(invoice.status)}`}>
                      {getStatusLabel(invoice.status)}
                    </span>
                  </td>

                  {/* الإجراءات */}
                  <td>
                    <div className="flex gap-2">
                      {/* تعديل */}
                      {onEdit && invoice.status !== 'paid' && (
                        <button
                          onClick={() => onEdit(invoice)}
                          className="btn btn-sm btn-outline"
                          title="تعديل"
                        >
                          ✏️
                        </button>
                      )}

                      {/* تعليم كمدفوعة */}
                      {onMarkPaid && invoice.status !== 'paid' && (
                        <button
                          onClick={() => onMarkPaid(invoice.id)}
                          className="btn btn-sm btn-secondary"
                          title="تعليم كمدفوعة"
                        >
                          ✓
                        </button>
                      )}

                      {/* حذف */}
                      {onDelete && invoice.status !== 'paid' && (
                        <button
                          onClick={() => {
                            if (confirm('هل أنت متأكد من حذف هذه الفاتورة؟')) {
                              onDelete(invoice.id)
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

export default InvoiceTable
