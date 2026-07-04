/**
 * useProducts Hook
 * 
 * Hook مخصص لإدارة المنتجات والمخزون
 */

'use client'

import { useCallback, useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'
import { useCurrentUser } from '@/store/authStore'
import type { Product, ProductFormData, ApiResponse } from '@/types'

/**
 * Hook useProducts
 */
export function useProducts() {
  const supabase = getSupabaseClient()
  const user = useCurrentUser()

  // ========== State ==========
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ========== Effects ==========

  useEffect(() => {
    if (user?.id) {
      fetchProducts()
    }
  }, [user?.id])

  // ========== Functions ==========

  /**
   * جلب قائمة المنتجات
   */
  const fetchProducts = useCallback(async () => {
    if (!user?.id) return

    try {
      setIsLoading(true)
      setError(null)

      const { data, error: dbError } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (dbError) throw dbError

      setProducts((data as Product[]) || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ في جلب المنتجات'
      setError(errorMessage)
      console.error('خطأ في جلب المنتجات:', err)
    } finally {
      setIsLoading(false)
    }
  }, [user?.id, supabase])

  /**
   * الحصول على منتج واحد
   */
  const getProduct = useCallback(
    async (id: string): Promise<Product | null> => {
      try {
        const { data, error: dbError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .eq('user_id', user?.id)
          .single()

        if (dbError) throw dbError

        return (data as Product) || null
      } catch (err) {
        console.error('خطأ في جلب المنتج:', err)
        return null
      }
    },
    [user?.id, supabase]
  )

  /**
   * إضافة منتج جديد
   */
  const addProduct = useCallback(
    async (data: ProductFormData): Promise<ApiResponse<Product>> => {
      if (!user?.id) {
        return {
          status: 401,
          error: 'يجب تسجيل الدخول أولاً',
        }
      }

      try {
        setError(null)

        const { data: newProduct, error: dbError } = await supabase
          .from('products')
          .insert([
            {
              user_id: user.id,
              name: data.name,
              sku: data.sku,
              price: data.price,
              quantity_on_hand: data.quantityOnHand,
              minimum_quantity: data.minimumQuantity,
              category: data.category || null,
              notes: data.notes || null,
            },
          ])
          .select()
          .single()

        if (dbError) throw dbError

        setProducts([newProduct as Product, ...products])

        return {
          status: 201,
          data: newProduct as Product,
          message: 'تم إضافة المنتج بنجاح',
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'خطأ في إضافة المنتج'
        setError(errorMessage)
        return {
          status: 400,
          error: errorMessage,
        }
      }
    },
    [user?.id, supabase, products]
  )

  /**
   * تحديث المنتج
   */
  const updateProduct = useCallback(
    async (id: string, data: Partial<ProductFormData>): Promise<ApiResponse<Product>> => {
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
        if (data.sku) updateData.sku = data.sku
        if (data.price !== undefined) updateData.price = data.price
        if (data.quantityOnHand !== undefined) updateData.quantity_on_hand = data.quantityOnHand
        if (data.minimumQuantity !== undefined) updateData.minimum_quantity = data.minimumQuantity
        if (data.category !== undefined) updateData.category = data.category
        if (data.notes !== undefined) updateData.notes = data.notes

        const { data: updatedProduct, error: dbError } = await supabase
          .from('products')
          .update(updateData)
          .eq('id', id)
          .eq('user_id', user.id)
          .select()
          .single()

        if (dbError) throw dbError

        setProducts(
          products.map((p) => (p.id === id ? (updatedProduct as Product) : p))
        )

        return {
          status: 200,
          data: updatedProduct as Product,
          message: 'تم تحديث المنتج بنجاح',
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'خطأ في تحديث المنتج'
        setError(errorMessage)
        return {
          status: 400,
          error: errorMessage,
        }
      }
    },
    [user?.id, supabase, products]
  )

  /**
   * حذف منتج
   */
  const deleteProduct = useCallback(
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
          .from('products')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id)

        if (dbError) throw dbError

        setProducts(products.filter((p) => p.id !== id))

        return {
          status: 200,
          message: 'تم حذف المنتج بنجاح',
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'خطأ في حذف المنتج'
        setError(errorMessage)
        return {
          status: 400,
          error: errorMessage,
        }
      }
    },
    [user?.id, supabase, products]
  )

  /**
   * تحديث كمية المخزون
   */
  const updateQuantity = useCallback(
    async (id: string, quantity: number): Promise<ApiResponse<Product>> => {
      if (!user?.id) {
        return {
          status: 401,
          error: 'يجب تسجيل الدخول أولاً',
        }
      }

      try {
        const { data: updatedProduct, error: dbError } = await supabase
          .from('products')
          .update({ quantity_on_hand: quantity })
          .eq('id', id)
          .eq('user_id', user.id)
          .select()
          .single()

        if (dbError) throw dbError

        setProducts(
          products.map((p) => (p.id === id ? (updatedProduct as Product) : p))
        )

        return {
          status: 200,
          data: updatedProduct as Product,
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'خطأ في تحديث الكمية'
        return {
          status: 400,
          error: errorMessage,
        }
      }
    },
    [user?.id, supabase, products]
  )

  /**
   * البحث عن منتجات
   */
  const searchProducts = useCallback(
    (query: string): Product[] => {
      if (!query) return products

      const lowerQuery = query.toLowerCase()
      return products.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.sku.toLowerCase().includes(lowerQuery)
      )
    },
    [products]
  )

  /**
   * الحصول على المنتجات الناقصة
   */
  const getOutOfStockProducts = useCallback((): Product[] => {
    return products.filter((p) => p.quantityOnHand === 0)
  }, [products])

  /**
   * الحصول على المنتجات القريبة من النفاد
   */
  const getLowStockProducts = useCallback((): Product[] => {
    return products.filter(
      (p) => p.quantityOnHand > 0 && p.quantityOnHand <= p.minimumQuantity
    )
  }, [products])

  // ========== Return ==========

  return {
    products,
    isLoading,
    error,
    fetchProducts,
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    updateQuantity,
    searchProducts,
    getOutOfStockProducts,
    getLowStockProducts,
  }
}
