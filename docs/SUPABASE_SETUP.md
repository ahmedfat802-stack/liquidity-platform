# دليل إعداد Supabase

**التاريخ:** 4 يوليو 2026

---

## 📋 المتطلبات

- حساب Supabase (https://supabase.com)
- Supabase CLI (اختياري)
- Node.js و npm

---

## 🚀 خطوات الإعداد

### 1. إنشاء مشروع Supabase

1. اذهب إلى https://supabase.com
2. انقر على "New Project"
3. أدخل تفاصيل المشروع:
   - **Project Name:** liquidity-platform
   - **Database Password:** كلمة مرور قوية
   - **Region:** اختر المنطقة الأقرب (مثل eu-west-1)
4. انقر على "Create new project"

### 2. الحصول على المفاتيح

بعد إنشاء المشروع:

1. اذهب إلى **Settings** → **API**
2. انسخ:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

### 3. تشغيل الـ Migrations

#### الطريقة الأولى: عبر Supabase Dashboard

1. اذهب إلى **SQL Editor**
2. انقر على **New Query**
3. انسخ محتوى ملف `supabase/migrations/001_create_tables.sql`
4. الصق الكود وانقر على **Run**

#### الطريقة الثانية: عبر Supabase CLI

```bash
# تثبيت Supabase CLI
npm install -g supabase

# تسجيل الدخول
supabase login

# ربط المشروع
supabase link --project-ref your-project-ref

# تشغيل الـ Migrations
supabase migration up
```

### 4. إعداد Authentication

1. اذهب إلى **Authentication** → **Providers**
2. تأكد من تفعيل **Email**
3. اذهب إلى **Email Templates** وتحقق من الرسائل

### 5. إعداد Row Level Security (RLS)

جميع الـ RLS Policies موجودة في ملف الـ Migration.

تحقق من أنها تم إنشاؤها:

1. اذهب إلى **SQL Editor**
2. اكتب:
```sql
SELECT * FROM pg_policies WHERE tablename = 'customers';
```

### 6. إعداد Realtime (اختياري)

للحصول على تحديثات فورية:

1. اذهب إلى **Realtime** → **Replication**
2. فعّل الجداول التي تريد مراقبتها:
   - customers
   - invoices
   - products
   - alerts

---

## 🔐 إعدادات الأمان

### 1. تفعيل HTTPS

- تأكد من استخدام HTTPS في الإنتاج
- Supabase يفعل هذا تلقائياً

### 2. إعداد CORS

1. اذهب إلى **Settings** → **API**
2. أضف نطاقات CORS:
   ```
   https://your-domain.com
   https://www.your-domain.com
   ```

### 3. إعداد JWT Secrets

- Supabase يدير هذا تلقائياً
- لا تشارك `service_role secret` مع أحد

### 4. تفعيل Multi-Factor Authentication (MFA)

1. اذهب إلى **Authentication** → **Policies**
2. فعّل MFA للمستخدمين

---

## 📊 إدارة البيانات

### النسخ الاحتياطية

Supabase يقوم بـ:
- نسخ احتياطية يومية تلقائية
- الاحتفاظ بـ 30 يوم من النسخ

### استعادة البيانات

1. اذهب إلى **Settings** → **Backups**
2. اختر نسخة واستعيد منها

### تصدير البيانات

```bash
# تصدير جدول
supabase db pull

# تصدير كل البيانات
pg_dump -h db.your-project-ref.supabase.co -U postgres -d postgres > backup.sql
```

---

## 🔧 الصيانة

### مراقبة الأداء

1. اذهب إلى **Logs** → **API Logs**
2. راقب الطلبات البطيئة

### تنظيف البيانات

```sql
-- حذف الفواتير المحذوفة
DELETE FROM invoices WHERE deleted_at < NOW() - INTERVAL '30 days';

-- حذف الـ Alerts القديمة
DELETE FROM alerts WHERE created_at < NOW() - INTERVAL '90 days';
```

### تحديث الـ Policies

إذا احتجت لتعديل الـ RLS Policies:

1. اذهب إلى **SQL Editor**
2. عدّل الـ Policy
3. اختبر مع حسابات مختلفة

---

## 🐛 استكشاف الأخطاء

### خطأ: "Invalid JWT"

- تحقق من أن `NEXT_PUBLIC_SUPABASE_URL` و `NEXT_PUBLIC_SUPABASE_ANON_KEY` صحيحة
- امسح الـ Cookies وحاول مجدداً

### خطأ: "Permission denied"

- تحقق من أن RLS Policies صحيحة
- تأكد من أن `user_id` يطابق `auth.uid()`

### خطأ: "Database connection failed"

- تحقق من أن المشروع نشط
- تحقق من اتصالك بالإنترنت

---

## 📞 الدعم

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- GitHub Issues: https://github.com/supabase/supabase/issues

---

**الحالة:** جاهز للاستخدام ✅
