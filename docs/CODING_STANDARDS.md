# معايير الكود - Coding Standards

## 📌 الهدف

هذا الملف يحدد المعايير والقواعس التي يجب اتباعها عند كتابة الكود لضمان:
- ✅ الاتساق والوضوح
- ✅ سهولة الصيانة
- ✅ تجنب الأخطاء
- ✅ سهولة التعاون

---

## 1️⃣ تسمية الملفات والمجلدات

### المجلدات
```
✅ kebab-case للمجلدات
❌ camelCase أو PascalCase

مثال:
- components/
- auth-forms/
- dashboard-widgets/
```

### ملفات React Components
```
✅ PascalCase للمكونات
❌ kebab-case أو camelCase

مثال:
- UserProfile.tsx
- CustomerForm.tsx
- InvoiceTable.tsx
```

### ملفات Utilities و Hooks
```
✅ camelCase للـ utilities و hooks
❌ PascalCase

مثال:
- useAuth.ts
- useCustomers.ts
- formatCurrency.ts
- calculateLiquidity.ts
```

### ملفات الأنواع
```
✅ PascalCase للـ types
❌ lowercase

مثال:
- types/User.ts
- types/Invoice.ts
- types/Database.ts
```

---

## 2️⃣ هيكل المكونات (Components)

### مثال كامل لمكون:

```typescript
/**
 * CustomerForm Component
 * 
 * الوصف:
 * مكون نموذج لإضافة أو تعديل عميل
 * 
 * الخصائص:
 * - customer?: Customer - بيانات العميل (للتعديل)
 * - onSubmit: (data: CustomerFormData) => void - دالة الإرسال
 * - isLoading?: boolean - حالة التحميل
 * 
 * الاستخدام:
 * <CustomerForm onSubmit={handleSubmit} />
 * <CustomerForm customer={customer} onSubmit={handleUpdate} />
 */

'use client'

import React, { FC } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// ==================== Types ====================
/**
 * بيانات نموذج العميل
 */
interface CustomerFormData {
  name: string
  phone: string
  email?: string
  address?: string
  creditLimit: number
}

interface CustomerFormProps {
  customer?: CustomerFormData
  onSubmit: (data: CustomerFormData) => Promise<void>
  isLoading?: boolean
}

// ==================== Schema ====================
/**
 * التحقق من صحة بيانات النموذج
 */
const customerSchema = z.object({
  name: z.string().min(2, 'الاسم مطلوب'),
  phone: z.string().min(10, 'رقم الهاتف غير صحيح'),
  email: z.string().email().optional(),
  address: z.string().optional(),
  creditLimit: z.number().min(0, 'الحد الائتماني يجب أن يكون موجب'),
})

// ==================== Component ====================
const CustomerForm: FC<CustomerFormProps> = ({
  customer,
  onSubmit,
  isLoading = false,
}) => {
  // ========== Hooks ==========
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: customer || {
      name: '',
      phone: '',
      email: '',
      address: '',
      creditLimit: 0,
    },
  })

  // ========== Handlers ==========
  /**
   * معالج إرسال النموذج
   */
  const handleFormSubmit = async (data: CustomerFormData) => {
    try {
      await onSubmit(data)
      reset()
    } catch (error) {
      console.error('خطأ في إرسال النموذج:', error)
    }
  }

  // ========== Render ==========
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* حقل الاسم */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          اسم العميل *
        </label>
        <Input
          id="name"
          placeholder="أدخل اسم العميل"
          {...register('name')}
          disabled={isLoading}
          aria-invalid={errors.name ? 'true' : 'false'}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* حقل الهاتف */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-2">
          رقم الهاتف *
        </label>
        <Input
          id="phone"
          placeholder="أدخل رقم الهاتف"
          {...register('phone')}
          disabled={isLoading}
          aria-invalid={errors.phone ? 'true' : 'false'}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
        )}
      </div>

      {/* زر الإرسال */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'جاري الحفظ...' : customer ? 'تحديث' : 'إضافة'}
      </Button>
    </form>
  )
}

export default CustomerForm
```

---

## 3️⃣ تسمية المتغيرات والدوال

### المتغيرات
```typescript
// ✅ واضحة وموصوفة
const userEmail = 'user@example.com'
const totalInvoices = 150
const isLoading = false
const customerList = []

// ❌ غير واضحة
const e = 'user@example.com'
const t = 150
const l = false
const c = []
```

### الدوال
```typescript
// ✅ تبدأ بفعل
function calculateTotalLiquidity() {}
function fetchCustomers() {}
function validateInvoiceData() {}
function formatCurrencyToArabic() {}

// ❌ غير واضحة
function liquidity() {}
function get() {}
function check() {}
function format() {}
```

### Booleans
```typescript
// ✅ تبدأ بـ is, has, can, should
const isLoading = false
const hasError = true
const canDelete = true
const shouldShowAlert = false

// ❌ غير واضحة
const loading = false
const error = true
const delete = true
```

---

## 4️⃣ التعليقات والتوثيق

