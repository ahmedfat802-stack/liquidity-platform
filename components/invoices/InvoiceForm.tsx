/**
 * InvoiceForm Component
 * 
 * مكون نموذج إضافة/تعديل الفاتورة
 */

'use client'

import React, { FC, useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useInvoices } from '@/hooks/useInvoices'
import { useCustomers } from '@/hooks/useCustomers'
import { useProducts } from '@/hooks/useProducts'
import { cn } from '@/lib/utils'
import type { Invoice, InvoiceFormData } from '@/types'

// ==================== Schema ====================

const invoiceItemSchema = z.object({
  productId: z.string().min(1, 'المنتج مطلوب'),
  quantity: z.number().min(1, 'الكمية لا يمكن أن تكون أقل من 1'),
  unitPrice: z.number().min(0, 'السعر لا يمكن أن يكون سالباً'),
})

const invoiceSchema = z.object({
  customerId: z.string().min(1, 'العميل مطلوب'),
  invoiceNumber: z.string().min(1, 'رقم الفاتورة مطلوب'),
  invoiceDate: z.string().min(1, 'تاريخ الفاتورة مطلوب'),
  dueDate: z.string().min(1, 'تاريخ الاستحقاق مطلوب'),
  items: z.array(invoiceItemSchema).min(1, 'يجب إضافة بند واحد على الأقل'),
  notes: z.string().optional(),
})

type InvoiceFormDataSchema = z.infer<typeof invoiceSchema>

// ==================== Types ====================

interface InvoiceFormProps {
  invoice?: Invoice
  onSuccess?: () => void
  onCancel?: () => void
}

// ==================== Component ====================

