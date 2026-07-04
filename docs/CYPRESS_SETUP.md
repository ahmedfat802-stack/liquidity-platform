# إعداد اختبارات E2E مع Cypress

**التاريخ:** 4 يوليو 2026

---

## 📦 التثبيت

```bash
# تثبيت Cypress
npm install --save-dev cypress

# فتح Cypress
npx cypress open
```

---

## 📝 هيكل الاختبارات

```
cypress/
├── e2e/
│   ├── auth.cy.ts
│   ├── customers.cy.ts
│   ├── invoices.cy.ts
│   └── products.cy.ts
├── support/
│   ├── commands.ts
│   └── e2e.ts
└── cypress.config.ts
```

---

## 🧪 اختبارات المصادقة

```typescript
describe('Authentication', () => {
  it('يجب تسجيل دخول المستخدم', () => {
    cy.visit('/login')
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')
  })

  it('يجب عرض رسالة خطأ للبيانات الخاطئة', () => {
    cy.visit('/login')
    cy.get('input[type="email"]').type('wrong@example.com')
    cy.get('input[type="password"]').type('wrongpass')
    cy.get('button[type="submit"]').click()
    cy.contains('خطأ في البيانات').should('be.visible')
  })
})
```

---

## 🧪 اختبارات العملاء

```typescript
describe('Customers', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password123')
    cy.visit('/dashboard/customers')
  })

  it('يجب عرض قائمة العملاء', () => {
    cy.get('table').should('be.visible')
    cy.get('tbody tr').should('have.length.greaterThan', 0)
  })

  it('يجب إضافة عميل جديد', () => {
    cy.get('a').contains('إضافة عميل جديد').click()
    cy.get('input[placeholder="أدخل اسم العميل"]').type('محمد أحمد')
    cy.get('input[placeholder="أدخل رقم الهاتف"]').type('01001234567')
    cy.get('input[placeholder="أدخل الحد الائتماني"]').type('10000')
    cy.get('button').contains('إضافة عميل').click()
    cy.contains('تم إضافة العميل بنجاح').should('be.visible')
  })
})
```

---

## 🧪 اختبارات الفواتير

```typescript
describe('Invoices', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password123')
    cy.visit('/dashboard/invoices')
  })

  it('يجب عرض قائمة الفواتير', () => {
    cy.get('table').should('be.visible')
  })

  it('يجب إضافة فاتورة جديدة', () => {
    cy.get('a').contains('إضافة فاتورة جديدة').click()
    cy.get('select').first().select('العميل الأول')
    cy.get('input[placeholder="أدخل رقم الفاتورة"]').type('INV-001')
    cy.get('button').contains('إضافة فاتورة').click()
    cy.contains('تم إضافة الفاتورة بنجاح').should('be.visible')
  })
})
```

---

## 🚀 تشغيل الاختبارات

```bash
# فتح واجهة Cypress
npm run cypress:open

# تشغيل الاختبارات في الخلفية
npm run cypress:run

# تشغيل اختبار معين
npm run cypress:run -- --spec "cypress/e2e/auth.cy.ts"
```

---

## ⚙️ الإعدادات

```typescript
// cypress.config.ts
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // تطبيق الإضافات
    },
  },
})
```

---

## 📊 التقارير

```bash
# إنشاء تقرير HTML
npm run cypress:run -- --reporter html

# إنشاء تقرير JSON
npm run cypress:run -- --reporter json
```

---

**الحالة:** جاهز للتطبيق
