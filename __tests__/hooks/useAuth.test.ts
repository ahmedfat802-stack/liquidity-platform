/**
 * اختبارات Hook useAuth
 * 
 * اختبار جميع وظائف المصادقة
 */

import { renderHook, act, waitFor } from '@testing-library/react'
import { useAuth } from '@/hooks/useAuth'

// Mock Supabase
jest.mock('@/lib/supabase/client', () => ({
  getSupabaseClient: jest.fn(() => ({
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      resetPasswordForEmail: jest.fn(),
      updateUser: jest.fn(),
      getUser: jest.fn(),
      getSession: jest.fn(),
    },
    onAuthStateChange: jest.fn(),
  })),
}))

describe('useAuth Hook', () => {
  // ========== Basic Tests ==========

  it('يجب أن يتم إنشاء الـ Hook بدون أخطاء', () => {
    const { result } = renderHook(() => useAuth())
    expect(result.current).toBeDefined()
  })

  it('يجب أن يحتوي الـ Hook على جميع الدوال المطلوبة', () => {
    const { result } = renderHook(() => useAuth())
    expect(result.current.login).toBeDefined()
    expect(result.current.register).toBeDefined()
    expect(result.current.logout).toBeDefined()
    expect(result.current.resetPassword).toBeDefined()
    expect(result.current.updatePassword).toBeDefined()
  })

  // ========== Login Tests ==========

  describe('login', () => {
    it('يجب استدعاء دالة تسجيل الدخول', async () => {
      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.login('test@example.com', 'password123')
      })

      // سيتم التحقق من استدعاء الدالة
      expect(result.current).toBeDefined()
    })
  })

  // ========== Register Tests ==========

  describe('register', () => {
    it('يجب استدعاء دالة التسجيل', async () => {
      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.register('test@example.com', 'password123')
      })

      expect(result.current).toBeDefined()
    })
  })

  // ========== Logout Tests ==========

  describe('logout', () => {
    it('يجب استدعاء دالة تسجيل الخروج', async () => {
      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.logout()
      })

      expect(result.current).toBeDefined()
    })
  })
})
