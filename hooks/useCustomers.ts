/**
 * useCustomers Hook
 * 
 * Hook مخصص لإدارة العملاء
 * يوفر دوال للحصول على العملاء، إضافة، تعديل، وحذف
 */

'use client'

import { useCallback, useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'
import { useCurrentUser } from '@/store/authStore'
import type { Customer, CustomerFormData, ApiResponse } from '@/types'

/**
 * Hook useCustomers
 * 
 * يوفر دوال لإدارة العملاء
 * 
 * @returns دوال إدارة العملاء والحالة
 * 
 * @example
 * const { customers, isLoading, addCustomer, updateCustomer } = useCustomers()
 */
export function useCustomers() {
  const supabase = getSupabaseClient()
  const user = useCurrentUser()

  // ========== State ==========
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ========== Effects ==========

  /**
   * جلب العملاء عند تحميل المكون
   */
  useEffect(() => {
    if (user?.id) {
      fetchCustomers()
    }
  }, [user?.id])

  // ========== Functions ==========

  /**
   * جلب قائمة العملاء
   */
  const fetchCustomers = useCallback(async () => {
    if (!user?.id) return

    try {
      setIsLoading(true)
      setError(null)

      const { data, error: dbError } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (dbError) throw dbError

      setCustomers((data as Customer[]) || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ في جلب العملاء'
      setError(errorMessage)
      console.error('خطأ في جلب العملاء:', err)
    } finally {
      setIsLoading(false)
    }
  }, [user?.id, supabase])

  /**
   * الحصول على عميل واحد
   */
  const getCustomer = useCallback(
    async (id: string): Promise<Customer | null> => {
      try {
        const { data, error: dbError } = await supabase
          .from('customers')
          .select('*')
          .eq('id', id)
          .eq('user_id', user?.id)
          .single()

        if (dbError) throw dbError

        return (data as Customer) || null
      } catch (err) {
        console.error('خطأ في جلب العميل:', err)
        return null
      }
    },
    [user?.id, supabase]
  )

  /**
   * إضافة عميل جديد
   */
  const addCustomer = useCallback(
    async (data: CustomerFormData): Promise<ApiResponse<Customer>> => {
      if (!user?.id) {
        return {
          status: 401,
          error: 'يجب تسجيل الدخول أولاً',
        }
      }

      try {
        setError(null)

        const { data: newCustomer, error: dbError } = await supabase
          .from('customers')
          .insert([
            {
              user_id: user.id,
              name: data.name,
              phone: data.phone,
              email: data.email || null,
              address: data.address || null,
              credit_limit: data.creditLimit,
              current_balance: 0,
              status: 'active',
            },
          ])
          .select()
          .single()

        if (dbError) throw dbError

        // تحديث القائمة المحلية
        setCustomers([newCustomer as Customer, ...customers])

        return {
          status: 201,
          data: newCustomer as Customer,
          message: 'تم إضافة العميل بنجاح',
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'خطأ في إضافة العميل'
        setError(errorMessage)
        return {
          status: 400,
          error: errorMessage,
        }
      }
    },
    [user?.id, supabase, customers]
  )

  /**
   * تحديث بيانات العميل
   */
  const updateCustomer = useCallback(
    async (id: string, data: Partial<CustomerFormData>): Promise<ApiResponse<Customer>> => {
      if (!user?.id) {
        return {
          status: 401,
          error: 'يجب تسجيل الدخول أولاً',
        }
      }

      try {
        setError(null)

        const updateData: Record<string, any> = {}
        if (data.name) updateData.name = data.name
        if (data.phone) updateData.phone = data.phone
        if (data.email !== undefined) updateData.email = data.email
        if (data.address !== undefined) updateData.address = data.address
        if (data.creditLimit) updateData.credit_limit = data.creditLimit

        const { data: updatedCustomer, error: dbError } = await supabase
          .from('customers')
          .update(updateData)
          .eq('id', id)
          .eq('user_id', user.id)
          .select()
          .single()

        if (dbError) throw dbError

        // تحديث القائمة المحلية
        setCustomers(
          customers.map((c) => (c.id === id ? (updatedCustomer as Customer) : c))
        )

        return {
          status: 200,
          data: updatedCustomer as Customer,
          message: 'تم تحديث بيانات العميل بنجاح',
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'خطأ في تحديث العميل'
        setError(errorMessage)
        return {
          status: 400,
          error: errorMessage,
        }
      }
    },
    [user?.id, supabase, customers]
  )

  /**
   * حذف عميل
   */
  const deleteCustomer = useCallback(
    async (id: string): Promise<ApiResponse<null>> => {
      if (!user?.id) {
        return {
          status: 401,
          error: 'يجب تسجيل الدخول أولاً',
        }
      }

      try {
        setError(null)

        const { error: dbError } = await supabase
          .from('customers')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id)

        if (dbError) throw dbError

        // تحديث القائمة المحلية
        setCustomers(customers.filter((c) => c.id !== id))

        return {
          status: 200,
          message: 'تم حذف العميل بنجاح',
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'خطأ في حذف العميل'
        setError(errorMessage)
        return {
          status: 400,
          error: errorMessage,
        }
      }
    },
    [user?.id, supabase, customers]
  )

  /**
   * البحث عن عملاء
   */
  const searchCustomers = useCallback(
    (query: string): Customer[] => {
      if (!query) return customers

      const lowerQuery = query.toLowerCase()
      return customers.filter(
        (c) =>
          c.name.toLowerCase().includes(lowerQuery) ||
          c.phone.includes(query) ||
          c.email?.toLowerCase().includes(lowerQuery)
      )
    },
    [customers]
  )

  /**
   * تحديث رصيد العميل
   */
  const updateCustomerBalance = useCallback(
    async (id: string, amount: number): Promise<ApiResponse<Customer>> => {
      if (!user?.id) {
        return {
          status: 401,
          error: 'يجب تسجيل الدخول أولاً',
        }
      }

      try {
        const { data: updatedCustomer, error: dbError } = await supabase
          .from('customers')
          .update({ current_balance: amount })
          .eq('id', id)
          .eq('user_id', user.id)
          .select()
          .single()

        if (dbError) throw dbError

        // تحديث القائمة المحلية
        setCustomers(
          customers.map((c) => (c.id === id ? (updatedCustomer as Customer) : c))
        )

        return {
          status: 200,
          data: updatedCustomer as Customer,
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'خطأ في تحديث الرصيد'
        return {
          status: 400,
          error: errorMessage,
        }
      }
    },
    [user?.id, supabase, customers]
  )

  // ========== Return ==========

  return {
    customers,
    isLoading,
    error,
    fetchCustomers,
    getCustomer,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    searchCustomers,
    updateCustomerBalance,
  }
}
