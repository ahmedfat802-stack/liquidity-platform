/**
 * دوال مساعدة عامة
 * 
 * هذا الملف يحتوي على دوال مساعدة مستخدمة في جميع أنحاء المشروع
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, isBefore, differenceInDays } from 'date-fns'
import { ar } from 'date-fns/locale'
import { CURRENCY, DATE_FORMATS, INVOICE_THRESHOLDS } from './constants'

// ==================== Class Merging ====================

/**
 * دمج أسماء الفئات (classes) بشكل آمن
 * 
 * تجمع بين clsx و tailwind-merge لتجنب تضارب الأنماط
 * 
 * @param inputs - أسماء الفئات
 * @returns أسماء الفئات المدمجة
 * 
 * @example
 * cn('px-2 py-1', 'px-4') // 'py-1 px-4'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ==================== Currency Formatting ====================

/**
 * تنسيق المبلغ بصيغة العملة المصرية
 * 
 * @param amount - المبلغ
 * @returns المبلغ المنسق (مثال: 1,234.56 ج.م)
 * 
 * @example
 * formatCurrency(1234.56) // '1,234.56 ج.م'
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: CURRENCY.CODE,
    minimumFractionDigits: CURRENCY.DECIMAL_PLACES,
    maximumFractionDigits: CURRENCY.DECIMAL_PLACES,
  }).format(amount)
}

/**
 * تنسيق المبلغ بدون رمز العملة
 * 
 * @param amount - المبلغ
 * @returns المبلغ المنسق (مثال: 1,234.56)
 * 
 * @example
 * formatAmount(1234.56) // '1,234.56'
 */
export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('ar-EG', {
    minimumFractionDigits: CURRENCY.DECIMAL_PLACES,
    maximumFractionDigits: CURRENCY.DECIMAL_PLACES,
  }).format(amount)
}

/**
 * تحويل النص إلى رقم
 * 
 * @param value - القيمة النصية
 * @returns الرقم أو 0 إذا كانت القيمة غير صحيحة
 * 
 * @example
 * parseAmount('1234.56') // 1234.56
 */
export function parseAmount(value: string): number {
  const parsed = parseFloat(value)
  return isNaN(parsed) ? 0 : parsed
}

// ==================== Date Formatting ====================

/**
 * تنسيق التاريخ بالعربية
 * 
 * @param date - التاريخ
 * @param formatStr - صيغة التنسيق (اختياري)
 * @returns التاريخ المنسق
 * 
 * @example
 * formatDate(new Date()) // '04/07/2026'
 */
export function formatDate(date: Date | string, formatStr: string = DATE_FORMATS.DISPLAY): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return format(dateObj, formatStr, { locale: ar })
  } catch (error) {
    console.error('خطأ في تنسيق التاريخ:', error)
    return ''
  }
}

/**
 * تنسيق التاريخ والوقت بالعربية
 * 
 * @param date - التاريخ
 * @returns التاريخ والوقت المنسق
 * 
 * @example
 * formatDateTime(new Date()) // '04/07/2026 14:30'
 */
export function formatDateTime(date: Date | string): string {
  return formatDate(date, DATE_FORMATS.DISPLAY_WITH_TIME)
}

/**
 * حساب الوقت المنقضي منذ التاريخ المعطى (مثال: منذ ساعة)
 * 
 * @param date - التاريخ
 * @returns الوقت المنقضي
 * 
 * @example
 * formatDistanceToNowArabic(new Date(Date.now() - 3600000)) // 'منذ ساعة'
 */
export function formatDistanceToNowArabic(date: Date | string): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return formatDistanceToNow(dateObj, { locale: ar, addSuffix: true })
  } catch (error) {
    console.error('خطأ في حساب الوقت المنقضي:', error)
    return ''
  }
}

// ==================== Invoice Status ====================

/**
 * حساب حالة الفاتورة بناءً على تاريخ الاستحقاق والدفع
 * 
 * @param dueDate - تاريخ الاستحقاق
 * @param paidAmount - المبلغ المدفوع
 * @param totalAmount - المبلغ الإجمالي
 * @returns حالة الفاتورة
 * 
 * @example
 * calculateInvoiceStatus(new Date('2026-07-01'), 100, 100) // 'paid'
 */
export function calculateInvoiceStatus(
  dueDate: Date | string,
  paidAmount: number,
  totalAmount: number
): 'paid' | 'pending' | 'overdue' {
  // إذا كانت مدفوعة بالكامل
  if (paidAmount >= totalAmount) {
    return 'paid'
  }

  // إذا كان التاريخ في الماضي
  const now = new Date()
  const dueDateObj = typeof dueDate === 'string' ? new Date(dueDate) : dueDate

  if (isBefore(dueDateObj, now)) {
    return 'overdue'
  }

  return 'pending'
}

/**
 * حساب عدد الأيام المتبقية حتى الاستحقاق
 * 
 * @param dueDate - تاريخ الاستحقاق
 * @returns عدد الأيام (سالب إذا كانت متأخرة)
 * 
 * @example
 * daysUntilDue(new Date(Date.now() + 86400000)) // 1
 */
export function daysUntilDue(dueDate: Date | string): number {
  const dueDateObj = typeof dueDate === 'string' ? new Date(dueDate) : dueDate
  return differenceInDays(dueDateObj, new Date())
}

/**
 * التحقق مما إذا كانت الفاتورة مستحقة قريباً
 * 
 * @param dueDate - تاريخ الاستحقاق
 * @returns true إذا كانت مستحقة في الأيام القادمة
 * 
 * @example
 * isDueSoon(new Date(Date.now() + 86400000)) // true
 */
