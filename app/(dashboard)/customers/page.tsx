/**
 * صفحة قائمة العملاء
 */

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useCustomers } from '@/hooks/useCustomers'
import CustomerTable from '@/components/customers/CustomerTable'
import type { Customer } from '@/types'

/**
 * صفحة العملاء
 */
export default function CustomersPage() {
  const { customers, isLoading, deleteCustomer, searchCustomers } = useCustomers()
  const [searchQuery, setSearchQuery] = useState('')

  // ========== Handlers ==========

  const handleDelete = async (id: string) => {
    const response = await deleteCustomer(id)
    if (response.status === 200) {
      // سيتم تحديث القائمة تلقائياً
    }
  }

  const handleEdit = (customer: Customer) => {
    // سيتم فتح نموذج التعديل
    console.log('تعديل العميل:', customer)
  }

  // ========== Calculations ==========

  const filteredCustomers = searchQuery
    ? searchCustomers(searchQuery)
    : customers

  // ========== Render ==========

  return (
    <main className="space-y-6">
      {/* الرأس */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">العملاء</h1>
          <p className="text-muted mt-2">إدارة العملاء والمستحقات</p>
        </div>
        <Link href="/dashboard/customers/new" className="btn btn-primary">
          + إضافة عميل جديد
        </Link>
      </div>

      {/* البحث */}
      <div className="card">
        <input
          type="text"
          placeholder="ابحث عن عميل..."
          className="input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-muted text-sm">إجمالي العملاء</p>
          <p className="text-3xl font-bold">{customers.length}</p>
        </div>
        <div className="card">
          <p className="text-muted text-sm">العملاء النشطين</p>
          <p className="text-3xl font-bold">
            {customers.filter((c) => c.status === 'active').length}
          </p>
        </div>
        <div className="card">
          <p className="text-muted text-sm">العملاء المتعثرين</p>
          <p className="text-3xl font-bold text-destructive">
            {customers.filter((c) => c.status === 'defaulted').length}
          </p>
        </div>
      </div>

      {/* الجدول */}
      <CustomerTable
        customers={filteredCustomers}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </main>
  )
}
