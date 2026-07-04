/**
 * Auth Store - متجر المصادقة
 * 
 * يدير حالة المصادقة والمستخدم الحالي
 * استخدم Zustand لإدارة الحالة
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

/**
 * حالة Auth Store
 */
interface AuthState {
  // ========== State ==========
  /** المستخدم الحالي */
  user: User | null
  /** التوكن */
  token: string | null
  /** توكن التحديث */
  refreshToken: string | null
  /** هل جاري التحميل */
  isLoading: boolean
  /** رسالة الخطأ */
  error: string | null

  // ========== Actions ==========
  /** تعيين المستخدم */
  setUser: (user: User | null) => void
  /** تعيين التوكن */
  setToken: (token: string | null) => void
  /** تعيين توكن التحديث */
  setRefreshToken: (token: string | null) => void
  /** تعيين حالة التحميل */
  setIsLoading: (isLoading: boolean) => void
  /** تعيين رسالة الخطأ */
  setError: (error: string | null) => void
  /** تسجيل الدخول */
  login: (user: User, token: string, refreshToken: string) => void
  /** تسجيل الخروج */
  logout: () => void
  /** تحديث المستخدم */
  updateUser: (user: Partial<User>) => void
  /** إعادة تعيين الحالة */
  reset: () => void
}

/**
 * الحالة الافتراضية
 */
const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isLoading: false,
  error: null,
}

/**
 * Auth Store
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,

      // ========== Setters ==========

      /**
       * تعيين المستخدم
       */
      setUser: (user) => set({ user }),

      /**
       * تعيين التوكن
       */
      setToken: (token) => set({ token }),

      /**
       * تعيين توكن التحديث
       */
      setRefreshToken: (token) => set({ refreshToken: token }),

      /**
       * تعيين حالة التحميل
       */
      setIsLoading: (isLoading) => set({ isLoading }),

      /**
       * تعيين رسالة الخطأ
       */
      setError: (error) => set({ error }),

      // ========== Actions ==========

      /**
       * تسجيل الدخول
       * 
       * @param user - بيانات المستخدم
       * @param token - التوكن
       * @param refreshToken - توكن التحديث
       */
      login: (user, token, refreshToken) => {
        set({
          user,
          token,
          refreshToken,
          error: null,
        })
      },

      /**
       * تسجيل الخروج
       */
      logout: () => {
        set(initialState)
      },

      /**
       * تحديث بيانات المستخدم
       * 
       * @param updatedUser - البيانات المحدثة
       */
      updateUser: (updatedUser) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        }))
      },

      /**
       * إعادة تعيين الحالة
       */
      reset: () => {
        set(initialState)
      },
    }),
    {
      name: 'auth-store', // اسم المفتاح في localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
      }), // حفظ فقط هذه الحقول
    }
  )
)

/**
 * Hook للتحقق من تسجيل الدخول
 * 
 * @returns true إذا كان المستخدم مسجل دخول
 * 
 * @example
 * const isAuthenticated = useIsAuthenticated()
 */
export function useIsAuthenticated() {
  return useAuthStore((state) => !!state.user)
}

/**
 * Hook للحصول على المستخدم الحالي
 * 
 * @returns المستخدم الحالي أو null
 * 
 * @example
 * const user = useCurrentUser()
 */
export function useCurrentUser() {
  return useAuthStore((state) => state.user)
}

/**
 * Hook للحصول على التوكن
 * 
 * @returns التوكن أو null
 * 
 * @example
 * const token = useToken()
 */
export function useToken() {
  return useAuthStore((state) => state.token)
}
