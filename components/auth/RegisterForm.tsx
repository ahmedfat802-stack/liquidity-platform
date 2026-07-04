/**
 * RegisterForm Component
 * 
 * مكون نموذج التسجيل (إنشاء حساب جديد)
 * 
 * الخصائص:
 * - onSuccess?: () => void - دالة يتم استدعاؤها عند النجاح
 * 
 * الاستخدام:
 * <RegisterForm onSuccess={() => router.push('/login')} />
 */

'use client'

import React, { FC, useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { NAVIGATION_LINKS, VALIDATION_RULES } from '@/lib/constants'
import { cn } from '@/lib/utils'

// ==================== Types ====================

interface RegisterFormProps {
  /** دالة يتم استدعاؤها عند النجاح */
  onSuccess?: () => void
}

// ==================== Schema ====================

/**
 * التحقق من صحة بيانات التسجيل
 */
const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, 'البريد الإلكتروني مطلوب')
      .email('البريد الإلكتروني غير صحيح'),
    businessName: z
      .string()
      .min(VALIDATION_RULES.NAME_MIN_LENGTH, 'اسم المتجر قصير جداً')
      .max(VALIDATION_RULES.NAME_MAX_LENGTH, 'اسم المتجر طويل جداً'),
    phone: z
      .string()
      .min(VALIDATION_RULES.PHONE_MIN_LENGTH, 'رقم الهاتف غير صحيح')
      .max(VALIDATION_RULES.PHONE_MAX_LENGTH, 'رقم الهاتف غير صحيح'),
    password: z
      .string()
      .min(VALIDATION_RULES.PASSWORD_MIN_LENGTH, 'كلمة المرور قصيرة جداً')
      .max(VALIDATION_RULES.PASSWORD_MAX_LENGTH, 'كلمة المرور طويلة جداً'),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((val) => val, 'يجب الموافقة على الشروط'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'كلمات المرور غير متطابقة',
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

// ==================== Component ====================

const RegisterForm: FC<RegisterFormProps> = ({ onSuccess }) => {
  // ========== Hooks ==========
  const { register: registerUser, isLoading, error: authError } = useAuth()
  const [localError, setLocalError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      businessName: '',
      phone: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
  })

  // ========== Handlers ==========

  /**
   * معالج إرسال النموذج
   */
  const handleFormSubmit = async (data: RegisterFormData) => {
    try {
      setLocalError(null)
      setSuccessMessage(null)

      // استدعاء دالة التسجيل
      const success = await registerUser({
        email: data.email,
        password: data.password,
        businessName: data.businessName,
        phone: data.phone,
      })

      if (success) {
        setSuccessMessage('تم التسجيل بنجاح! يرجى تسجيل الدخول.')
        reset()
        setTimeout(() => {
          onSuccess?.()
        }, 2000)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ في التسجيل'
      setLocalError(errorMessage)
    }
  }

  // ========== Render ==========

  const isRegistering = isLoading || isSubmitting
  const displayError = localError || authError

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* رسالة الخطأ */}
      {displayError && (
        <div className="alert alert-error">
          <p className="text-sm">{displayError}</p>
        </div>
      )}

      {/* رسالة النجاح */}
      {successMessage && (
        <div className="alert alert-success">
          <p className="text-sm">{successMessage}</p>
        </div>
      )}

      {/* حقل البريد الإلكتروني */}
      <div className="space-y-2">
        <label htmlFor="email" className="label">
          البريد الإلكتروني *
        </label>
        <input
          id="email"
          type="email"
          placeholder="أدخل بريدك الإلكتروني"
          className={cn('input', errors.email && 'border-destructive')}
          {...register('email')}
          disabled={isRegistering}
          aria-invalid={errors.email ? 'true' : 'false'}
        />
        {errors.email && (
          <p className="text-destructive text-sm">{errors.email.message}</p>
        )}
      </div>

      {/* حقل اسم المتجر */}
      <div className="space-y-2">
        <label htmlFor="businessName" className="label">
          اسم المتجر *
        </label>
        <input
          id="businessName"
          type="text"
          placeholder="أدخل اسم متجرك"
          className={cn('input', errors.businessName && 'border-destructive')}
          {...register('businessName')}
          disabled={isRegistering}
          aria-invalid={errors.businessName ? 'true' : 'false'}
        />
        {errors.businessName && (
          <p className="text-destructive text-sm">{errors.businessName.message}</p>
        )}
      </div>

      {/* حقل رقم الهاتف */}
      <div className="space-y-2">
        <label htmlFor="phone" className="label">
          رقم الهاتف *
        </label>
        <input
          id="phone"
          type="tel"
          placeholder="أدخل رقم هاتفك"
          className={cn('input', errors.phone && 'border-destructive')}
          {...register('phone')}
          disabled={isRegistering}
          aria-invalid={errors.phone ? 'true' : 'false'}
        />
        {errors.phone && (
          <p className="text-destructive text-sm">{errors.phone.message}</p>
        )}
      </div>

      {/* حقل كلمة المرور */}
      <div className="space-y-2">
        <label htmlFor="password" className="label">
          كلمة المرور *
        </label>
        <input
          id="password"
          type="password"
          placeholder="أدخل كلمة المرور (8 أحرف على الأقل)"
          className={cn('input', errors.password && 'border-destructive')}
          {...register('password')}
          disabled={isRegistering}
          aria-invalid={errors.password ? 'true' : 'false'}
        />
        {errors.password && (
          <p className="text-destructive text-sm">{errors.password.message}</p>
        )}
      </div>

      {/* حقل تأكيد كلمة المرور */}
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="label">
          تأكيد كلمة المرور *
        </label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="أعد إدخال كلمة المرور"
          className={cn('input', errors.confirmPassword && 'border-destructive')}
          {...register('confirmPassword')}
          disabled={isRegistering}
          aria-invalid={errors.confirmPassword ? 'true' : 'false'}
        />
        {errors.confirmPassword && (
          <p className="text-destructive text-sm">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* حقل الموافقة على الشروط */}
      <div className="flex items-center gap-2">
        <input
          id="agreeToTerms"
          type="checkbox"
          className="w-4 h-4"
          {...register('agreeToTerms')}
          disabled={isRegistering}
          aria-invalid={errors.agreeToTerms ? 'true' : 'false'}
        />
        <label htmlFor="agreeToTerms" className="text-sm text-muted cursor-pointer">
          أوافق على{' '}
          <Link href="/terms" className="text-primary hover:underline">
            الشروط والأحكام
          </Link>
        </label>
      </div>
      {errors.agreeToTerms && (
        <p className="text-destructive text-sm">{errors.agreeToTerms.message}</p>
      )}

      {/* زر التسجيل */}
      <button
        type="submit"
        disabled={isRegistering}
        className="btn btn-primary btn-full"
      >
        {isRegistering ? 'جاري التسجيل...' : 'إنشاء حساب'}
      </button>

      {/* رابط تسجيل الدخول */}
      <p className="text-center text-sm text-muted">
        هل لديك حساب بالفعل؟{' '}
        <Link href={NAVIGATION_LINKS.LOGIN} className="text-primary hover:underline">
          تسجيل الدخول
        </Link>
      </p>
    </form>
  )
}

export default RegisterForm
