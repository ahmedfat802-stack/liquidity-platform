/**
 * Supabase Admin Client - للعمليات الإدارية
 * 
 * هذا الملف ينشئ instance من Supabase مع صلاحيات Admin
 * يستخدم فقط في الخادم للعمليات الحساسة
 * 
 * ⚠️ تحذير: لا تستخدم هذا في الـ Client-side
 * ⚠️ لا تكشف SUPABASE_SERVICE_ROLE_KEY في الـ Frontend
 */

import { createClient } from '@supabase/supabase-js'

/**
 * إنشاء Supabase Admin Client
 * 
 * يجب استخدام هذا فقط في:
 * - API Routes الحساسة
 * - Server Actions الحساسة
 * - العمليات الإدارية
 * 
 * ⚠️ لا تستخدم هذا في الـ Client-side
 * 
 * @returns Supabase Admin Client instance
 * 
 * @example
 * const supabase = createAdminClient()
 * const { data, error } = await supabase.auth.admin.listUsers()
 */
export function createAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY غير معرّف')
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

/**
 * Singleton instance من Admin Client
 */
let adminClient: ReturnType<typeof createAdminClient> | null = null

/**
 * الحصول على Admin Client (Singleton)
 * 
 * ⚠️ لا تستخدم هذا في الـ Client-side
 * 
 * @returns Supabase Admin Client instance
 */
export function getAdminClient() {
  if (!adminClient) {
    adminClient = createAdminClient()
  }
  return adminClient
}