export function isDueSoon(dueDate: Date | string): boolean {
  const days = daysUntilDue(dueDate)
  return days <= INVOICE_THRESHOLDS.DUE_SOON_DAYS && days >= 0
}

/**
 * التحقق مما إذا كانت الفاتورة متأخرة
 * 
 * @param dueDate - تاريخ الاستحقاق
 * @returns true إذا كانت متأخرة
 * 
 * @example
 * isOverdue(new Date(Date.now() - 86400000)) // true
 */
export function isOverdue(dueDate: Date | string): boolean {
  const days = daysUntilDue(dueDate)
  return days < 0
}

// ==================== Validation ====================

/**
 * التحقق من صحة البريد الإلكتروني
 * 
 * @param email - البريد الإلكتروني
 * @returns true إذا كان صحيحاً
 * 
 * @example
 * isValidEmail('test@example.com') // true
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * التحقق من صحة رقم الهاتف
 * 
 * @param phone - رقم الهاتف
 * @returns true إذا كان صحيحاً
 * 
 * @example
 * isValidPhone('01001234567') // true
 */
export function isValidPhone(phone: string): boolean {
  // رقم هاتف مصري (10-20 رقم)
  const phoneRegex = /^[\d+\-\s()]{10,20}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

/**
 * التحقق من صحة المبلغ
 * 
 * @param amount - المبلغ
 * @returns true إذا كان صحيحاً
 * 
 * @example
 * isValidAmount(100) // true
 */
export function isValidAmount(amount: number): boolean {
  return !isNaN(amount) && amount >= 0 && amount <= 999999999
}

// ==================== String Utilities ====================

/**
 * قص النص إلى طول معين وإضافة نقاط
 * 
 * @param text - النص
 * @param length - الطول المطلوب
 * @returns النص المقصوص
 * 
 * @example
 * truncate('هذا نص طويل جداً', 10) // 'هذا نص ...'
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

/**
 * تحويل النص إلى حالة العنوان (Title Case)
 * 
 * @param text - النص
 * @returns النص بحالة العنوان
 * 
 * @example
 * toTitleCase('hello world') // 'Hello World'
 */
export function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * تحويل النص إلى kebab-case
 * 
 * @param text - النص
 * @returns النص بصيغة kebab-case
 * 
 * @example
 * toKebabCase('Hello World') // 'hello-world'
 */
export function toKebabCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
}

// ==================== Array Utilities ====================

/**
 * إزالة العناصر المكررة من المصفوفة
 * 
 * @param array - المصفوفة
 * @param key - المفتاح (اختياري، للكائنات)
 * @returns المصفوفة بدون تكرار
 * 
 * @example
 * unique([1, 2, 2, 3]) // [1, 2, 3]
 */
export function unique<T>(array: T[], key?: keyof T): T[] {
  if (key) {
    const seen = new Set()
    return array.filter(item => {
      const value = item[key]
      if (seen.has(value)) return false
      seen.add(value)
      return true
    })
  }
  return Array.from(new Set(array))
}

/**
 * تجميع عناصر المصفوفة بناءً على مفتاح معين
 * 
 * @param array - المصفوفة
 * @param key - المفتاح
 * @returns كائن مع المجموعات
 * 
 * @example
 * groupBy([{type: 'a', val: 1}, {type: 'b', val: 2}], 'type')
 * // { a: [{type: 'a', val: 1}], b: [{type: 'b', val: 2}] }
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key])
    if (!result[groupKey]) {
      result[groupKey] = []
    }
    result[groupKey].push(item)
    return result
  }, {} as Record<string, T[]>)
}

// ==================== Object Utilities ====================

/**
 * دمج كائنين بشكل عميق
 * 
 * @param target - الكائن الهدف
 * @param source - كائن المصدر
 * @returns الكائن المدمج
 * 
 * @example
 * deepMerge({a: 1}, {b: 2}) // {a: 1, b: 2}
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target }

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key]
      const targetValue = result[key]

      if (
        sourceValue &&
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue) &&
        targetValue &&
        typeof targetValue === 'object' &&
        !Array.isArray(targetValue)
      ) {
        result[key] = deepMerge(targetValue, sourceValue)
      } else {
        result[key] = sourceValue as any
      }
    }
  }

  return result
}

// ==================== Error Handling ====================

/**
 * استخراج رسالة الخطأ من كائن الخطأ
 * 
 * @param error - كائن الخطأ
 * @returns رسالة الخطأ
 * 
 * @example
 * getErrorMessage(new Error('Something went wrong'))
 * // 'Something went wrong'
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'حدث خطأ غير متوقع'
}

// ==================== Async Utilities ====================

/**
 * تأخير التنفيذ بمدة معينة
 * 
 * @param ms - المدة بالميلي ثانية
 * @returns Promise
 * 
 * @example
 * await delay(1000) // ينتظر ثانية واحدة
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * تنفيذ دالة مع إعادة محاولة في حالة الفشل
 * 
 * @param fn - الدالة
 * @param retries - عدد المحاولات
 * @param delay - التأخير بين المحاولات
 * @returns نتيجة الدالة
 * 
 * @example
 * await retry(() => fetchData(), 3, 1000)
 */
export async function retry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (retries <= 0) throw error
    await delay(delayMs)
    return retry(fn, retries - 1, delayMs)
  }
}

// ==================== Type Guards ====================

/**
 * التحقق مما إذا كان الكائن فارغاً
 * 
 * @param obj - الكائن
 * @returns true إذا كان فارغاً
 * 
 * @example
 * isEmpty({}) // true
 */
export function isEmpty(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0
}

/**
 * التحقق مما إذا كانت القيمة موجودة (ليست null أو undefined)
 * 
 * @param value - القيمة
 * @returns true إذا كانت موجودة
 * 
 * @example
 * isDefined('hello') // true
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}
