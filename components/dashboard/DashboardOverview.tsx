/**
 * DashboardOverview Component
 * 
 * مكون نظرة عامة على لوحة التحكم
 * يعرض الإحصائيات الرئيسية والتنبيهات
 */

'use client'

import React, { FC } from 'react'
import Link from 'next/link'
import { useCustomers } from '@/hooks/useCustomers'
import { useInvoices } from '@/hooks/useInvoices'
import { useProducts } from '@/hooks/useProducts'
import { formatCurrency } from '@/lib/utils'

/**
 * مكون نظرة عامة على لوحة التحكم
 */
const DashboardOverview: FC = () => {
  const { customers } = useCustomers()
  const { invoices, getOverdueInvoices, getUpcomingInvoices } = useInvoices()
  const { getOutOfStockProducts, getLowStockProducts } = useProducts()

  // ========== Calculations ==========

  // حسابات السيولة
  const totalCreditLimit = customers.reduce((sum, c) => sum + c.creditLimit, 0)
  const totalOutstanding = customers.reduce((sum, c) => sum + c.currentBalance, 0)
  const availableLiquidity = totalCreditLimit - totalOutstanding

  // حسابات الفواتير
  const totalInvoices = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0)
  const totalPaid = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0)
  const totalPending = totalInvoices - totalPaid
  const overdueInvoices = getOverdueInvoices()
  const upcomingInvoices = getUpcomingInvoices()

  // حسابات المخزون
  const outOfStock = getOutOfStockProducts()
  const lowStock = getLowStockProducts()

  // ========== Render ==========

  return (
    <div className="space-y-6">
      {/* الرأس */}
      <div>
        <h1 className="text-3xl font-bold">لوحة التحكم</h1>
        <p className="text-muted mt-2">نظرة عامة على حالة عملك</p>
      </div>

      {/* قسم السيولة */}
      <div>
        <h2 className="text-xl font-bold mb-4">💰 إدارة السيولة</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* الحد الائتماني الإجمالي */}
          <div className="card border-l-4 border-primary">
            <p className="text-muted text-sm">الحد الائتماني الإجمالي</p>
            <p className="text-2xl font-bold">{formatCurrency(totalCreditLimit)}</p>
            <p className="text-xs text-muted mt-2">{customers.length} عملاء</p>
          </div>

          {/* المستحقات */}
          <div className="card border-l-4 border-warning">
            <p className="text-muted text-sm">المستحقات الحالية</p>
            <p className="text-2xl font-bold text-warning">{formatCurrency(totalOutstanding)}</p>
            <p className="text-xs text-muted mt-2">
              {((totalOutstanding / totalCreditLimit) * 100).toFixed(1)}% من الحد الائتماني
            </p>
          </div>

          {/* السيولة المتاحة */}
          <div className={`card border-l-4 ${
            availableLiquidity < totalCreditLimit * 0.2
              ? 'border-destructive'
              : 'border-secondary'
          }`}>
            <p className="text-muted text-sm">السيولة المتاحة</p>
            <p className={`text-2xl font-bold ${
              availableLiquidity < totalCreditLimit * 0.2
                ? 'text-destructive'
                : 'text-secondary'
            }`}>
              {formatCurrency(availableLiquidity)}
            </p>
            <p className="text-xs text-muted mt-2">
              {((availableLiquidity / totalCreditLimit) * 100).toFixed(1)}% متاح
            </p>
          </div>
        </div>
      </div>

      {/* قسم الفواتير */}
      <div>
        <h2 className="text-xl font-bold mb-4">📄 الفواتير</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* إجمالي الفواتير */}
          <div className="card">
            <p className="text-muted text-sm">إجمالي الفواتير</p>
            <p className="text-2xl font-bold">{formatCurrency(totalInvoices)}</p>
            <p className="text-xs text-muted mt-2">{invoices.length} فاتورة</p>
          </div>

          {/* المدفوع */}
          <div className="card">
            <p className="text-muted text-sm">المدفوع</p>
            <p className="text-2xl font-bold text-secondary">{formatCurrency(totalPaid)}</p>
            <p className="text-xs text-muted mt-2">
              {((totalPaid / totalInvoices) * 100).toFixed(1)}% مدفوع
            </p>
          </div>

          {/* المستحقات */}
          <div className="card">
            <p className="text-muted text-sm">المستحقات</p>
            <p className="text-2xl font-bold text-warning">{formatCurrency(totalPending)}</p>
            <Link href="/dashboard/invoices" className="text-xs text-primary hover:underline mt-2">
              عرض الفواتير →
            </Link>
          </div>

          {/* المتأخرة */}
          <div className="card">
            <p className="text-muted text-sm">متأخرة</p>
            <p className="text-2xl font-bold text-destructive">{overdueInvoices.length}</p>
            <p className="text-xs text-muted mt-2">
              {formatCurrency(
                overdueInvoices.reduce((sum, inv) => sum + (inv.totalAmount - inv.paidAmount), 0)
              )} متأخرة
            </p>
          </div>
        </div>
      </div>

      {/* قسم التنبيهات */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* تنبيهات السيولة */}
        <div className="card">
          <h3 className="text-lg font-bold mb-4">⚠️ تنبيهات السيولة</h3>
          <div className="space-y-3">
            {availableLiquidity < totalCreditLimit * 0.2 && (
              <div className="alert alert-error">
                <p className="text-sm">
                  ⚠️ السيولة المتاحة قليلة جداً! تبقى فقط {formatCurrency(availableLiquidity)}
                </p>
              </div>
            )}

            {overdueInvoices.length > 0 && (
              <div className="alert alert-warning">
                <p className="text-sm">
                  🔔 لديك {overdueInvoices.length} فاتورة متأخرة بقيمة{' '}
                  {formatCurrency(
                    overdueInvoices.reduce((sum, inv) => sum + (inv.totalAmount - inv.paidAmount), 0)
                  )}
                </p>
              </div>
            )}

            {upcomingInvoices.length > 0 && (
              <div className="alert alert-info">
                <p className="text-sm">
                  📅 {upcomingInvoices.length} فاتورة تستحق غداً بقيمة{' '}
                  {formatCurrency(
                    upcomingInvoices.reduce((sum, inv) => sum + (inv.totalAmount - inv.paidAmount), 0)
                  )}
                </p>
              </div>
            )}

            {availableLiquidity >= totalCreditLimit * 0.2 &&
              overdueInvoices.length === 0 &&
              upcomingInvoices.length === 0 && (
                <p className="text-muted text-sm">✅ لا توجد تنبيهات حالياً</p>
              )}
          </div>
        </div>

        {/* تنبيهات المخزون */}
        <div className="card">
          <h3 className="text-lg font-bold mb-4">📦 تنبيهات المخزون</h3>
          <div className="space-y-3">
            {outOfStock.length > 0 && (
              <div className="alert alert-error">
                <p className="text-sm">
                  🚨 {outOfStock.length} منتج نفد المخزون
                </p>
              </div>
            )}

            {lowStock.length > 0 && (
              <div className="alert alert-warning">
                <p className="text-sm">
                  ⚠️ {lowStock.length} منتج مخزونه منخفض
                </p>
              </div>
            )}

            {outOfStock.length === 0 && lowStock.length === 0 && (
              <p className="text-muted text-sm">✅ المخزون بحالة جيدة</p>
            )}

            <Link href="/dashboard/products" className="btn btn-sm btn-outline btn-full">
              إدارة المخزون →
            </Link>
          </div>
        </div>
      </div>

      {/* قسم الإجراءات السريعة */}
      <div className="card">
        <h3 className="text-lg font-bold mb-4">⚡ إجراءات سريعة</h3>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/customers/new" className="btn btn-primary">
            + إضافة عميل
          </Link>
          <Link href="/dashboard/invoices/new" className="btn btn-primary">
            + إضافة فاتورة
          </Link>
          <Link href="/dashboard/products/new" className="btn btn-primary">
            + إضافة منتج
          </Link>
          <Link href="/dashboard/invoices" className="btn btn-outline">
            عرض الفواتير
          </Link>
          <Link href="/dashboard/customers" className="btn btn-outline">
            عرض العملاء
          </Link>
        </div>
      </div>
    </div>
  )
}

export default DashboardOverview