### تعليقات الدوال
```typescript
/**
 * حساب إجمالي السيولة المتاحة
 * 
 * @param invoices - قائمة الفواتير
 * @param payments - قائمة المدفوعات
 * @returns إجمالي السيولة
 * 
 * @example
 * const liquidity = calculateLiquidity(invoices, payments)
 */
function calculateLiquidity(
  invoices: Invoice[],
  payments: Payment[]
): number {
  // ...
}
```

### تعليقات الكود المعقد
```typescript
// ✅ شرح واضح
// حساب السيولة المتوقعة في الأيام القادمة
// بناءً على تواريخ استحقاق الفواتير
const expectedLiquidity = invoices
  .filter(inv => inv.dueDate <= tomorrow)
  .reduce((sum, inv) => sum + inv.amount, 0)

// ❌ تعليق غير مفيد
// حلقة على الفواتير
const expectedLiquidity = invoices
  .filter(inv => inv.dueDate <= tomorrow)
  .reduce((sum, inv) => sum + inv.amount, 0)
```

### تعليقات الأقسام
```typescript
// ========== Hooks ==========
// استخدم هذا للفصل بين الأقسام المختلفة

// ========== Handlers ==========

// ========== Effects ==========

// ========== Render ==========
```

---

## 5️⃣ معالجة الأخطاء

### Try-Catch
```typescript
// ✅ معالجة واضحة
try {
  const data = await fetchCustomers()
  setCustomers(data)
} catch (error) {
  console.error('خطأ في جلب العملاء:', error)
  showErrorNotification('فشل تحميل العملاء')
}

// ❌ معالجة سيئة
try {
  const data = await fetchCustomers()
  setCustomers(data)
} catch (error) {
  console.log(error)
}
```

### Validation
```typescript
// ✅ التحقق من الصحة
if (!email || !email.includes('@')) {
  throw new Error('البريد الإلكتروني غير صحيح')
}

// ❌ بدون تحقق
const user = createUser(email)
```

---

## 6️⃣ الأنواع (Types)

### تعريف الأنواع
```typescript
// ✅ واضحة وموصوفة
interface Customer {
  /** معرف العميل الفريد */
  id: string
  /** اسم العميل */
  name: string
  /** رقم الهاتف */
  phone: string
  /** الحد الائتماني */
  creditLimit: number
  /** حالة العميل */
  status: 'active' | 'suspended' | 'defaulted'
  /** تاريخ الإنشاء */
  createdAt: Date
}

// ❌ غير واضحة
interface Customer {
  id: string
  n: string
  p: string
  cl: number
  s: string
  c: Date
}
```

---

## 7️⃣ الاستيراد والتصدير

### الترتيب الموصى به
```typescript
// 1. المكتبات الخارجية
import React, { FC, useState } from 'react'
import { useForm } from 'react-hook-form'

// 2. المكونات المحلية
import { Button } from '@/components/ui/button'
import CustomerForm from '@/components/customers/CustomerForm'

// 3. الأنواع
import type { Customer } from '@/types'

// 4. الـ Utilities
import { formatCurrency } from '@/lib/utils'

// 5. الثوابت
import { ALERT_TYPES } from '@/lib/constants'
```

---

## 8️⃣ معايير الأداء

### استخدام useMemo
```typescript
// ✅ تحسين الأداء
const totalLiquidity = useMemo(() => {
  return customers.reduce((sum, customer) => sum + customer.balance, 0)
}, [customers])

// ❌ إعادة حساب في كل render
const totalLiquidity = customers.reduce((sum, customer) => sum + customer.balance, 0)
```

### استخدام useCallback
```typescript
// ✅ منع إعادة إنشاء الدالة
const handleDelete = useCallback((id: string) => {
  deleteCustomer(id)
}, [])

// ❌ إعادة إنشاء في كل render
const handleDelete = (id: string) => {
  deleteCustomer(id)
}
```

---

## 9️⃣ الاختبار

### كتابة الاختبارات
```typescript
// ✅ اختبار واضح
describe('calculateLiquidity', () => {
  it('يجب أن يحسب السيولة بشكل صحيح', () => {
    const invoices = [
      { amount: 100, status: 'paid' },
      { amount: 50, status: 'pending' },
    ]
    const result = calculateLiquidity(invoices)
    expect(result).toBe(150)
  })
})

// ❌ اختبار غير واضح
describe('calc', () => {
  it('works', () => {
    const result = calc([100, 50])
    expect(result).toBe(150)
  })
})
```

---

## 🔟 القائمة التحققية

قبل الـ Commit، تأكد من:

- [ ] الكود يتبع معايير التسمية
- [ ] جميع الدوال موثقة بتعليقات واضحة
- [ ] لا توجد متغيرات غير مستخدمة
- [ ] معالجة الأخطاء موجودة
- [ ] الأنواع معرفة بوضوح
- [ ] الاختبارات موجودة وتمر
- [ ] الكود منسق بشكل صحيح
- [ ] لا توجد `console.log` في الكود النهائي

---

**ملاحظة:** هذه المعايير إلزامية لجميع المساهمين. عدم الالتزام قد يؤدي لرفض الـ Pull Request.
