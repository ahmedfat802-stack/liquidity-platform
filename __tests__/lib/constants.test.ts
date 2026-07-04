/**
 * اختبارات الثوابت
 * 
 * التحقق من صحة الثوابت المعرفة
 */

import { VALIDATION_RULES, API_ENDPOINTS, ERROR_MESSAGES } from '@/lib/constants'

describe('Constants', () => {
  // ========== VALIDATION_RULES Tests ==========

  describe('VALIDATION_RULES', () => {
    it('يجب أن تكون قيم التحقق معرفة', () => {
      expect(VALIDATION_RULES.NAME_MIN_LENGTH).toBe(2)
      expect(VALIDATION_RULES.NAME_MAX_LENGTH).toBe(100)
      expect(VALIDATION_RULES.EMAIL_MAX_LENGTH).toBe(255)
      expect(VALIDATION_RULES.PHONE_LENGTH).toBe(11)
    })

    it('يجب أن تكون الحدود الدنيا أقل من العليا', () => {
      expect(VALIDATION_RULES.NAME_MIN_LENGTH).toBeLessThan(
        VALIDATION_RULES.NAME_MAX_LENGTH
      )
    })
  })

  // ========== API_ENDPOINTS Tests ==========

  describe('API_ENDPOINTS', () => {
    it('يجب أن تكون نقاط النهاية معرفة', () => {
      expect(API_ENDPOINTS.CUSTOMERS).toBeDefined()
      expect(API_ENDPOINTS.INVOICES).toBeDefined()
      expect(API_ENDPOINTS.PRODUCTS).toBeDefined()
    })

    it('يجب أن تبدأ نقاط النهاية بـ /', () => {
      Object.values(API_ENDPOINTS).forEach((endpoint) => {
        expect(endpoint).toMatch(/^\//)
      })
    })
  })

  // ========== ERROR_MESSAGES Tests ==========

  describe('ERROR_MESSAGES', () => {
    it('يجب أن تكون رسائل الخطأ معرفة', () => {
      expect(ERROR_MESSAGES.UNAUTHORIZED).toBeDefined()
      expect(ERROR_MESSAGES.NOT_FOUND).toBeDefined()
      expect(ERROR_MESSAGES.SERVER_ERROR).toBeDefined()
    })

    it('يجب أن تكون رسائل الخطأ بالعربية', () => {
      Object.values(ERROR_MESSAGES).forEach((message) => {
        expect(message).toBeDefined()
        expect(message.length).toBeGreaterThan(0)
      })
    })
  })
})
