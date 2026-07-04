/**
 * دوال مساعدة لـ Supabase
 * 
 * هذا الملف يحتوي على دوال مساعدة شائعة للعمل مع Supabase
 */

import { getSupabaseClient } from './client'
import { getErrorMessage } from '../utils'
import type { ApiResponse } from '@/types'

// ==================== Authentication Helpers ====================

/**
 * الحصول على المستخدم الحالي
 * 
 * @returns بيانات المستخدم أو null
 * 
 * @example
 * const user = await getCurrentUser()
 * if (user) {
 *   console.log('المستخدم:', user.email)
 * }
 */
export async function getCurrentUser() {
  try {
    const supabase = getSupabaseClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      console.error('خطأ في جلب المستخدم الحالي:', error)
      return null
    }

    return user
  } catch (error) {
    console.error('خطأ غير متوقع:', error)
    return null
  }
}

/**
 * الحصول على جلسة المستخدم الحالية
 * 
 * @returns جلسة المستخدم أو null
 * 
 * @example
 * const session = await getSession()
 * if (session) {
 *   console.log('التوكن:', session.access_token)
 * }
 */
export async function getSession() {
  try {
    const supabase = getSupabaseClient()
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      console.error('خطأ في جلب الجلسة:', error)
      return null
    }

    return session
  } catch (error) {
    console.error('خطأ غير متوقع:', error)
    return null
  }
}

/**
 * التحقق من تسجيل دخول المستخدم
 * 
 * @returns true إذا كان المستخدم مسجل دخول
 * 
 * @example
 * if (await isAuthenticated()) {
 *   console.log('المستخدم مسجل دخول')
 * }
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return !!user
}

// ==================== Database Helpers ====================

/**
 * جلب البيانات من جدول معين
 * 
 * @param table - اسم الجدول
 * @param options - خيارات الاستعلام
 * @returns البيانات أو رسالة خطأ
 * 
 * @example
 * const response = await fetchFromTable('customers', {
 *   select: '*',
 *   eq: { user_id: userId }
 * })
 */
export async function fetchFromTable<T>(
  table: string,
  options?: {
    select?: string
    eq?: Record<string, any>
    limit?: number
    offset?: number
    order?: { column: string; ascending: boolean }
  }
): Promise<ApiResponse<T[]>> {
  try {
    const supabase = getSupabaseClient()

    let query = supabase.from(table).select(options?.select || '*')

    // تطبيق الفلاتر
    if (options?.eq) {
      Object.entries(options.eq).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }

    // تطبيق الترتيب
    if (options?.order) {
      query = query.order(options.order.column, {
        ascending: options.order.ascending,
      })
    }

    // تطبيق الحد والإزاحة
    if (options?.limit) {
      query = query.limit(options.limit)
    }
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) {
      return {
        status: 400,
        error: getErrorMessage(error),
      }
    }

    return {
      status: 200,
      data: data as T[],
    }
  } catch (error) {
    return {
      status: 500,
      error: getErrorMessage(error),
    }
  }
}

/**
 * إدراج بيانات في جدول معين
 * 
 * @param table - اسم الجدول
 * @param data - البيانات المراد إدراجها
 * @returns البيانات المدرجة أو رسالة خطأ
 * 
 * @example
 * const response = await insertIntoTable('customers', {
 *   name: 'أحمد',
 *   phone: '01001234567',
 *   user_id: userId
 * })
 */
export async function insertIntoTable<T>(
  table: string,
  data: Record<string, any>
): Promise<ApiResponse<T>> {
  try {
    const supabase = getSupabaseClient()

    const { data: insertedData, error } = await supabase
      .from(table)
      .insert([data])
      .select()
      .single()

    if (error) {
      return {
        status: 400,
        error: getErrorMessage(error),
      }
    }

    return {
      status: 201,
      data: insertedData as T,
      message: 'تم الإدراج بنجاح',
    }
  } catch (error) {
    return {
      status: 500,
      error: getErrorMessage(error),
    }
  }
}

/**
 * تحديث بيانات في جدول معين
 * 
 * @param table - اسم الجدول
 * @param id - معرف السجل
 * @param data - البيانات المراد تحديثها
 * @returns البيانات المحدثة أو رسالة خطأ
 * 
 * @example
 * const response = await updateInTable('customers', customerId, {
 *   name: 'محمد',
 *   phone: '01001234567'
 * })
 */
export async function updateInTable<T>(
  table: string,
  id: string,
  data: Record<string, any>
): Promise<ApiResponse<T>> {
  try {
    const supabase = getSupabaseClient()

    const { data: updatedData, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return {
        status: 400,
        error: getErrorMessage(error),
      }
    }

    return {
      status: 200,
      data: updatedData as T,
      message: 'تم التحديث بنجاح',
    }
  } catch (error) {
    return {
      status: 500,
      error: getErrorMessage(error),
    }
  }
}

/**
 * حذف بيانات من جدول معين
 * 
 * @param table - اسم الجدول
 * @param id - معرف السجل
 * @returns رسالة النجاح أو الخطأ
 * 
 * @example
 * const response = await deleteFromTable('customers', customerId)
 */
export async function deleteFromTable(
  table: string,
  id: string
): Promise<ApiResponse<null>> {
  try {
    const supabase = getSupabaseClient()

    const { error } = await supabase.from(table).delete().eq('id', id)

    if (error) {
      return {
        status: 400,
        error: getErrorMessage(error),
      }
    }

    return {
      status: 200,
      message: 'تم الحذف بنجاح',
    }
  } catch (error) {
    return {
      status: 500,
      error: getErrorMessage(error),
    }
  }
}

// ==================== Real-time Helpers ====================

/**
 * الاستماع للتغييرات في الجدول (Real-time)
 * 
 * @param table - اسم الجدول
 * @param callback - دالة يتم استدعاؤها عند حدوث تغيير
 * @returns دالة لإيقاف الاستماع
 * 
 * @example
 * const unsubscribe = subscribeToTable('customers', (payload) => {
 *   console.log('تغيير:', payload)
 * })
 * 
 * // لإيقاف الاستماع
 * unsubscribe()
 */
export function subscribeToTable(
  table: string,
  callback: (payload: any) => void
) {
  const supabase = getSupabaseClient()

  const subscription = supabase
    .channel(`public:${table}`)
    .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
    .subscribe()

  // إرجاع دالة لإيقاف الاستماع
  return () => {
    supabase.removeChannel(subscription)
  }
}
