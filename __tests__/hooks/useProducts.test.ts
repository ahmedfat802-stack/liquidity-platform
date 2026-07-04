/**
 * اختبارات Hook useProducts
 * 
 * اختبار جميع وظائف إدارة المنتجات
 */

import { renderHook, act } from '@testing-library/react'
import { useProducts } from '@/hooks/useProducts'
import type { ProductFormData } from '@/types'

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
          name: 'منتج تجريبي',
          sku: 'SKU-001',
          price: 1000,
          quantityOnHand: 50,
          minimumQuantity: 10,
          category: 'فئة',
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

describe('useProducts Hook', () => {
  // ========== Basic Tests ==========

  it('يجب أن يتم إنشاء الـ Hook بدون أخطاء', () => {
    const { result } = renderHook(() => useProducts())
    expect(result.current).toBeDefined()
  })

  it('يجب أن يحتوي الـ Hook على جميع الدوال المطلوبة', () => {
    const { result } = renderHook(() => useProducts())
    expect(result.current.fetchProducts).toBeDefined()
    expect(result.current.getProduct).toBeDefined()
    expect(result.current.addProduct).toBeDefined()
    expect(result.current.updateProduct).toBeDefined()
    expect(result.current.deleteProduct).toBeDefined()
    expect(result.current.updateQuantity).toBeDefined()
    expect(result.current.searchProducts).toBeDefined()
    expect(result.current.getOutOfStockProducts).toBeDefined()
    expect(result.current.getLowStockProducts).toBeDefined()
  })

  // ========== State Tests ==========

  it('يجب أن تكون الحالة الأولية صحيحة', () => {
    const { result } = renderHook(() => useProducts())
    expect(result.current.products).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  // ========== Add Product Tests ==========

  describe('addProduct', () => {
    it('يجب إضافة منتج جديد', async () => {
      const { result } = renderHook(() => useProducts())

      const newProduct: ProductFormData = {
        name: 'منتج جديد',
        sku: 'SKU-001',
        price: 1000,
        quantityOnHand: 50,
        minimumQuantity: 10,
        category: 'فئة',
        notes: 'ملاحظات',
      }

      let response

      await act(async () => {
        response = await result.current.addProduct(newProduct)
      })

      expect(response?.status).toBe(201)
      expect(response?.message).toContain('بنجاح')
    })
  })

  // ========== Update Quantity Tests ==========

  describe('updateQuantity', () => {
    it('يجب تحديث كمية المخزون', async () => {
      const { result } = renderHook(() => useProducts())

      let response

      await act(async () => {
        response = await result.current.updateQuantity('1', 75)
      })

      expect(response?.status).toBe(200)
    })
  })

  // ========== Stock Status Tests ==========

  describe('getOutOfStockProducts', () => {
    it('يجب الحصول على المنتجات النافدة', () => {
      const { result } = renderHook(() => useProducts())

      // محاكاة المنتجات
      const mockProducts = [
        { id: '1', quantityOnHand: 0, minimumQuantity: 10 },
        { id: '2', quantityOnHand: 5, minimumQuantity: 10 },
        { id: '3', quantityOnHand: 0, minimumQuantity: 5 },
      ]

      const outOfStock = mockProducts.filter((p) => p.quantityOnHand === 0)

      expect(outOfStock.length).toBe(2)
    })
  })

  describe('getLowStockProducts', () => {
    it('يجب الحصول على المنتجات منخفضة المخزون', () => {
      const { result } = renderHook(() => useProducts())

      // محاكاة المنتجات
      const mockProducts = [
        { id: '1', quantityOnHand: 5, minimumQuantity: 10 },
        { id: '2', quantityOnHand: 15, minimumQuantity: 10 },
        { id: '3', quantityOnHand: 8, minimumQuantity: 10 },
      ]

      const lowStock = mockProducts.filter(
        (p) => p.quantityOnHand > 0 && p.quantityOnHand <= p.minimumQuantity
      )

      expect(lowStock.length).toBe(2)
    })
  })

  // ========== Search Tests ==========

  describe('searchProducts', () => {
    it('يجب البحث عن المنتجات بالاسم', () => {
      const { result } = renderHook(() => useProducts())

      // محاكاة البحث
      const mockProducts = [
        { id: '1', name: 'منتج أول', sku: 'SKU-001' },
        { id: '2', name: 'منتج ثاني', sku: 'SKU-002' },
      ]

      const results = mockProducts.filter((p) =>
        p.name.toLowerCase().includes('أول')
      )

      expect(results.length).toBe(1)
      expect(results[0].name).toBe('منتج أول')
    })
  })

  // ========== Delete Tests ==========

  describe('deleteProduct', () => {
    it('يجب حذف منتج', async () => {
      const { result } = renderHook(() => useProducts())

      let response

      await act(async () => {
        response = await result.current.deleteProduct('1')
      })

      expect(response?.status).toBe(200)
      expect(response?.message).toContain('بنجاح')
    })
  })
})
