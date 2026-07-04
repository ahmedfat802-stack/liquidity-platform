/**
 * LoginForm Component
 * 
 * مكون نموذج تسجيل الدخول
 * 
 * الخصائص:
 * - onSuccess?: () => void - دالة يتم استدعاؤها عند النجاح
 * 
 * الاستخدام:
 * <LoginForm onSuccess={() => router.push('/dashboard')} />
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

interface LoginFormProps {
  /** دالة يتم استدعاؤها عند النجاح */
  onSuccess?: () => void
}

// ==================== Schema ====================

/**
 * التحقق من صحة بيانات تسجيل الدخول
 */
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'البريد الإلكتروني مطلوب')
    .email('البريد الإلكتروني غير صحيح'),
  password: z
    .string()
    .min(VALIDATION_RULES.PASSWORD_MIN_LENGTH, 'كلمة المرور قصيرة جداً'),
})

type LoginFormData = z.infer<typeof loginSchema>

// ==================== Component ====================

const LoginForm: FC<LoginFormProps> = ({ onSuccess }) => {
  // ========== Hooks ==========
  const { login, isLoading, error: authError } = useAuth()
  const [localError, setLocalError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // ========== Handlers ==========

  /**
   * معالج إرسال النموذج
   */
  const handleFormSubmit = async (data: LoginFormData) => {
    try {
      setLocalError(null)

      // استدعاء دالة تسجيل الدخول
      const success = await login({
        email: data.email,
        password: data.password,
      })

      if (success) {
        reset()
        onSuccess?.()
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ في تسجيل الدخول'
      setLocalError(errorMessage)
    }
  }

  // ========== Render ==========

  const isLoggingIn = isLoading || isSubmitting
  const displayError = localError || authError

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* رسالة الخطأ */}
      {displayError && (
        <div className="alert alert-error">
          <p className="text-sm">{displayError}</p>
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
          disabled={isLoggingIn}
          aria-invalid={errors.email ? 'true' : 'false'}
        />
        {errors.email && (
          <p className="text-destructive text-sm">{errors.email.message}</p>
        )}
      </div>

      {/* حقل كلمة المرور */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="label">
            كلمة المرور *
          </label>
          <Link
            href="/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            هل نسيت كلمة المرور؟
          </Link>
        </div>
        <input
          id="password"
          type="password"
          placeholder="أدخل كلمة المرور"
          className={cn('input', errors.password && 'border-destructive')}
          {...register('password')}
          disabled={isLoggingIn}
          aria-invalid={errors.password ? 'true' : 'false'}
        />
        {errors.password && (
          <p className="text-destructive text-sm">{errors.password.message}</p>
        )}
      </div>

      {/* زر تسجيل الدخول */}
      <button
        type="submit"
        disabled={isLoggingIn}
        className="btn btn-primary btn-full"
      >
        {isLoggingIn ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
      </button>

      {/* رابط التسجيل */}
      <p className="text-center text-sm text-muted">
        ليس لديك حساب؟{' '}
        <Link href={NAVIGATION_LINKS.REGISTER} className="text-primary hover:underline">
          إنشاء حساب جديد
        </Link>
      </p>
    </form>
  )
}

export default LoginForm
