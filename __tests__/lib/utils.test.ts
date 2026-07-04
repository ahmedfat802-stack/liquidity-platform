/**
 * اختبارات دوال Utilities
 * 
 * اختبار جميع الدوال المساعدة
 */

import {
  formatCurrency,
  formatDate,
  daysUntilDue,
  isValidPhone,
  cn,
} from '@/lib/utils'

describe('Utility Functions', () => {
  // ========== formatCurrency Tests ==========

  describe('formatCurrency', () => {
    it('يجب تنسيق العملة بشكل صحيح', () => {
      expect(formatCurrency(1000)).toBe('1,000.00 ج.م')
      expect(formatCurrency(1000.5)).toBe('1,000.50 ج.م')
      expect(formatCurrency(0)).toBe('0.00 ج.م')
    })

    it('يجب التعامل مع الأرقام السالبة', () => {
      expect(formatCurrency(-1000)).toBe('-1,000.00 ج.م')
    })

    it('يجب التعامل مع الأرقام الكبيرة', () => {
      expect(formatCurrency(1000000)).toBe('1,000,000.00 ج.م')
    })
  })

  // ========== formatDate Tests ==========

  describe('formatDate', () => {
    it('يجب تنسيق التاريخ بشكل صحيح', () => {
      const date = new Date('2026-07-04')
      const result = formatDate(date)
      expect(result).toContain('2026')
    })

    it('يجب التعامل مع تاريخ صحيح', () => {
      const date = new Date('2026-01-01')
      expect(formatDate(date)).toBeDefined()
    })
  })

  // ========== daysUntilDue Tests ==========

  describe('daysUntilDue', () => {
    it('يجب حساب الأيام المتبقية بشكل صحيح', () => {
      const today = new Date()
      const tomorrow = new Date(today.getTime() + 86400000)
      const days = daysUntilDue(tomorrow)
      expect(days).toBe(1)
    })

    it('يجب إرجاع رقم سالب للتواريخ الماضية', () => {
      const today = new Date()
      const yesterday = new Date(today.getTime() - 86400000)
      const days = daysUntilDue(yesterday)
      expect(days).toBeLessThan(0)
    })
  })

  // ========== isValidPhone Tests ==========

  describe('isValidPhone', () => {
    it('يجب قبول أرقام هاتف صحيحة', () => {
      expect(isValidPhone('01001234567')).toBe(true)
      expect(isValidPhone('01234567890')).toBe(true)
    })

    it('يجب رفض أرقام هاتف غير صحيحة', () => {
      expect(isValidPhone('123')).toBe(false)
      expect(isValidPhone('abc')).toBe(false)
      expect(isValidPhone('')).toBe(false)
    })
  })

  // ========== cn Tests ==========

  describe('cn', () => {
    it('يجب دمج الـ Classes بشكل صحيح', () => {
      expect(cn('px-2', 'py-1')).toBe('px-2 py-1')
    })

    it('يجب إزالة الـ Classes المكررة', () => {
      expect(cn('px-2', 'px-4')).toContain('px-4')
    })

    it('يجب التعامل مع القيم الفارغة', () => {
      expect(cn('px-2', '', 'py-1')).toBe('px-2 py-1')
    })
  })
})