const InvoiceForm: FC<InvoiceFormProps> = ({ invoice, onSuccess, onCancel }) => {
  const { addInvoice, updateInvoice } = useInvoices()
  const { customers } = useCustomers()
  const { products } = useProducts()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<InvoiceFormDataSchema>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      customerId: '',
      invoiceNumber: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      items: [{ productId: '', quantity: 1, unitPrice: 0 }],
      notes: '',
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  const items = watch('items')

  // ========== Effects ==========

  useEffect(() => {
    if (invoice) {
      setValue('customerId', invoice.customerId)
      setValue('invoiceNumber', invoice.invoiceNumber)
      setValue('invoiceDate', invoice.invoiceDate.toString().split('T')[0])
      setValue('dueDate', invoice.dueDate.toString().split('T')[0])
      setValue('notes', invoice.notes || '')
    }
  }, [invoice, setValue])

  // ========== Handlers ==========

  const handleFormSubmit = async (data: InvoiceFormDataSchema) => {
    try {
      setIsSubmitting(true)
      setSubmitError(null)

      const formData: InvoiceFormData = {
        customerId: data.customerId,
        invoiceNumber: data.invoiceNumber,
        invoiceDate: new Date(data.invoiceDate),
        dueDate: new Date(data.dueDate),
        items: data.items,
        notes: data.notes,
      }

      let response

      if (invoice) {
        response = await updateInvoice(invoice.id, formData)
      } else {
        response = await addInvoice(formData)
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

  // ========== Calculations ==========

  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice || 0), 0)

  // ========== Render ==========

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {submitError && (
        <div className="alert alert-error">
          <p className="text-sm">{submitError}</p>
        </div>
      )}

      {/* البيانات الأساسية */}
      <div className="card">
        <h3 className="text-lg font-bold mb-4">البيانات الأساسية</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* العميل */}
          <div className="space-y-2">
            <label htmlFor="customerId" className="label">
              العميل *
            </label>
            <select
              id="customerId"
              className={cn('input', errors.customerId && 'border-destructive')}
              {...register('customerId')}
              disabled={isSubmitting}
            >
              <option value="">اختر عميل</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            {errors.customerId && (
              <p className="text-destructive text-sm">{errors.customerId.message}</p>
            )}
          </div>

          {/* رقم الفاتورة */}
          <div className="space-y-2">
            <label htmlFor="invoiceNumber" className="label">
              رقم الفاتورة *
            </label>
            <input
              id="invoiceNumber"
              type="text"
              placeholder="أدخل رقم الفاتورة"
              className={cn('input', errors.invoiceNumber && 'border-destructive')}
              {...register('invoiceNumber')}
              disabled={isSubmitting}
            />
            {errors.invoiceNumber && (
              <p className="text-destructive text-sm">{errors.invoiceNumber.message}</p>
            )}
          </div>

          {/* تاريخ الفاتورة */}
          <div className="space-y-2">
            <label htmlFor="invoiceDate" className="label">
              تاريخ الفاتورة *
            </label>
            <input
              id="invoiceDate"
              type="date"
              className={cn('input', errors.invoiceDate && 'border-destructive')}
              {...register('invoiceDate')}
              disabled={isSubmitting}
            />
            {errors.invoiceDate && (
              <p className="text-destructive text-sm">{errors.invoiceDate.message}</p>
            )}
          </div>

          {/* تاريخ الاستحقاق */}
          <div className="space-y-2">
            <label htmlFor="dueDate" className="label">
              تاريخ الاستحقاق *
            </label>
            <input
              id="dueDate"
              type="date"
              className={cn('input', errors.dueDate && 'border-destructive')}
              {...register('dueDate')}
              disabled={isSubmitting}
            />
            {errors.dueDate && (
              <p className="text-destructive text-sm">{errors.dueDate.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* البنود */}
      <div className="card">
        <h3 className="text-lg font-bold mb-4">بنود الفاتورة</h3>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="border border-border rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                {/* المنتج */}
                <div className="space-y-2">
                  <label htmlFor={`items.${index}.productId`} className="label">
                    المنتج *
                  </label>
                  <select
                    id={`items.${index}.productId`}
                    className={cn(
                      'input',
                      errors.items?.[index]?.productId && 'border-destructive'
                    )}
                    {...register(`items.${index}.productId`)}
                    disabled={isSubmitting}
                  >
                    <option value="">اختر منتج</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                  {errors.items?.[index]?.productId && (
                    <p className="text-destructive text-sm">
                      {errors.items[index]?.productId?.message}
                    </p>
                  )}
                </div>

                {/* الكمية */}
                <div className="space-y-2">
                  <label htmlFor={`items.${index}.quantity`} className="label">
                    الكمية *
                  </label>
                  <input
                    id={`items.${index}.quantity`}
                    type="number"
                    placeholder="0"
                    className={cn(
                      'input',
                      errors.items?.[index]?.quantity && 'border-destructive'
                    )}
                    {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                    disabled={isSubmitting}
                    min="1"
                  />
                  {errors.items?.[index]?.quantity && (
                    <p className="text-destructive text-sm">
                      {errors.items[index]?.quantity?.message}
                    </p>
                  )}
                </div>

                {/* السعر */}
                <div className="space-y-2">
                  <label htmlFor={`items.${index}.unitPrice`} className="label">
                    السعر *
                  </label>
                  <input
                    id={`items.${index}.unitPrice`}
                    type="number"
                    placeholder="0.00"
                    className={cn(
                      'input',
                      errors.items?.[index]?.unitPrice && 'border-destructive'
                    )}
                    {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                    disabled={isSubmitting}
                    min="0"
                    step="0.01"
                  />
                  {errors.items?.[index]?.unitPrice && (
                    <p className="text-destructive text-sm">
                      {errors.items[index]?.unitPrice?.message}
                    </p>
                  )}
                </div>

                {/* حذف */}
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={isSubmitting || fields.length === 1}
                    className="btn btn-danger btn-full"
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))}

          {errors.items && (
            <p className="text-destructive text-sm">{errors.items.message}</p>
          )}

          {/* إضافة بند */}
          <button
            type="button"
            onClick={() => append({ productId: '', quantity: 1, unitPrice: 0 })}
            disabled={isSubmitting}
            className="btn btn-outline btn-full"
          >
            + إضافة بند
          </button>
        </div>
      </div>

      {/* الملاحظات */}
      <div className="card">
        <h3 className="text-lg font-bold mb-4">ملاحظات إضافية</h3>
        <textarea
          placeholder="أضف أي ملاحظات على الفاتورة"
          className="input"
          {...register('notes')}
          disabled={isSubmitting}
          rows={3}
        />
      </div>

      {/* الملخص */}
      <div className="card bg-muted/50">
        <div className="flex justify-between items-center text-lg font-bold">
          <span>المبلغ الإجمالي:</span>
          <span>{totalAmount.toFixed(2)} ج.م</span>
        </div>
      </div>

      {/* الأزرار */}
      <div className="flex gap-2 justify-end">
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
            : invoice
              ? 'تحديث الفاتورة'
              : 'إضافة فاتورة'}
        </button>
      </div>
    </form>
  )
}

export default InvoiceForm
