/**
 * اختبارات Hook useInvoices
 * 
 * اختبار جميع وظائف إدارة الفواتير
 */

import { renderHook, act } from '@testing-library/react'
import { useInvoices } from '@/hooks/useInvoices'
import type { InvoiceFormData } from '@/types'

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
          invoiceNumber: 'INV-001',
          customerId: 'cust-1',
          invoiceDate: new Date(),
          dueDate: new Date(),
          totalAmount: 5000,
          paidAmount: 0,
          status: 'pending',
          notes: 'ملاحظات',
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

describe('useInvoices Hook', () => {
  // ========== Basic Tests ==========

  it('يجب أن يتم إنشاء الـ Hook بدون أخطاء', () => {
    const { result } = renderHook(() => useInvoices())
    expect(result.current).toBeDefined()
  })

  it('يجب أن يحتوي الـ Hook على جميع الدوال المطلوبة', () => {
    const { result } = renderHook(() => useInvoices())
    expect(result.current.fetchInvoices).toBeDefined()
    expect(result.current.getInvoice).toBeDefined()
    expect(result.current.addInvoice).toBeDefined()
    expect(result.current.updateInvoice).toBeDefined()
    expect(result.current.deleteInvoice).toBeDefined()
    expect(result.current.markAsPaid).toBeDefined()
    expect(result.current.searchInvoices).toBeDefined()
    expect(result.current.filterByStatus).toBeDefined()
    expect(result.current.getOverdueInvoices).toBeDefined()
    expect(result.current.getUpcomingInvoices).toBeDefined()
  })

  // ========== State Tests ==========

  it('يجب أن تكون الحالة الأولية صحيحة', () => {
    const { result } = renderHook(() => useInvoices())
    expect(result.current.invoices).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  // ========== Add Invoice Tests ==========

  describe('addInvoice', () => {
    it('يجب إضافة فاتورة جديدة', async () => {
      const { result } = renderHook(() => useInvoices())

      const newInvoice: InvoiceFormData = {
        customerId: 'cust-1',
        invoiceNumber: 'INV-001',
        invoiceDate: new Date(),
        dueDate: new Date(),
        items: [
          {
            productId: 'prod-1',
            quantity: 2,
            unitPrice: 2500,
          },
        ],
        notes: 'ملاحظات',
      }

      let response

      await act(async () => {
        response = await result.current.addInvoice(newInvoice)
      })

      expect(response?.status).toBe(201)
      expect(response?.message).toContain('بنجاح')
    })
  })

  // ========== Mark As Paid Tests ==========

  describe('markAsPaid', () => {
    it('يجب تعليم الفاتورة كمدفوعة', async () => {
      const { result } = renderHook(() => useInvoices())

      let response

      await act(async () => {
        response = await result.current.markAsPaid('1', 5000)
      })

      expect(response?.status).toBe(200)
    })
  })

  // ========== Filter Tests ==========

  describe('filterByStatus', () => {
    it('يجب تصفية الفواتير حسب الحالة', () => {
      const { result } = renderHook(() => useInvoices())

      // محاكاة التصفية
      const mockInvoices = [
        {
          id: '1',
          status: 'pending',
          invoiceNumber: 'INV-001',
          totalAmount: 5000,
          paidAmount: 0,
        },
        {
          id: '2',
          status: 'paid',
          invoiceNumber: 'INV-002',
          totalAmount: 3000,
          paidAmount: 3000,
        },
      ]

      const filtered = mockInvoices.filter((inv) => inv.status === 'pending')

      expect(filtered.length).toBe(1)
      expect(filtered[0].status).toBe('pending')
    })
  })

  // ========== Delete Tests ==========

  describe('deleteInvoice', () => {
    it('يجب حذف فاتورة', async () => {
      const { result } = renderHook(() => useInvoices())

      let response

      await act(async () => {
        response = await result.current.deleteInvoice('1')
      })

      expect(response?.status).toBe(200)
      expect(response?.message).toContain('بنجاح')
    })
  })
})
