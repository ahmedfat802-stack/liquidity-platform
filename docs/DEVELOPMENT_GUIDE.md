# دليل التطوير الشامل

**آخر تحديث:** 4 يوليو 2026

---

## 📋 نظرة عامة

هذا الدليل يشرح كيفية العمل على المشروع والمعايير المتبعة.

---

## 🏗️ معمارية المشروع

```
liquidity-platform/
├── app/                    # صفحات Next.js
│   ├── (auth)/            # صفحات المصادقة
│   ├── (dashboard)/       # صفحات لوحة التحكم
│   ├── api/               # API Routes
│   ├── layout.tsx         # التخطيط الرئيسي
│   └── page.tsx           # الصفحة الرئيسية
├── components/            # المكونات
│   ├── auth/              # مكونات المصادقة
│   ├── customers/         # مكونات العملاء
│   ├── invoices/          # مكونات الفواتير
│   ├── products/          # مكونات المنتجات
│   ├── dashboard/         # مكونات لوحة التحكم
│   └── ui/                # مكونات UI عامة
├── hooks/                 # Custom Hooks
│   ├── useAuth.ts
│   ├── useCustomers.ts
│   ├── useInvoices.ts
│   └── useProducts.ts
├── lib/                   # دوال مساعدة
│   ├── supabase/          # Supabase Clients
│   ├── constants.ts       # الثوابت
│   └── utils.ts           # دوال مساعدة
├── store/                 # State Management (Zustand)
│   └── authStore.ts
├── styles/                # الأنماط
│   └── globals.css
├── types/                 # أنواع TypeScript
│   └── index.ts
└── docs/                  # التوثيق
```

---

## 🚀 البدء السريع

### 1. الإعداد الأولي

```bash
# استنساخ المشروع
git clone <repo-url>
cd liquidity-platform

# تثبيت المكتبات
npm install

# إنشاء ملف .env.local
cp .env.example .env.local

# ملء متغيرات البيئة
# NEXT_PUBLIC_SUPABASE_URL=
# NEXT_PUBLIC_SUPABASE_ANON_KEY=
# SUPABASE_SERVICE_ROLE_KEY=
```

### 2. تشغيل المشروع

```bash
# تشغيل خادم التطوير
npm run dev

# الوصول إلى التطبيق
# http://localhost:3000
```

---

## 📝 معايير الكود

### 1. التعليقات

```typescript
/**
 * وصف الدالة
 * 
 * شرح تفصيلي إذا لزم الأمر
 * 
 * @param param1 - وصف المعامل
 * @returns وصف القيمة المرجعة
 * 
 * @example
 * const result = myFunction('value')
 */
export function myFunction(param1: string): string {
  // تعليق للعملية المعقدة
  return param1.toUpperCase()
}
```

### 2. الأنواع

استخدم TypeScript دائماً:

```typescript
// ✅ صحيح
interface User {
  id: string
  email: string
}

// ❌ خطأ
const user = { id: '1', email: 'test@example.com' }
```

### 3. معالجة الأخطاء

```typescript
try {
  // العملية
  const result = await someAsyncOperation()
  return result
} catch (error) {
  // معالجة الخطأ
  const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف'
  console.error('وصف الخطأ:', error)
  throw new Error(errorMessage)
}
```

### 4. الرسائل بالعربية

جميع الرسائل والتسميات يجب أن تكون بالعربية:

```typescript
// ✅ صحيح
const message = 'تم إضافة العميل بنجاح'

// ❌ خطأ
const message = 'Customer added successfully'
```

---

## 🎨 معايير التصميم

### 1. استخدام Tailwind CSS

```tsx
// ✅ صحيح
<div className="flex items-center justify-between p-4 bg-primary text-white rounded-lg">
  <h1 className="text-xl font-bold">العنوان</h1>
</div>

// ❌ خطأ
<div style={{ display: 'flex', padding: '16px' }}>
  <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>العنوان</h1>
</div>
```

### 2. استخدام shadcn Components

```tsx
// ✅ صحيح
import { Button } from '@/components/ui/button'

<Button variant="primary">إضافة</Button>

// ❌ خطأ
<button className="px-4 py-2 bg-blue-500">إضافة</button>
```

### 3. الألوان والمتغيرات

استخدم متغيرات CSS المعرفة:

```css
/* ✅ صحيح */
.card {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  border: 1px solid hsl(var(--border));
}

/* ❌ خطأ */
.card {
  background-color: #ffffff;
  color: #000000;
  border: 1px solid #cccccc;
}
```

---

## 🔌 العمل مع Supabase

### 1. استخدام Client-side

```typescript
'use client'

import { getSupabaseClient } from '@/lib/supabase/client'

export function MyComponent() {
  const supabase = getSupabaseClient()

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('user_id', userId)

    if (error) throw error
    return data
  }
}
```

