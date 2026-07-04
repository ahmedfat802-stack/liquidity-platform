# دليل النشر على Vercel

**التاريخ:** 4 يوليو 2026

---

## 📋 المتطلبات

- حساب GitHub (مع المشروع)
- حساب Vercel (https://vercel.com)
- Vercel CLI (اختياري)

---

## 🚀 خطوات النشر

### 1. إعداد GitHub Repository

```bash
# تهيئة Git (إذا لم يكن موجوداً)
cd /home/ubuntu/liquidity-platform
git init

# إضافة الملفات
git add .

# Commit الأول
git commit -m "Initial commit: Liquidity Platform v1.0.0"

# إنشاء Repository على GitHub
# ثم أضف Remote
git remote add origin https://github.com/your-username/liquidity-platform.git

# Push إلى GitHub
git branch -M main
git push -u origin main
```

### 2. ربط Vercel مع GitHub

1. اذهب إلى https://vercel.com
2. انقر على **New Project**
3. اختر **Import Git Repository**
4. ابحث عن `liquidity-platform`
5. انقر على **Import**

### 3. إعداد متغيرات البيئة

في صفحة الإعدادات:

1. اذهب إلى **Settings** → **Environment Variables**
2. أضف المتغيرات التالية:

```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key
SUPABASE_SERVICE_ROLE_KEY = your-service-role-key
NEXT_PUBLIC_APP_URL = https://your-domain.com
```

### 4. إعدادات البناء

في صفحة الإعدادات:

1. **Framework:** Next.js
2. **Build Command:** `next build`
3. **Output Directory:** `.next`
4. **Install Command:** `npm install`

### 5. النشر الأول

1. انقر على **Deploy**
2. انتظر حتى ينتهي البناء
3. تحقق من الرابط المقدم

---

## 🔧 الإعدادات المتقدمة

### 1. نطاق مخصص

1. اذهب إلى **Settings** → **Domains**
2. أضف نطاقك (مثل `liquidity.example.com`)
3. أضف DNS Records كما هو موضح

### 2. شهادة SSL

Vercel توفر SSL مجاني تلقائياً.

### 3. إعادة التوجيه

في `vercel.json`:

```json
"redirects": [
  {
    "source": "/",
    "destination": "/dashboard",
    "permanent": false
  }
]
```

### 4. الرؤوس الأمنية

في `vercel.json`:

```json
"headers": [
  {
    "source": "/(.*)",
    "headers": [
      {
        "key": "X-Content-Type-Options",
        "value": "nosniff"
      },
      {
        "key": "X-Frame-Options",
        "value": "DENY"
      }
    ]
  }
]
```

---

## 📊 المراقبة والتحليلات

### 1. Web Analytics

1. اذهب إلى **Analytics**
2. شاهد:
   - عدد الزيارات
   - الأداء
   - الأخطاء

### 2. Logs

1. اذهب إلى **Logs** → **Function Logs**
2. راقب الأخطاء والتحذيرات

### 3. Performance

1. اذهب إلى **Performance**
2. شاهد:
   - سرعة البناء
   - حجم الـ Bundle
   - وقت التحميل

---

## 🔄 النشر المستمر (CI/CD)

### الإعداد التلقائي

Vercel يفعل هذا تلقائياً:

1. عند Push إلى `main` → نشر على الإنتاج
2. عند فتح PR → نشر معاينة (Preview)
3. عند Merge PR → نشر على الإنتاج

### الإعدادات

في **Settings** → **Git**:

- **Production Branch:** main
- **Preview Deployments:** Enabled

---

## 🐛 استكشاف الأخطاء

### خطأ: Build Failed

1. تحقق من الـ Logs
2. تأكد من أن `npm install` ينجح محلياً
3. تحقق من متغيرات البيئة

### خطأ: 404 Not Found

1. تحقق من الـ Routes
2. تأكد من أن `pages/` أو `app/` موجود
3. أعد بناء المشروع

### خطأ: Database Connection Failed

1. تحقق من متغيرات البيئة
2. تأكد من أن Supabase نشط
3. تحقق من الـ Firewall

---

## 📱 الاختبار قبل النشر

```bash
# بناء محلي
npm run build

# اختبار الإنتاج محلياً
npm run start

# فتح http://localhost:3000
```

---

## 🔐 الأمان

### 1. متغيرات البيئة

- لا تضع المفاتيح في الكود
- استخدم Vercel Dashboard فقط
- استخدم `NEXT_PUBLIC_` فقط للمتغيرات العامة

### 2. الرؤوس الأمنية

جميع الرؤوس موجودة في `vercel.json`

### 3. CORS

أضف نطاقاتك في Supabase:

```
https://your-domain.com
https://www.your-domain.com
```

---

## 📊 النسخ الاحتياطية

### Vercel

- يحتفظ بـ 30 يوم من الـ Deployments
- يمكنك الرجوع إلى أي نسخة قديمة

### Supabase

- نسخ احتياطية يومية تلقائية
- الاحتفاظ بـ 30 يوم

---

## 🚀 النشر على مراحل

### المرحلة 1: Preview

1. انشر على فرع منفصل
2. اختبر على Vercel Preview
3. اطلب Review

### المرحلة 2: Staging

1. انشر على فرع `staging`
2. اختبر بالكامل
3. اطلب Approval

### المرحلة 3: Production

1. Merge إلى `main`
2. Vercel ينشر تلقائياً
3. راقب الـ Logs

---

## 📞 الدعم

- Vercel Docs: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- GitHub Issues: https://github.com/vercel/next.js/issues

---

## ✅ قائمة التحقق قبل النشر

- [ ] جميع الاختبارات تمر
- [ ] متغيرات البيئة صحيحة
- [ ] Supabase جاهز
- [ ] الـ Build ينجح محلياً
- [ ] لا توجد أخطاء في الـ Console
- [ ] الأداء مقبول
- [ ] الأمان كافي

---

**الحالة:** جاهز للنشر ✅
