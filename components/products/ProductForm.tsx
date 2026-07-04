/**
 * ProductForm Component
 * 
 * مكون نموذج إضافة/تعديل المنتج
 */

'use client'

import React, { FC, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useProducts } from '@/hooks/useProducts'
import { VALIDATION_RULES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { Product, ProductFormData } from '@/types'

// ==================== Schema ====================

const productSchema = z.object({
  name: z
    .string()
    .min(VALIDATION_RULES.NAME_MIN_LENGTH, 'اسم المنتج قصير جداً')
    .max(VALIDATION_RULES.NAME_MAX_LENGTH, 'اسم المنتج طويل جداً'),
  sku: z
    .string()
    .min(1, 'كود المنتج مطلوب')
    .max(50, 'كود المنتج طويل جداً'),
  price: z
    .number()
    .min(0, 'السعر لا يمكن أن يكون سالباً')
    .max(999999999, 'السعر كبير جداً'),
  quantityOnHand: z
    .number()
    .min(0, 'الكمية لا يمكن أن تكون سالبة')
    .max(999999, 'الكمية كبيرة جداً'),
  minimumQuantity: z
    .number()
    .min(0, 'الحد الأدنى لا يمكن أن يكون سالباً')
    .max(999999, 'الحد الأدنى كبير جداً'),
  category: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
})

type ProductFormDataSchema = z.infer<typeof productSchema>

// ==================== Types ====================

interface ProductFormProps {
  product?: Product
  onSuccess?: () => void
  onCancel?: () => void
}

// ==================== Component ====================

const ProductForm: FC<ProductFormProps> = ({ product, onSuccess, onCancel }) => {
  const { addProduct, updateProduct } = useProducts()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ProductFormDataSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      sku: '',
      price: 0,
      quantityOnHand: 0,
      minimumQuantity: 0,
      category: '',
      notes: '',
    },
  })

  // ========== Effects ==========

  useEffect(() => {
    if (product) {
      setValue('name', product.name)
      setValue('sku', product.sku)
      setValue('price', product.price)
      setValue('quantityOnHand', product.quantityOnHand)
      setValue('minimumQuantity', product.minimumQuantity)
      setValue('category', product.category || '')
      setValue('notes', product.notes || '')
    }
  }, [product, setValue])

  // ========== Handlers ==========

  const handleFormSubmit = async (data: ProductFormDataSchema) => {
    try {
      setIsSubmitting(true)
      setSubmitError(null)

      const formData: ProductFormData = {
        name: data.name,
        sku: data.sku,
        price: data.price,
        quantityOnHand: data.quantityOnHand,
        minimumQuantity: data.minimumQuantity,
        category: data.category || undefined,
        notes: data.notes || undefined,
      }

      let response

      if (product) {
        response = await updateProduct(product.id, formData)
      } else {
        response = await addProduct(formData)
      }

      if (response.status === 200 || response.status === 201) {
        reset()
        onSuccess?.()
      } else {
        setSubmitError(response.error || 'حدث خطأ')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ في معالجة النموذج'
      setSubmitError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // ========== Render ==========

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {submitError && (
        <div className="alert alert-error">
          <p className="text-sm">{submitError}</p>
        </div>
      )}

      {/* الاسم */}
      <div className="space-y-2">
        <label htmlFor="name" className="label">
          اسم المنتج *
        </label>
        <input
          id="name"
          type="text"
          placeholder="أدخل اسم المنتج"
          className={cn('input', errors.name && 'border-destructive')}
          {...register('name')}
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="text-destructive text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* الكود */}
      <div className="space-y-2">
        <label htmlFor="sku" className="label">
          كود المنتج (SKU) *
        </label>
        <input
          id="sku"
          type="text"
          placeholder="أدخل كود المنتج"
          className={cn('input', errors.sku && 'border-destructive')}
          {...register('sku')}
          disabled={isSubmitting}
        />
        {errors.sku && (
          <p className="text-destructive text-sm">{errors.sku.message}</p>
        )}
      </div>

      {/* السعر والكمية */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* السعر */}
        <div className="space-y-2">
          <label htmlFor="price" className="label">
            السعر (ج.م) *
          </label>
          <input
            id="price"
            type="number"
            placeholder="0.00"
            className={cn('input', errors.price && 'border-destructive')}
            {...register('price', { valueAsNumber: true })}
            disabled={isSubmitting}
            min="0"
            step="0.01"
          />
          {errors.price && (
            <p className="text-destructive text-sm">{errors.price.message}</p>
          )}
        </div>

        {/* الكمية */}
        <div className="space-y-2">
          <label htmlFor="quantityOnHand" className="label">
            الكمية الحالية *
          </label>
          <input
            id="quantityOnHand"
            type="number"
            placeholder="0"
            className={cn('input', errors.quantityOnHand && 'border-destructive')}
            {...register('quantityOnHand', { valueAsNumber: true })}
            disabled={isSubmitting}
            min="0"
          />
          {errors.quantityOnHand && (
            <p className="text-destructive text-sm">{errors.quantityOnHand.message}</p>
          )}
        </div>
      </div>

      {/* الحد الأدنى والفئة */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* الحد الأدنى */}
        <div className="space-y-2">
          <label htmlFor="minimumQuantity" className="label">
            الحد الأدنى للمخزون *
          </label>
          <input
            id="minimumQuantity"
            type="number"
            placeholder="0"
            className={cn('input', errors.minimumQuantity && 'border-destructive')}
            {...register('minimumQuantity', { valueAsNumber: true })}
            disabled={isSubmitting}
            min="0"
          />
          {errors.minimumQuantity && (
            <p className="text-destructive text-sm">{errors.minimumQuantity.message}</p>
          )}
        </div>

        {/* الفئة */}
        <div className="space-y-2">
          <label htmlFor="category" className="label">
            الفئة
          </label>
          <input
            id="category"
            type="text"
            placeholder="أدخل فئة المنتج (اختياري)"
            className={cn('input', errors.category && 'border-destructive')}
            {...register('category')}
            disabled={isSubmitting}
          />
          {errors.category && (
            <p className="text-destructive text-sm">{errors.category.message}</p>
          )}
        </div>
      </div>

      {/* الملاحظات */}
      <div className="space-y-2">
        <label htmlFor="notes" className="label">
          ملاحظات
        </label>
        <textarea
          id="notes"
          placeholder="أضف أي ملاحظات على المنتج (اختياري)"
          className={cn('input', errors.notes && 'border-destructive')}
          {...register('notes')}
          disabled={isSubmitting}
          rows={3}
        />
        {errors.notes && (
          <p className="text-destructive text-sm">{errors.notes.message}</p>
        )}
      </div>

      {/* الأزرار */}
      <div className="flex gap-2 justify-end pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="btn btn-outline"
        >
          إلغاء
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary"
        >
          {isSubmitting
            ? 'جاري الحفظ...'
            : product
              ? 'تحديث المنتج'
              : 'إضافة منتج'}
        </button>
      </div>
    </form>
  )
}

export default ProductForm
