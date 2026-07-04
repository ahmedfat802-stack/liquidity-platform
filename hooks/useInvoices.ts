/**
 * useInvoices Hook
 * 
 * Hook مخصص لإدارة الفواتير
 * يوفر دوال للحصول على الفواتير، إضافة، تعديل، وحذف
 */

'use client'

import { useCallback, useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'
import { useCurrentUser } from '@/store/authStore'
import { daysUntilDue } from '@/lib/utils'
import type { Invoice, InvoiceFormData, ApiResponse } from '@/types'

/**
 * Hook useInvoices
 * 
 * يوفر دوال لإدارة الفواتير
 * 
 * @returns دوال إدارة الفواتير والحالة
 * 
 * @example
 * const { invoices, isLoading, addInvoice, updateInvoice } = useInvoices()
 */
export function useInvoices() {
  const supabase = getSupabaseClient()
  const user = useCurrentUser()

  // ========== State ==========
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ========== Effects ==========

  /**
   * جلب الفواتير عند تحميل المكون
   */
  useEffect(() => {
    if (user?.id) {
      fetchInvoices()
    }
  }, [user?.id])

  // ========== Functions ==========

  /**
   * جلب قائمة الفواتير
   */
  const fetchInvoices = useCallback(async () => {
    if (!user?.id) return

    try {
      setIsLoading(true)
      setError(null)

      const { data, error: dbError } = await supabase
        .from('invoices')
        .select(
          `
          *,
          customer:customers(id, name, phone, email),
          items:invoice_items(*)
        `
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (dbError) throw dbError

      setInvoices((data as Invoice[]) || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ في جلب الفواتير'
      setError(errorMessage)
      console.error('خطأ في جلب الفواتير:', err)
    } finally {
      setIsLoading(false)
    }
  }, [user?.id, supabase])

  /**
   * الحصول على فاتورة واحدة
   */
  const getInvoice = useCallback(
    async (id: string): Promise<Invoice | null> => {
      try {
        const { data, error: dbError } = await supabase
          .from('invoices')
          .select(
            `
            *,
            customer:customers(id, name, phone, email),
            items:invoice_items(*)
          `
          )
          .eq('id', id)
          .eq('user_id', user?.id)
          .single()

        if (dbError) throw dbError

        return (data as Invoice) || null
      } catch (err) {
        console.error('خطأ في جلب الفاتورة:', err)
        return null
      }
    },
    [user?.id, supabase]
  )

  /**
   * إضافة فاتورة جديدة
   */
  const addInvoice = useCallback(
    async (data: InvoiceFormData): Promise<ApiResponse<Invoice>> => {
      if (!user?.id) {
        return {
          status: 401,
          error: 'يجب تسجيل الدخول أولاً',
        }
      }

      try {
        setError(null)

        // حساب المبلغ الإجمالي
        const totalAmount = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)

        // إنشاء الفاتورة
        const { data: newInvoice, error: invoiceError } = await supabase
          .from('invoices')
          .insert([
            {
              user_id: user.id,
              customer_id: data.customerId,
              invoice_number: data.invoiceNumber,
              invoice_date: data.invoiceDate,
              due_date: data.dueDate,
              total_amount: totalAmount,
              paid_amount: 0,
              status: 'pending',
              notes: data.notes || null,
            },
          ])
          .select()
          .single()

        if (invoiceError) throw invoiceError

        // إضافة بنود الفاتورة
        const items = data.items.map((item) => ({
          invoice_id: newInvoice.id,
          product_id: item.productId,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          total_price: item.quantity * item.unitPrice,
        }))

        const { error: itemsError } = await supabase.from('invoice_items').insert(items)

        if (itemsError) throw itemsError

        // جلب الفاتورة مع البيانات الكاملة
        const fullInvoice = await getInvoice(newInvoice.id)

        if (fullInvoice) {
          setInvoices([fullInvoice, ...invoices])
        }

        return {
          status: 201,
          data: fullInvoice || (newInvoice as Invoice),
          message: 'تم إضافة الفاتورة بنجاح',
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'خطأ في إضافة الفاتورة'
        setError(errorMessage)
        return {
          status: 400,
          error: errorMessage,
        }
      }
    },
    [user?.id, supabase, invoices, getInvoice]
  )

  /**
   * تحديث الفاتورة
   */
  const updateInvoice = useCallback(
    async (id: string, data: Partial<InvoiceFormData>): Promise<ApiResponse<Invoice>> => {
      if (!user?.id) {
        return {
          status: 401,
          error: 'يجب تسجيل الدخول أولاً',
        }
      }

      try {
        setError(null)

        const updateData: Record<string, any> = {}
        if (data.invoiceNumber) updateData.invoice_number = data.invoiceNumber
        if (data.invoiceDate) updateData.invoice_date = data.invoiceDate
        if (data.dueDate) updateData.due_date = data.dueDate
        if (data.notes !== undefined) updateData.notes = data.notes

        const { data: updatedInvoice, error: dbError } = await supabase
          .from('invoices')
          .update(updateData)
          .eq('id', id)
          .eq('user_id', user.id)
          .select()
          .single()

        if (dbError) throw dbError

        // جلب الفاتورة مع البيانات الكاملة
        const fullInvoice = await getInvoice(id)

        if (fullInvoice) {
          setInvoices(
            invoices.map((inv) => (inv.id === id ? fullInvoice : inv))
          )
        }

        return {
          status: 200,
          data: fullInvoice || (updatedInvoice as Invoice),
          message: 'تم تحديث الفاتورة بنجاح',
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'خطأ في تحديث الفاتورة'
        setError(errorMessage)
        return {
          status: 400,
          error: errorMessage,
        }
      }
    },
    [user?.id, supabase, invoices, getInvoice]
  )

  /**
   * حذف فاتورة
   */
  const deleteInvoice = useCallback(
    async (id: string): Promise<ApiResponse<null>> => {
      if (!user?.id) {
        return {
          status: 401,
          error: 'يجب تسجيل الدخول أولاً',
        }
      }

      try {
        setError(null)

        // حذف البنود أولاً
        const { error: itemsError } = await supabase
          .from('invoice_items')
          .delete()
          .eq('invoice_id', id)

        if (itemsError) throw itemsError

        // ثم حذف الفاتورة
        const { error: dbError } = await supabase
          .from('invoices')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id)

        if (dbError) throw dbError

        // تحديث القائمة المحلية
        setInvoices(invoices.filter((inv) => inv.id !== id))

        return {
          status: 200,
          message: 'تم حذف الفاتورة بنجاح',
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'خطأ في حذف الفاتورة'
        setError(errorMessage)
        return {
          status: 400,
          error: errorMessage,
        }
      }
    },
    [user?.id, supabase, invoices]
  )

  /**
   * تعليم الفاتورة كمدفوعة
   */
  const markAsPaid = useCallback(
    async (id: string, paidAmount: number): Promise<ApiResponse<Invoice>> => {
      if (!user?.id) {
        return {
          status: 401,
          error: 'يجب تسجيل الدخول أولاً',
        }
      }

      try {
        const { data: updatedInvoice, error: dbError } = await supabase
          .from('invoices')
          .update({
            paid_amount: paidAmount,
            status: 'paid',
          })
          .eq('id', id)
          .eq('user_id', user.id)
          .select()
          .single()

        if (dbError) throw dbError

        // تحديث القائمة المحلية
        setInvoices(
          invoices.map((inv) =>
            inv.id === id
              ? { ...inv, paid_amount: paidAmount, status: 'paid' as const }
              : inv
          )
        )

        return {
          status: 200,
          data: updatedInvoice as Invoice,
          message: 'تم تعليم الفاتورة كمدفوعة',
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'خطأ في تحديث الفاتورة'
        return {
          status: 400,
          error: errorMessage,
        }
      }
    },
    [user?.id, supabase, invoices]
  )

  /**
   * البحث عن فواتير
   */
  const searchInvoices = useCallback(
    (query: string): Invoice[] => {
      if (!query) return invoices

      const lowerQuery = query.toLowerCase()
      return invoices.filter(
        (inv) =>
          inv.invoiceNumber.toLowerCase().includes(lowerQuery) ||
          inv.customer?.name.toLowerCase().includes(lowerQuery)
      )
    },
    [invoices]
  )

  /**
   * تصفية الفواتير حسب الحالة
   */
  const filterByStatus = useCallback(
    (status: string): Invoice[] => {
      return invoices.filter((inv) => inv.status === status)
    },
    [invoices]
  )

  /**
   * الحصول على الفواتير المستحقة قريباً
   */
  const getUpcomingInvoices = useCallback((): Invoice[] => {
    return invoices.filter((inv) => {
      const days = daysUntilDue(inv.dueDate)
      return days <= 1 && days >= 0 && inv.status !== 'paid'
    })
  }, [invoices])

  /**
   * الحصول على الفواتير المتأخرة
   */
  const getOverdueInvoices = useCallback((): Invoice[] => {
    return invoices.filter((inv) => {
      const days = daysUntilDue(inv.dueDate)
      return days < 0 && inv.status !== 'paid'
    })
  }, [invoices])

  // ========== Return ==========

  return {
    invoices,
    isLoading,
    error,
    fetchInvoices,
    getInvoice,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    markAsPaid,
    searchInvoices,
    filterByStatus,
    getUpcomingInvoices,
    getOverdueInvoices,
  }
}
