/**
 * CustomerForm Component
 * 
 * مكون نموذج إضافة/تعديل العميل
 * 
 * الخصائص:
 * - customer?: Customer - بيانات العميل (للتعديل)
 * - onSuccess?: () => void - دالة يتم استدعاؤها عند النجاح
 * - onCancel?: () => void - دالة يتم استدعاؤها عند الإلغاء
 */

'use client'

import React, { FC, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCustomers } from '@/hooks/useCustomers'
import { VALIDATION_RULES } from '@/lib/constants'
import { cn, isValidPhone } from '@/lib/utils'
import type { Customer, CustomerFormData } from '@/types'

// ==================== Types ====================

interface CustomerFormProps {
  /** بيانات العميل (للتعديل) */
  customer?: Customer
  /** دالة يتم استدعاؤها عند النجاح */
  onSuccess?: () => void
  /** دالة يتم استدعاؤها عند الإلغاء */
  onCancel?: () => void
}

// ==================== Schema ====================

/**
 * التحقق من صحة بيانات العميل
 */
const customerSchema = z.object({
  name: z
    .string()
    .min(VALIDATION_RULES.NAME_MIN_LENGTH, 'اسم العميل قصير جداً')
    .max(VALIDATION_RULES.NAME_MAX_LENGTH, 'اسم العميل طويل جداً'),
  phone: z
    .string()
    .refine(isValidPhone, 'رقم الهاتف غير صحيح'),
  email: z
    .string()
    .email('البريد الإلكتروني غير صحيح')
    .optional()
    .or(z.literal('')),
  address: z
    .string()
    .optional()
    .or(z.literal('')),
  creditLimit: z
    .number()
    .min(0, 'الحد الائتماني لا يمكن أن يكون سالباً')
    .max(999999999, 'الحد الائتماني كبير جداً'),
})

type CustomerFormDataSchema = z.infer<typeof customerSchema>

// ==================== Component ====================

const CustomerForm: FC<CustomerFormProps> = ({ customer, onSuccess, onCancel }) => {
  // ========== Hooks ==========
  const { addCustomer, updateCustomer } = useCustomers()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CustomerFormDataSchema>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
      creditLimit: 0,
    },
  })

  // ========== Effects ==========

  /**
   * تعيين بيانات العميل في النموذج عند التعديل
   */
  useEffect(() => {
    if (customer) {
      setValue('name', customer.name)
      setValue('phone', customer.phone)
      setValue('email', customer.email || '')
      setValue('address', customer.address || '')
      setValue('creditLimit', customer.creditLimit)
    }
  }, [customer, setValue])

  // ========== Handlers ==========

  /**
   * معالج إرسال النموذج
   */
  const handleFormSubmit = async (data: CustomerFormDataSchema) => {
    try {
      setIsSubmitting(true)
      setSubmitError(null)

      const formData: CustomerFormData = {
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        address: data.address || undefined,
        creditLimit: data.creditLimit,
      }

      let response

      if (customer) {
        // تعديل عميل موجود
        response = await updateCustomer(customer.id, formData)
      } else {
        // إضافة عميل جديد
        response = await addCustomer(formData)
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
      {/* رسالة الخطأ */}
      {submitError && (
        <div className="alert alert-error">
          <p className="text-sm">{submitError}</p>
        </div>
      )}

      {/* حقل الاسم */}
      <div className="space-y-2">
        <label htmlFor="name" className="label">
          اسم العميل *
        </label>
        <input
          id="name"
          type="text"
          placeholder="أدخل اسم العميل"
          className={cn('input', errors.name && 'border-destructive')}
          {...register('name')}
          disabled={isSubmitting}
          aria-invalid={errors.name ? 'true' : 'false'}
        />
        {errors.name && (
          <p className="text-destructive text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* حقل الهاتف */}
      <div className="space-y-2">
        <label htmlFor="phone" className="label">
          رقم الهاتف *
        </label>
        <input
          id="phone"
          type="tel"
          placeholder="أدخل رقم الهاتف"
          className={cn('input', errors.phone && 'border-destructive')}
          {...register('phone')}
          disabled={isSubmitting}
          aria-invalid={errors.phone ? 'true' : 'false'}
        />
        {errors.phone && (
          <p className="text-destructive text-sm">{errors.phone.message}</p>
        )}
      </div>

      {/* حقل البريد الإلكتروني */}
      <div className="space-y-2">
        <label htmlFor="email" className="label">
          البريد الإلكتروني
        </label>
        <input
          id="email"
          type="email"
          placeholder="أدخل البريد الإلكتروني (اختياري)"
          className={cn('input', errors.email && 'border-destructive')}
          {...register('email')}
          disabled={isSubmitting}
          aria-invalid={errors.email ? 'true' : 'false'}
        />
        {errors.email && (
          <p className="text-destructive text-sm">{errors.email.message}</p>
        )}
      </div>

      {/* حقل العنوان */}
      <div className="space-y-2">
        <label htmlFor="address" className="label">
          العنوان
        </label>
        <textarea
          id="address"
          placeholder="أدخل العنوان (اختياري)"
          className={cn('input', errors.address && 'border-destructive')}
          {...register('address')}
          disabled={isSubmitting}
          rows={3}
          aria-invalid={errors.address ? 'true' : 'false'}
        />
        {errors.address && (
          <p className="text-destructive text-sm">{errors.address.message}</p>
        )}
      </div>

      {/* حقل الحد الائتماني */}
      <div className="space-y-2">
        <label htmlFor="creditLimit" className="label">
          الحد الائتماني (ج.م) *
        </label>
        <input
          id="creditLimit"
          type="number"
          placeholder="أدخل الحد الائتماني"
          className={cn('input', errors.creditLimit && 'border-destructive')}
          {...register('creditLimit', { valueAsNumber: true })}
          disabled={isSubmitting}
          min="0"
          step="1"
          aria-invalid={errors.creditLimit ? 'true' : 'false'}
        />
        {errors.creditLimit && (
          <p className="text-destructive text-sm">{errors.creditLimit.message}</p>
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
            : customer
              ? 'تحديث العميل'
              : 'إضافة عميل'}
        </button>
      </div>
    </form>
  )
}

export default CustomerForm
