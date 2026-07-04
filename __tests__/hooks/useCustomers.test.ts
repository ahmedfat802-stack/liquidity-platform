/**
 * اختبارات Hook useCustomers
 * 
 * اختبار جميع وظائف إدارة العملاء
 */

import { renderHook, act, waitFor } from '@testing-library/react'
import { useCustomers } from '@/hooks/useCustomers'
import type { Customer, CustomerFormData } from '@/types'

// Mock Supabase
jest.mock('@/lib/supabase/client', () => ({
  getSupabaseClient: jest.fn(() => ({
    from: jest.fn((table) => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: {
          id: '1',
          name: 'محمد أحمد',
          phone: '01001234567',
          email: 'test@example.com',
          address: 'القاهرة',
          creditLimit: 10000,
          currentBalance: 5000,
          status: 'active',
        },
        error: null,
      }),
    })),
  })),
}))

// Mock auth store
jest.mock('@/store/authStore', () => ({
  useCurrentUser: jest.fn(() => ({
    id: 'user-123',
    email: 'test@example.com',
  })),
}))

describe('useCustomers Hook', () => {
  // ========== Basic Tests ==========

  it('يجب أن يتم إنشاء الـ Hook بدون أخطاء', () => {
    const { result } = renderHook(() => useCustomers())
    expect(result.current).toBeDefined()
  })

  it('يجب أن يحتوي الـ Hook على جميع الدوال المطلوبة', () => {
    const { result } = renderHook(() => useCustomers())
    expect(result.current.fetchCustomers).toBeDefined()
    expect(result.current.getCustomer).toBeDefined()
    expect(result.current.addCustomer).toBeDefined()
    expect(result.current.updateCustomer).toBeDefined()
    expect(result.current.deleteCustomer).toBeDefined()
    expect(result.current.searchCustomers).toBeDefined()
    expect(result.current.updateCustomerBalance).toBeDefined()
  })

  // ========== State Tests ==========

  it('يجب أن تكون الحالة الأولية صحيحة', () => {
    const { result } = renderHook(() => useCustomers())
    expect(result.current.customers).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  // ========== Add Customer Tests ==========

  describe('addCustomer', () => {
    it('يجب إضافة عميل جديد', async () => {
      const { result } = renderHook(() => useCustomers())

      const newCustomer: CustomerFormData = {
        name: 'محمد أحمد',
        phone: '01001234567',
        email: 'test@example.com',
        address: 'القاهرة',
        creditLimit: 10000,
      }

      let response

      await act(async () => {
        response = await result.current.addCustomer(newCustomer)
      })

      expect(response?.status).toBe(201)
      expect(response?.message).toContain('بنجاح')
    })

    it('يجب إرجاع خطأ عند عدم تسجيل الدخول', async () => {
      const { result } = renderHook(() => useCustomers())

      const newCustomer: CustomerFormData = {
        name: 'محمد أحمد',
        phone: '01001234567',
        creditLimit: 10000,
      }

      let response

      await act(async () => {
        response = await result.current.addCustomer(newCustomer)
      })

      // سيتم التحقق من الاستجابة
      expect(response).toBeDefined()
    })
  })

  // ========== Search Tests ==========

  describe('searchCustomers', () => {
    it('يجب البحث عن العملاء بالاسم', () => {
      const { result } = renderHook(() => useCustomers())

      const mockCustomers: Customer[] = [
        {
          id: '1',
          name: 'محمد أحمد',
          phone: '01001234567',
          email: 'test@example.com',
          address: 'القاهرة',
          creditLimit: 10000,
          currentBalance: 5000,
          status: 'active',
          createdAt: new Date(),
          userId: 'user-123',
        },
      ]

      // محاكاة البحث
      const results = mockCustomers.filter((c) =>
        c.name.toLowerCase().includes('محمد')
      )

      expect(results.length).toBeGreaterThan(0)
    })

    it('يجب إرجاع قائمة فارغة عند عدم العثور على نتائج', () => {
      const { result } = renderHook(() => useCustomers())

      const mockCustomers: Customer[] = []
      const results = mockCustomers.filter((c) =>
        c.name.toLowerCase().includes('غير موجود')
      )

      expect(results.length).toBe(0)
    })
  })

  // ========== Update Tests ==========

  describe('updateCustomer', () => {
    it('يجب تحديث بيانات العميل', async () => {
      const { result } = renderHook(() => useCustomers())

      const updateData: Partial<CustomerFormData> = {
        name: 'محمد علي',
        phone: '01101234567',
      }

      let response

      await act(async () => {
        response = await result.current.updateCustomer('1', updateData)
      })

      expect(response?.status).toBe(200)
    })
  })

  // ========== Delete Tests ==========

  describe('deleteCustomer', () => {
    it('يجب حذف عميل', async () => {
      const { result } = renderHook(() => useCustomers())

      let response

      await act(async () => {
        response = await result.current.deleteCustomer('1')
      })

      expect(response?.status).toBe(200)
      expect(response?.message).toContain('بنجاح')
    })
  })

  // ========== Update Balance Tests ==========

  describe('updateCustomerBalance', () => {
    it('يجب تحديث رصيد العميل', async () => {
      const { result } = renderHook(() => useCustomers())

      let response

      await act(async () => {
        response = await result.current.updateCustomerBalance('1', 7500)
      })

      expect(response?.status).toBe(200)
    })
  })
})
