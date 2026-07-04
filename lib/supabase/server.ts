/**
 * Supabase Server Client - للاستخدام في الخادم (Server-side)
 * 
 * هذا الملف ينشئ instance من Supabase للاستخدام في الخادم
 * يستخدم في:
 * - API Routes
 * - Server Components
 * - Server Actions
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * إنشاء Supabase Server Client
 * 
 * يجب استخدام هذا في:
 * - API Routes
 * - Server Components
 * - Server Actions
 * 
 * @returns Supabase Server Client instance
 * 
 * @example
 * const supabase = createServerClient()
 * const { data, error } = await supabase.from('customers').select()
 */
export function createServerClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        /**
         * الحصول على قيمة الـ Cookie
         */
        get(name: string) {
          return cookieStore.get(name)?.value
        },

        /**
         * تعيين قيمة الـ Cookie
         */
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set(name, value, options)
          } catch (error) {
            // معالجة الأخطاء (قد تحدث في بعض الحالات)
            console.error('خطأ في تعيين الـ Cookie:', error)
          }
        },

        /**
         * حذف الـ Cookie
         */
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set(name, '', { ...options, maxAge: 0 })
          } catch (error) {
            console.error('خطأ في حذف الـ Cookie:', error)
          }
        },
      },
    }
  )
}
