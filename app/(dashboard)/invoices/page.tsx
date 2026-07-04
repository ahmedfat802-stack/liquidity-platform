/**
 * صفحة قائمة الفواتير
 */

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useInvoices } from '@/hooks/useInvoices'
import InvoiceTable from '@/components/invoices/InvoiceTable'
import { formatCurrency } from '@/lib/utils'
import type { Invoice } from '@/types'

/**
 * صفحة الفواتير
 */
export default function InvoicesPage() {
  const {
    invoices,
    isLoading,
    deleteInvoice,
    markAsPaid,
    searchInvoices,
    filterByStatus,
    getOverdueInvoices,
  } = useInvoices()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // ========== Handlers ==========

  const handleDelete = async (id: string) => {
    const response = await deleteInvoice(id)
    if (response.status === 200) {
      // سيتم تحديث القائمة تلقائياً
    }
  }

  const handleMarkPaid = async (id: string) => {
    const invoice = invoices.find((inv) => inv.id === id)
    if (invoice) {
      await markAsPaid(id, invoice.totalAmount)
    }
  }

  const handleEdit = (invoice: Invoice) => {
    console.log('تعديل الفاتورة:', invoice)
  }

  // ========== Calculations ==========

  let filteredInvoices = searchQuery ? searchInvoices(searchQuery) : invoices

  if (statusFilter !== 'all') {
    filteredInvoices = filteredInvoices.filter((inv) => inv.status === statusFilter)
  }

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0)
  const totalPaid = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0)
  const totalPending = totalAmount - totalPaid
  const overdueCount = getOverdueInvoices().length

  // ========== Render ==========

  return (
    <main className="space-y-6">
      {/* الرأس */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">الفواتير</h1>
          <p className="text-muted mt-2">إدارة الفواتير والمستحقات</p>
        </div>
        <Link href="/dashboard/invoices/new" className="btn btn-primary">
          + إضافة فاتورة جديدة
        </Link>
      </div>

      {/* الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-muted text-sm">إجمالي الفواتير</p>
          <p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p>
        </div>
        <div className="card">
          <p className="text-muted text-sm">المدفوع</p>
          <p className="text-2xl font-bold text-secondary">{formatCurrency(totalPaid)}</p>
        </div>
        <div className="card">
          <p className="text-muted text-sm">المستحقات</p>
          <p className="text-2xl font-bold text-warning">{formatCurrency(totalPending)}</p>
        </div>
        <div className="card">
          <p className="text-muted text-sm">متأخرة</p>
          <p className="text-2xl font-bold text-destructive">{overdueCount}</p>
        </div>
      </div>

      {/* البحث والتصفية */}
      <div className="card space-y-4">
        <input
          type="text"
          placeholder="ابحث عن فاتورة..."
          className="input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setStatusFilter('all')}
            className={`btn ${statusFilter === 'all' ? 'btn-primary' : 'btn-outline'}`}
          >
            الكل
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`btn ${statusFilter === 'pending' ? 'btn-primary' : 'btn-outline'}`}
          >
            معلقة
          </button>
          <button
            onClick={() => setStatusFilter('paid')}
            className={`btn ${statusFilter === 'paid' ? 'btn-primary' : 'btn-outline'}`}
          >
            مدفوعة
          </button>
          <button
            onClick={() => setStatusFilter('overdue')}
            className={`btn ${statusFilter === 'overdue' ? 'btn-primary' : 'btn-outline'}`}
          >
            متأخرة
          </button>
        </div>
      </div>

      {/* الجدول */}
      <InvoiceTable
        invoices={filteredInvoices}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onMarkPaid={handleMarkPaid}
      />
    </main>
  )
}