### 2. استخدام Server-side

```typescript
import { createServerClient } from '@/lib/supabase/server'

export async function getCustomers() {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('customers')
    .select('*')

  if (error) throw error
  return data
}
```

### 3. استخدام Admin Client

```typescript
import { getAdminClient } from '@/lib/supabase/admin'

// فقط في API Routes أو Server Actions
export async function deleteUserData(userId: string) {
  const supabase = getAdminClient()

  const { error } = await supabase.auth.admin.deleteUser(userId)
  if (error) throw error
}
```

---

## 🪝 العمل مع Hooks

### 1. إنشاء Custom Hook

```typescript
'use client'

import { useCallback, useState } from 'react'

export function useMyHook() {
  const [state, setState] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const doSomething = useCallback(async (param: string) => {
    try {
      setIsLoading(true)
      setError(null)

      // العملية
      const result = await someAsyncOperation(param)

      setState(result)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { state, isLoading, error, doSomething }
}
```

### 2. استخدام Hook

```typescript
'use client'

import { useMyHook } from '@/hooks/useMyHook'

export function MyComponent() {
  const { state, isLoading, error, doSomething } = useMyHook()

  return (
    <div>
      {error && <p className="text-destructive">{error}</p>}
      {isLoading && <p>جاري التحميل...</p>}
      {state && <p>{state}</p>}
      <button onClick={() => doSomething('value')}>تنفيذ</button>
    </div>
  )
}
```

---

## 📦 إنشاء مكون جديد

### 1. البنية الأساسية

```typescript
/**
 * MyComponent Component
 * 
 * وصف المكون
 * 
 * الخصائص:
 * - prop1: string - وصف
 * - prop2?: boolean - وصف (اختياري)
 * 
 * الاستخدام:
 * <MyComponent prop1="value" />
 */

'use client'

import React, { FC } from 'react'

// ==================== Types ====================

interface MyComponentProps {
  prop1: string
  prop2?: boolean
}

// ==================== Component ====================

const MyComponent: FC<MyComponentProps> = ({ prop1, prop2 = false }) => {
  // ========== Render ==========

  return (
    <div>
      <p>{prop1}</p>
      {prop2 && <p>خاصية اختيارية</p>}
    </div>
  )
}

export default MyComponent
```

### 2. استيراد المكون

```typescript
import MyComponent from '@/components/MyComponent'

export function Page() {
  return <MyComponent prop1="value" />
}
```

---

## 🧪 الاختبار

### 1. اختبار يدوي

- اختبر جميع الحالات (النجاح، الخطأ، التحميل)
- اختبر على أجهزة مختلفة
- اختبر في المتصفحات المختلفة

### 2. اختبار الأداء

```bash
# فحص الأداء
npm run build

# قياس الأداء
npm run analyze
```

---

## 🔒 الأمان

### 1. حماية البيانات الحساسة

```typescript
// ❌ لا تكشف المفاتيح السرية
const apiKey = 'sk_live_...'

// ✅ استخدم متغيرات البيئة
const apiKey = process.env.SECRET_API_KEY
```

### 2. التحقق من الصلاحيات

```typescript
// ✅ تحقق دائماً من هوية المستخدم
const { data: { user } } = await supabase.auth.getUser()
if (!user) throw new Error('غير مصرح')

// تحقق من ملكية البيانات
const { data } = await supabase
  .from('customers')
  .select()
  .eq('user_id', user.id)
```

---

## 📚 الموارد المفيدة

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [React Documentation](https://react.dev)

---

## 🆘 استكشاف الأخطاء

### المشكلة: الصفحة بيضاء

```bash
# 1. تحقق من الـ Console للأخطاء
# 2. تحقق من الـ Network tab
# 3. أعد تشغيل خادم التطوير
npm run dev
```

### المشكلة: Supabase غير متصل

```bash
# 1. تحقق من متغيرات البيئة
# 2. تحقق من الاتصال بالإنترنت
# 3. تحقق من صحة المفاتيح
```

### المشكلة: أخطاء في الـ Build

```bash
# 1. حذف node_modules و .next
rm -rf node_modules .next

# 2. إعادة تثبيت المكتبات
npm install

# 3. إعادة البناء
npm run build
```

---

## ✅ قائمة التحقق قبل الـ Commit

- [ ] الكود يعمل بدون أخطاء
- [ ] لا توجد رسائل تحذير في الـ Console
- [ ] التعليقات واضحة
- [ ] الأنواع محددة بشكل صحيح
- [ ] الرسائل بالعربية
- [ ] معالجة الأخطاء موجودة
- [ ] الاختبار اليدوي نجح

---

**آخر تحديث:** 4 يوليو 2026
