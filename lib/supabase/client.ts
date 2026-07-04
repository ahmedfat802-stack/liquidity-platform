/**
 * Supabase Client - للاستخدام في المتصفح (Client-side)
 * 
 * هذا الملف ينشئ instance من Supabase للاستخدام في المتصفح
 * يستخدم في المكونات والـ Hooks
 */

import { createBrowserClient } from '@supabase/ssr'

/**
 * إنشاء Supabase Client للمتصفح
 * 
 * يجب استخدام هذا في:
 * - المكونات (Components)
 * - الـ Hooks
 * - الـ Client-side API calls
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!
  )
}

/**
 * Singleton instance من Supabase Client
 * استخدم هذا بدلاً من إنشاء instance جديد في كل مرة
 */
let supabaseClient: ReturnType<typeof createClient> | null = null

/**
 * الحصول على Supabase Client (Singleton)
 * 
 * @returns Supabase Client instance
 * 
 * @example
 * const supabase = getSupabaseClient()
 * const { data, error } = await supabase.from('customers').select()
 */
export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient()
  }
  return supabaseClient
}
