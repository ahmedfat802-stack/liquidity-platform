# معمارية المشروع - Project Architecture

## 📐 نظرة عامة على المعمارية

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Pages (App Router)                                   │  │
│  │  - Auth Pages (login, register)                       │  │
│  │  - Dashboard Pages                                    │  │
│  │  - Feature Pages (customers, invoices, products)      │  │
│  └───────────────────────────────────────────────────────┘  │
│                           ↓                                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Components Layer                                     │  │
│  │  - UI Components (shadcn/ui)                          │  │
│  │  - Feature Components                                 │  │
│  │  - Layout Components                                  │  │
│  └───────────────────────────────────────────────────────┘  │
│                           ↓                                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Hooks & State Management                             │  │
│  │  - Custom Hooks (useAuth, useCustomers, etc)          │  │
│  │  - Zustand Store                                      │  │
│  │  - React Query (للـ Caching)                          │  │
│  └───────────────────────────────────────────────────────┘  │
│                           ↓                                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Services & Utils                                     │  │
│  │  - API Client (Axios)                                 │  │
│  │  - Supabase Client                                    │  │
│  │  - Utilities & Helpers                                │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│              Backend (Next.js API Routes)                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  API Routes                                           │  │
│  │  - /api/auth/* (المصادقة)                            │  │
│  │  - /api/customers/* (العملاء)                        │  │
│  │  - /api/invoices/* (الفواتير)                        │  │
│  │  - /api/products/* (المنتجات)                        │  │
│  │  - /api/alerts/* (التنبيهات)                         │  │
│  └───────────────────────────────────────────────────────┘  │
│                           ↓                                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Business Logic                                       │  │
│  │  - Services (CustomerService, InvoiceService, etc)    │  │
│  │  - Validators                                         │  │
│  │  - Alert Engine                                       │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                  Database (Supabase)                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  PostgreSQL Database                                  │  │
│  │  - users table                                        │  │
│  │  - customers table                                    │  │
│  │  - invoices table                                     │  │
│  │  - products table                                     │  │
│  │  - alerts table                                       │  │
│  │  - email_logs table                                   │  │
│  └───────────────────────────────────────────────────────┘  │
│                           ↓                                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Authentication                                       │  │
│  │  - Supabase Auth (JWT)                                │  │
│  │  - Row Level Security (RLS)                           │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 هيكل المجلدات التفصيلي

### `app/` - Next.js App Router

```
app/
├── (auth)/                    # مجموعة المصادقة
│   ├── login/
│   │   └── page.tsx           # صفحة تسجيل الدخول
│   ├── register/
│   │   └── page.tsx           # صفحة التسجيل
│   └── layout.tsx             # تخطيط المصادقة
│
├── (dashboard)/               # مجموعة لوحة التحكم
│   ├── dashboard/
│   │   └── page.tsx           # الصفحة الرئيسية
│   ├── customers/
│   │   ├── page.tsx           # قائمة العملاء
│   │   ├── [id]/
│   │   │   └── page.tsx       # تفاصيل العميل
│   │   └── new/
│   │       └── page.tsx       # إضافة عميل جديد
│   ├── invoices/
│   │   ├── page.tsx
│   │   ├── [id]/page.tsx
│   │   └── new/page.tsx
│   ├── products/
│   │   ├── page.tsx
│   │   ├── [id]/page.tsx
│   │   └── new/page.tsx
│   ├── alerts/
│   │   └── page.tsx
│   └── layout.tsx             # تخطيط لوحة التحكم
│
├── api/                       # API Routes
│   ├── auth/
│   │   ├── login/route.ts
│   │   ├── register/route.ts
│   │   └── logout/route.ts
│   ├── customers/
│   │   ├── route.ts           # GET, POST
│   │   └── [id]/route.ts      # GET, PUT, DELETE
│   ├── invoices/
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   ├── products/
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   └── alerts/
│       ├── route.ts
│       └── [id]/route.ts
│
├── layout.tsx                 # التخطيط الرئيسي
├── page.tsx                   # الصفحة الرئيسية
└── globals.css                # الأنماط العامة
```

### `components/` - المكونات

```
components/
├── ui/                        # مكونات shadcn/ui
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── table.tsx
│   ├── tabs.tsx
│   ├── toast.tsx
│   └── ... (مكونات أخرى)
│
├── auth/                      # مكونات المصادقة
│   ├── LoginForm.tsx          # نموذج تسجيل الدخول
│   ├── RegisterForm.tsx       # نموذج التسجيل
│   └── AuthGuard.tsx          # حماية المسارات
│
├── dashboard/                 # مكونات لوحة التحكم
│   ├── DashboardHeader.tsx
│   ├── LiquiditySummary.tsx   # ملخص السيولة
│   ├── InvoicesSummary.tsx    # ملخص الفواتير
│   ├── InventorySummary.tsx   # ملخص المخزون
│   ├── RecentAlerts.tsx       # آخر التنبيهات
│   └── Charts.tsx             # الرسوم البيانية
│
├── customers/                 # مكونات العملاء
│   ├── CustomerForm.tsx       # نموذج العميل
│   ├── CustomerTable.tsx      # جدول العملاء
│   ├── CustomerCard.tsx       # بطاقة العميل
│   └── CustomerDetails.tsx    # تفاصيل العميل
│
├── invoices/                  # مكونات الفواتير
│   ├── InvoiceForm.tsx
│   ├── InvoiceTable.tsx
│   ├── InvoiceCard.tsx
│   └── InvoiceDetails.tsx
│
├── products/                  # مكونات المنتجات
│   ├── ProductForm.tsx
│   ├── ProductTable.tsx
│   ├── ProductCard.tsx
│   └── ProductDetails.tsx
│
├── alerts/                    # مكونات التنبيهات
│   ├── AlertsList.tsx
│   ├── AlertCard.tsx
│   └── AlertNotification.tsx
│
└── layout/                    # مكونات التخطيط
    ├── Sidebar.tsx            # القائمة الجانبية
    ├── Header.tsx             # رأس الصفحة
    ├── Footer.tsx             # تذييل الصفحة
    └── Navigation.tsx         # التنقل
```

### `lib/` - المكتبات والأدوات

```
lib/
├── supabase/
│   ├── client.ts              # Supabase Client
│   ├── server.ts              # Server-side Client
│   ├── admin.ts               # Admin Client
│   └── helpers.ts             # Helper Functions
│
├── api/
│   ├── client.ts              # Axios Client
│   ├── endpoints.ts           # API Endpoints
│   └── interceptors.ts        # Request/Response Interceptors
│
├── utils.ts                   # Utility Functions
├── constants.ts               # Constants
├── validators.ts              # Validation Functions
└── types.ts                   # Shared Types
```

### `hooks/` - Custom Hooks

```
hooks/
├── useAuth.ts                 # Hook للمصادقة
├── useCustomers.ts            # Hook لإدارة العملاء
├── useInvoices.ts             # Hook لإدارة الفواتير
├── useProducts.ts             # Hook لإدارة المنتجات
├── useAlerts.ts               # Hook لإدارة التنبيهات
├── useLiquidity.ts            # Hook لحساب السيولة
└── useLocalStorage.ts         # Hook للتخزين المحلي
```

### `store/` - Zustand Store

```
store/
├── authStore.ts               # متجر المصادقة
├── dashboardStore.ts          # متجر لوحة التحكم
├── alertStore.ts              # متجر التنبيهات
└── index.ts                   # Export جميع المتاجر
```

### `types/` - أنواع TypeScript

```
types/
├── index.ts                   # الأنواع الرئيسية
├── database.ts                # أنواع قاعدة البيانات
├── api.ts                     # أنواع API
└── components.ts              # أنواع المكونات
```

---

## 🔄 تدفق البيانات

### تدفق المصادقة

```
User → LoginForm → API Route → Supabase Auth → JWT Token → Store → Protected Pages
```

### تدفق جلب البيانات

```
Component → useCustomers Hook → API Route → Supabase → Response → Cache → Component
```

### تدفق التنبيهات

```
Data Change → Alert Engine → Generate Alert → Store Alert → Send Email → Notify User
```

---

## 🔐 الأمان

### Row Level Security (RLS)

```sql
-- جميع المستخدمين يرون فقط بياناتهم
CREATE POLICY "Users can view their own data"
  ON customers
  FOR SELECT
  USING (auth.uid() = user_id);

-- المستخدمون يمكنهم تعديل بياناتهم فقط
CREATE POLICY "Users can update their own data"
  ON customers
  FOR UPDATE
  USING (auth.uid() = user_id);
```

### API Protection

```typescript
// جميع API Routes محمية بالمصادقة
import { createClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const supabase = createClient()
  
  // التحقق من المصادقة
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  // المتابعة مع البيانات الآمنة
}
```

---

## 📊 نموذج البيانات

### جداول Supabase

```
users
├── id (UUID) - Primary Key
├── email (VARCHAR)
├── business_name (VARCHAR)
├── phone (VARCHAR)
└── created_at (TIMESTAMP)

customers
├── id (UUID) - Primary Key
├── user_id (UUID) - Foreign Key
├── name (VARCHAR)
├── phone (VARCHAR)
├── email (VARCHAR)
├── address (TEXT)
├── credit_limit (DECIMAL)
├── current_balance (DECIMAL)
├── status (ENUM)
└── created_at (TIMESTAMP)

invoices
├── id (UUID) - Primary Key
├── user_id (UUID) - Foreign Key
├── customer_id (UUID) - Foreign Key
├── invoice_number (VARCHAR)
├── invoice_date (DATE)
├── due_date (DATE)
├── total_amount (DECIMAL)
├── paid_amount (DECIMAL)
├── status (ENUM)
└── created_at (TIMESTAMP)

products
├── id (UUID) - Primary Key
├── user_id (UUID) - Foreign Key
├── name (VARCHAR)
├── sku (VARCHAR)
├── price (DECIMAL)
├── quantity_on_hand (INT)
├── minimum_quantity (INT)
└── created_at (TIMESTAMP)

alerts
├── id (UUID) - Primary Key
├── user_id (UUID) - Foreign Key
├── alert_type (VARCHAR)
├── message (TEXT)
├── is_read (BOOLEAN)
└── created_at (TIMESTAMP)
```

---

## 🚀 خطة التطوير

### المرحلة 1: MVP
- [ ] نظام المصادقة
- [ ] لوحة التحكم الأساسية
- [ ] إدارة العملاء والفواتير
- [ ] إدارة المنتجات

### المرحلة 2: التحسينات
- [ ] التنبيهات المتقدمة
- [ ] التقارير والتحليلات
- [ ] تحسينات الأداء

### المرحلة 3: التوسع
- [ ] ميزات متقدمة
- [ ] تطبيق موبايل
- [ ] API عام

---

**ملاحظة:** هذه المعمارية قابلة للتطور والتعديل حسب الاحتياجات.
