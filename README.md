# منصة إدارة السيولة والآجل

## 📋 نظرة عامة

منصة ويب متكاملة توفر للتجار رؤية شاملة عن حالتهم المالية والسيولة في الوقت الفعلي، مع تنبيهات ذكية تساعدهم على اتخاذ قرارات مالية صحيحة.

## 🛠️ التكنولوجيا المستخدمة

- **Frontend:** Next.js 14 + React 18 + TypeScript
- **UI Components:** shadcn/ui + Radix UI
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts

## 📁 هيكل المشروع

```
liquidity-platform/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # صفحات المصادقة
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/              # صفحات لوحة التحكم
│   │   ├── dashboard/
│   │   ├── customers/
│   │   ├── invoices/
│   │   ├── products/
│   │   └── alerts/
│   ├── api/                      # API Routes
│   │   ├── auth/
│   │   ├── customers/
│   │   ├── invoices/
│   │   ├── products/
│   │   └── alerts/
│   └── layout.tsx
├── components/                   # React Components
│   ├── ui/                       # shadcn/ui Components
│   ├── auth/                     # مكونات المصادقة
│   ├── dashboard/                # مكونات لوحة التحكم
│   ├── customers/                # مكونات إدارة العملاء
│   ├── invoices/                 # مكونات إدارة الفواتير
│   ├── products/                 # مكونات إدارة المنتجات
│   ├── alerts/                   # مكونات التنبيهات
│   └── layout/                   # مكونات التخطيط
├── lib/                          # Utility Functions
│   ├── supabase/                 # Supabase Client & Helpers
│   ├── utils.ts                  # Utility Functions
│   └── constants.ts              # Constants
├── hooks/                        # Custom React Hooks
│   ├── useAuth.ts
│   ├── useCustomers.ts
│   ├── useInvoices.ts
│   ├── useProducts.ts
│   └── useAlerts.ts
├── store/                        # Zustand Store
│   ├── authStore.ts
│   ├── dashboardStore.ts
│   └── alertStore.ts
├── types/                        # TypeScript Types
│   ├── index.ts
│   ├── database.ts
│   └── api.ts
├── styles/                       # Global Styles
│   └── globals.css
├── public/                       # Static Assets
├── docs/                         # Documentation
│   ├── SETUP.md                  # خطوات الإعداد
│   ├── ARCHITECTURE.md           # معمارية المشروع
│   ├── FEATURES.md               # شرح الفيتشرز
│   ├── API.md                    # توثيق API
│   └── CODING_STANDARDS.md       # معايير الكود
├── .env.example                  # متغيرات البيئة
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
└── next.config.js
```

## 🚀 البدء السريع

### 1. التثبيت

```bash
# استنساخ المشروع
git clone <repository-url>
cd liquidity-platform

# تثبيت المكتبات
npm install

# نسخ ملف البيئة
cp .env.example .env.local
```

### 2. إعداد Supabase

1. اذهب إلى [supabase.com](https://supabase.com)
2. أنشئ مشروع جديد
3. انسخ `NEXT_PUBLIC_SUPABASE_URL` و `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. ألصقها في ملف `.env.local`

### 3. تشغيل المشروع

```bash
npm run dev
```

الموقع سيكون متاحاً على `http://localhost:3000`

## 📚 الوثائق

- [SETUP.md](./docs/SETUP.md) - خطوات الإعداد التفصيلية
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) - معمارية المشروع
- [FEATURES.md](./docs/FEATURES.md) - شرح الفيتشرز
- [API.md](./docs/API.md) - توثيق API
- [CODING_STANDARDS.md](./docs/CODING_STANDARDS.md) - معايير الكود

## 🎯 الفيتشرز الرئيسية

### ✅ MVP (المرحلة الأولى)
- [ ] نظام المصادقة والتسجيل
- [ ] لوحة التحكم الرئيسية
- [ ] إدارة العملاء
- [ ] إدارة الفواتير
- [ ] إدارة المنتجات والمخزون
- [ ] التنبيهات الأساسية

### 🔄 المرحلة الثانية
- [ ] التقارير والتحليلات
- [ ] تنبيهات البريد الإلكتروني
- [ ] تحسينات الواجهة

### 🚀 المرحلة الثالثة
- [ ] التمويل الذكي
- [ ] سوق B2B
- [ ] تحليلات متقدمة

## 🤝 المساهمة

عند المساهمة، يرجى اتباع:
1. معايير الكود في [CODING_STANDARDS.md](./docs/CODING_STANDARDS.md)
2. إضافة تعليقات واضحة للكود
3. توثيق الفيتشرز الجديدة

## 📝 الملاحظات المهمة

- **اللغة العربية:** الواجهة كاملة بالعربية مع دعم RTL
- **الأداء:** التركيز على السرعة والاستجابة
- **الأمان:** حماية بيانات المستخدمين والعملاء
- **بدون تمويل:** المنصة تركز على المراقبة فقط

## 📞 الدعم

للمساعدة أو الإبلاغ عن مشاكل، يرجى فتح issue على GitHub.

---

**الحالة:** جاهز للتطوير ✅
