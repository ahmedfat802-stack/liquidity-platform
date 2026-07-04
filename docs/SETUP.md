# خطوات الإعداد - Setup Guide

## 📋 المتطلبات

- Node.js 18+ 
- npm أو pnpm
- حساب Supabase
- حساب SendGrid (للبريد الإلكتروني)

---

## 🚀 خطوات الإعداد الأولية

### 1. استنساخ المشروع

```bash
git clone <repository-url>
cd liquidity-platform
```

### 2. تثبيت المكتبات

```bash
npm install
# أو
pnpm install
```

### 3. إعداد متغيرات البيئة

```bash
# نسخ ملف البيئة
cp .env.example .env.local
```

ثم عدّل الملف `.env.local` بقيمك الخاصة:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@liquidityplatform.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

## 🔧 إعداد Supabase

### 1. إنشاء مشروع Supabase

1. اذهب إلى [supabase.com](https://supabase.com)
2. انقر على "New Project"
3. أدخل اسم المشروع والمنطقة
4. انقر على "Create new project"

### 2. الحصول على مفاتيح API

1. اذهب إلى "Settings" → "API"
2. انسخ `Project URL` و `anon public key`
3. ألصقها في `.env.local`

### 3. إنشاء جداول قاعدة البيانات

اذهب إلى "SQL Editor" وشغّل الـ SQL التالي:

```sql
-- ==================== Users ====================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  business_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== Customers ====================
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  credit_limit DECIMAL(12, 2) NOT NULL DEFAULT 0,
  current_balance DECIMAL(12, 2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'defaulted')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== Products ====================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  quantity_on_hand INT NOT NULL DEFAULT 0,
  minimum_quantity INT NOT NULL DEFAULT 0,
  category VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== Invoices ====================
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  paid_amount DECIMAL(12, 2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('paid', 'pending', 'overdue')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== Invoice Items ====================
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INT NOT NULL,
  unit_price DECIMAL(12, 2) NOT NULL,
  total_price DECIMAL(12, 2) NOT NULL
);

-- ==================== Alerts ====================
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  alert_type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== Email Logs ====================
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'sent' CHECK (status IN ('sent', 'failed')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== Indexes ====================
CREATE INDEX idx_customers_user_id ON customers(user_id);
CREATE INDEX idx_products_user_id ON products(user_id);
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX idx_alerts_user_id ON alerts(user_id);
CREATE INDEX idx_email_logs_user_id ON email_logs(user_id);

-- ==================== Row Level Security ====================
-- تفعيل RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Policies for customers
CREATE POLICY "Users can view their own customers"
  ON customers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own customers"
  ON customers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own customers"
  ON customers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own customers"
  ON customers FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for products
CREATE POLICY "Users can view their own products"
  ON products FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own products"
  ON products FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products"
  ON products FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products"
  ON products FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for invoices
CREATE POLICY "Users can view their own invoices"
  ON invoices FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own invoices"
  ON invoices FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own invoices"
  ON invoices FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own invoices"
  ON invoices FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for alerts
CREATE POLICY "Users can view their own alerts"
  ON alerts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own alerts"
  ON alerts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alerts"
  ON alerts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own alerts"
  ON alerts FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for email_logs
CREATE POLICY "Users can view their own email logs"
  ON email_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own email logs"
  ON email_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### 4. تفعيل المصادقة

1. اذهب إلى "Authentication" → "Providers"
2. فعّل "Email" (يجب أن يكون مفعّلاً افتراضياً)
3. اذهب إلى "URL Configuration"
4. أضف `http://localhost:3000` إلى "Redirect URLs"

---

## 📧 إعداد البريد الإلكتروني (SendGrid)

### 1. إنشاء حساب SendGrid

1. اذهب إلى [sendgrid.com](https://sendgrid.com)
2. أنشئ حساباً جديداً
3. تحقق من بريدك الإلكتروني

### 2. الحصول على API Key

1. اذهب إلى "Settings" → "API Keys"
2. انقر على "Create API Key"
3. اختر "Full Access"
4. انسخ المفتاح وألصقه في `.env.local`

### 3. التحقق من البريد الإرسال

1. اذهب إلى "Settings" → "Sender Authentication"
2. تحقق من عنوان البريد الذي ستستخدمه

---

## 🏃 تشغيل المشروع

### التطوير

```bash
npm run dev
```

الموقع سيكون متاحاً على `http://localhost:3000`

### البناء

```bash
npm run build
```

### الإنتاج

```bash
npm start
```

---

## ✅ قائمة التحقق

قبل البدء في التطوير، تأكد من:

- [ ] تثبيت Node.js 18+
- [ ] استنساخ المشروع
- [ ] تثبيت المكتبات
- [ ] إعداد متغيرات البيئة
- [ ] إنشاء مشروع Supabase
- [ ] تشغيل SQL Scripts
- [ ] إعداد المصادقة
- [ ] إعداد البريد الإلكتروني
- [ ] تشغيل المشروع بنجاح

---

## 🐛 استكشاف الأخطاء

### خطأ: "Cannot find module"

```bash
# حل: أعد تثبيت المكتبات
rm -rf node_modules package-lock.json
npm install
```

### خطأ: "Supabase connection failed"

- تحقق من متغيرات البيئة
- تأكد من أن مشروع Supabase يعمل
- تحقق من الاتصال بالإنترنت

### خطأ: "Email not sending"

- تحقق من API Key في SendGrid
- تحقق من عنوان البريد الإرسال
- تحقق من السجلات في SendGrid

---

## 📚 الموارد

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**ملاحظة:** إذا واجهت مشاكل، تحقق من الملفات الأخرى في مجلد `docs/`.
