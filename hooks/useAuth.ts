/**
 * useAuth Hook
 * 
 * Hook مخصص لإدارة المصادقة والعمليات المتعلقة بها
 */

'use client'

import { useCallback, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/authStore'
import type { LoginData, RegisterData, User } from '@/types'

/**
 * Hook useAuth
 * 
 * يوفر دوال للمصادقة والتحكم بجلسة المستخدم
 * 
 * @returns دوال المصادقة والحالة
 * 
 * @example
 * const { login, logout, user, isLoading } = useAuth()
 * 
 * const handleLogin = async () => {
 *   await login({ email: 'test@example.com', password: '123456' })
 * }
 */
export function useAuth() {
  const router = useRouter()
  const supabase = getSupabaseClient()

  // ========== Store ==========
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const setUser = useAuthStore((state) => state.setUser)
  const setToken = useAuthStore((state) => state.setToken)
  const setRefreshToken = useAuthStore((state) => state.setRefreshToken)
  const setIsLoading = useAuthStore((state) => state.setIsLoading)
  const setError = useAuthStore((state) => state.setError)
  const authLogout = useAuthStore((state) => state.logout)

  // ========== Local State ==========
  const [isLoading, setLocalIsLoading] = useState(false)
  const [error, setLocalError] = useState<string | null>(null)

  // ========== Effects ==========

  /**
   * التحقق من جلسة المستخدم عند تحميل المكون
   */
  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          // تحديث الـ Store
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            businessName: session.user.user_metadata?.business_name || '',
            phone: session.user.user_metadata?.phone,
            createdAt: new Date(session.user.created_at),
            updatedAt: new Date(session.user.updated_at || session.user.created_at),
          })
          setToken(session.access_token)
          setRefreshToken(session.refresh_token || null)
        }
      } catch (error) {
        console.error('خطأ في التحقق من الجلسة:', error)
      }
    }

    checkSession()
  }, [supabase, setUser, setToken, setRefreshToken])

  // ========== Auth Functions ==========

  /**
   * تسجيل الدخول
   * 
   * @param data - بيانات تسجيل الدخول
   * @returns true إذا نجح التسجيل
   */
  const login = useCallback(
    async (data: LoginData): Promise<boolean> => {
      try {
        setLocalIsLoading(true)
        setLocalError(null)
        setIsLoading(true)

        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        })

        if (authError) {
          throw new Error(authError.message)
        }

        if (!authData.session || !authData.user) {
          throw new Error('فشل تسجيل الدخول')
        }

        // تحديث الـ Store
        setUser({
          id: authData.user.id,
          email: authData.user.email || '',
          businessName: authData.user.user_metadata?.business_name || '',
          phone: authData.user.user_metadata?.phone,
          createdAt: new Date(authData.user.created_at),
          updatedAt: new Date(authData.user.updated_at || authData.user.created_at),
        })
        setToken(authData.session.access_token)
        setRefreshToken(authData.session.refresh_token || null)

        // إعادة التوجيه
        router.push('/dashboard')

        return true
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'خطأ في تسجيل الدخول'
        setLocalError(errorMessage)
        setError(errorMessage)
        return false
      } finally {
        setLocalIsLoading(false)
        setIsLoading(false)
      }
    },
    [supabase, setUser, setToken, setRefreshToken, setIsLoading, setError, router]
  )

  /**
   * التسجيل (إنشاء حساب جديد)
   * 
   * @param data - بيانات التسجيل
   * @returns true إذا نجح التسجيل
   */
  const register = useCallback(
    async (data: RegisterData): Promise<boolean> => {
      try {
        setLocalIsLoading(true)
        setLocalError(null)
        setIsLoading(true)

        // إنشاء حساب جديد
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              business_name: data.businessName,
              phone: data.phone,
            },
          },
        })

        if (authError) {
          throw new Error(authError.message)
        }

        if (!authData.user) {
          throw new Error('فشل التسجيل')
        }

        // رسالة نجاح
        setLocalError(null)

        // إعادة التوجيه إلى صفحة تسجيل الدخول
        router.push('/login?message=تم التسجيل بنجاح. يرجى تسجيل الدخول.')

        return true
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'خطأ في التسجيل'
        setLocalError(errorMessage)
        setError(errorMessage)
        return false
      } finally {
        setLocalIsLoading(false)
        setIsLoading(false)
      }
    },
    [supabase, setIsLoading, setError, router]
  )

  /**
   * تسجيل الخروج
   * 
   * @returns true إذا نجح تسجيل الخروج
   */
  const logout = useCallback(async (): Promise<boolean> => {
    try {
      setLocalIsLoading(true)
      setLocalError(null)

      const { error } = await supabase.auth.signOut()

      if (error) {
        throw new Error(error.message)
      }

      // تنظيف الـ Store
      authLogout()

      // إعادة التوجيه
      router.push('/login')

      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ في تسجيل الخروج'
      setLocalError(errorMessage)
      return false
    } finally {
      setLocalIsLoading(false)
    }
  }, [supabase, authLogout, router])

  /**
   * استعادة كلمة المرور
   * 
   * @param email - البريد الإلكتروني
   * @returns true إذا نجحت الطلب
   */
  const resetPassword = useCallback(
    async (email: string): Promise<boolean> => {
      try {
        setLocalIsLoading(true)
        setLocalError(null)

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        })

        if (error) {
          throw new Error(error.message)
        }

        return true
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'خطأ في استعادة كلمة المرور'
        setLocalError(errorMessage)
        return false
      } finally {
        setLocalIsLoading(false)
      }
    },
    [supabase]
  )

  /**
   * تحديث كلمة المرور
   * 
   * @param newPassword - كلمة المرور الجديدة
   * @returns true إذا نجح التحديث
   */
  const updatePassword = useCallback(
    async (newPassword: string): Promise<boolean> => {
      try {
        setLocalIsLoading(true)
        setLocalError(null)

        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        })

        if (error) {
          throw new Error(error.message)
        }

        return true
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'خطأ في تحديث كلمة المرور'
        setLocalError(errorMessage)
        return false
      } finally {
        setLocalIsLoading(false)
      }
    },
    [supabase]
  )

  // ========== Return ==========

  return {
    // State
    user,
    token,
    isLoading,
    error,
    isAuthenticated: !!user,

    // Methods
    login,
    register,
    logout,
    resetPassword,
    updatePassword,
  }
}
