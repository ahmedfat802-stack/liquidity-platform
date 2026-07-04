/**
 * الثوابت والقيم الثابتة للمشروع
 * 
 * استخدم هذا الملف لتخزين جميع القيم الثابتة والإعدادات
 * بدلاً من تكرارها في الكود
 */

// ==================== App Configuration ====================

/**
 * اسم التطبيق
 */
export const APP_NAME = 'سيولة | إدارة السيولة والآجل'

/**
 * وصف التطبيق
 */
export const APP_DESCRIPTION = 'سيولة — منصة تساعد التجار في مصر على متابعة السيولة والآجل والفواتير والمخزون مع تنبيهات ذكية لمنع أزمات السيولة'

/**
 * رابط التطبيق
 */
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

/**
 * بيئة التطوير
 */
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'

// ==================== Customer Status ====================

/**
 * حالات العميل
 */
export const CUSTOMER_STATUSES = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  DEFAULTED: 'defaulted',
} as const

/**
 * تسميات حالات العميل
 */
export const CUSTOMER_STATUS_LABELS = {
  active: 'نشط',
  suspended: 'معلق',
  defaulted: 'متعثر',
} as const

// ==================== Invoice Status ====================

/**
 * حالات الفاتورة
 */
export const INVOICE_STATUSES = {
  PAID: 'paid',
  PENDING: 'pending',
  OVERDUE: 'overdue',
} as const

/**
 * تسميات حالات الفاتورة
 */
export const INVOICE_STATUS_LABELS = {
  paid: 'مدفوعة',
  pending: 'معلقة',
  overdue: 'متأخرة',
} as const

// ==================== Alert Types ====================

/**
 * أنواع التنبيهات
 */
export const ALERT_TYPES = {
  LIQUIDITY_WARNING: 'liquidity_warning',
  LIQUIDITY_CRITICAL: 'liquidity_critical',
  LIQUIDITY_OPPORTUNITY: 'liquidity_opportunity',
  INVOICE_DUE_SOON: 'invoice_due_soon',
  INVOICE_OVERDUE: 'invoice_overdue',
  CUSTOMER_DEFAULTED: 'customer_defaulted',
  INVENTORY_LOW: 'inventory_low',
  INVENTORY_OUT: 'inventory_out',
  INVENTORY_SLOW_MOVING: 'inventory_slow_moving',
  COMBINED_WARNING: 'combined_warning',
} as const

/**
 * تسميات أنواع التنبيهات
 */
export const ALERT_TYPE_LABELS = {
  liquidity_warning: 'تحذير السيولة',
  liquidity_critical: 'خطر السيولة',
  liquidity_opportunity: 'فرصة شراء',
  invoice_due_soon: 'فاتورة مستحقة قريباً',
  invoice_overdue: 'فاتورة متأخرة',
  customer_defaulted: 'عميل متعثر',
  inventory_low: 'مخزون منخفض',
  inventory_out: 'مخزون نفد',
  inventory_slow_moving: 'منتج بطيء الحركة',
  combined_warning: 'تحذير مركب',
} as const

// ==================== Liquidity Thresholds ====================

/**
 * حدود السيولة (بالجنيه المصري)
 */
export const LIQUIDITY_THRESHOLDS = {
  /** حد السيولة الحرج (تحت هذا الحد = خطر) */
  CRITICAL: 10000,
  /** حد السيولة التحذيري (تحت هذا الحد = تحذير) */
  WARNING: 25000,
  /** حد السيولة الآمن (فوق هذا الحد = آمن) */
  SAFE: 50000,
} as const

// ==================== Inventory Thresholds ====================

/**
 * حدود المخزون
 */
export const INVENTORY_THRESHOLDS = {
  /** عدد الأيام لاعتبار المنتج بطيء الحركة */
  SLOW_MOVING_DAYS: 10,
} as const

// ==================== Invoice Thresholds ====================

/**
 * حدود الفواتير
 */
export const INVOICE_THRESHOLDS = {
  /** عدد الفواتير المتأخرة لاعتبار العميل متعثراً */
  DEFAULTED_INVOICE_COUNT: 3,
  /** عدد الأيام لاعتبار الفاتورة متأخرة */
  OVERDUE_DAYS: 1,
  /** عدد الأيام لإرسال تنبيه قبل الاستحقاق */
  DUE_SOON_DAYS: 1,
} as const

// ==================== Pagination ====================

/**
 * الحد الأقصى للعناصر في الصفحة الواحدة
 */
export const PAGINATION_LIMITS = {
  DEFAULT: 10,
  MIN: 5,
  MAX: 100,
} as const

// ==================== Date Formats ====================

/**
 * صيغ التاريخ
 */
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  DISPLAY_WITH_TIME: 'dd/MM/yyyy HH:mm',
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
  INPUT: 'yyyy-MM-dd',
} as const

// ==================== Currency ====================

/**
 * رمز العملة
 */
export const CURRENCY = {
  SYMBOL: 'ج.م',
  CODE: 'EGP',
  DECIMAL_PLACES: 2,
} as const

// ==================== Validation Rules ====================

/**
 * قواعد التحقق من الصحة
 */
export const VALIDATION_RULES = {
  // البريد الإلكتروني
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  EMAIL_MIN_LENGTH: 5,
  EMAIL_MAX_LENGTH: 255,

  // كلمة المرور
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,

  // الأسماء
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 255,

  // رقم الهاتف
  PHONE_MIN_LENGTH: 10,
  PHONE_MAX_LENGTH: 20,

  // الأرقام
  AMOUNT_MIN: 0,
  AMOUNT_MAX: 999999999,

  // الكمية
  QUANTITY_MIN: 0,
  QUANTITY_MAX: 999999,
} as const

// ==================== API Endpoints ====================

/**
 * نقاط نهاية API
 */
export const API_ENDPOINTS = {
  // المصادقة
  AUTH_LOGIN: '/api/auth/login',
  AUTH_REGISTER: '/api/auth/register',
  AUTH_LOGOUT: '/api/auth/logout',
  AUTH_REFRESH: '/api/auth/refresh-token',

  // العملاء
  CUSTOMERS: '/api/customers',
  CUSTOMER_BY_ID: (id: string) => `/api/customers/${id}`,

  // الفواتير
  INVOICES: '/api/invoices',
  INVOICE_BY_ID: (id: string) => `/api/invoices/${id}`,

  // المنتجات
  PRODUCTS: '/api/products',
  PRODUCT_BY_ID: (id: string) => `/api/products/${id}`,

  // التنبيهات
  ALERTS: '/api/alerts',
  ALERT_BY_ID: (id: string) => `/api/alerts/${id}`,

  // لوحة التحكم
  DASHBOARD: '/api/dashboard',
  DASHBOARD_LIQUIDITY: '/api/dashboard/liquidity',
  DASHBOARD_INVOICES: '/api/dashboard/invoices',
  DASHBOARD_INVENTORY: '/api/dashboard/inventory',
} as const

// ==================== Error Messages ====================

/**
 * رسائل الأخطاء
 */
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'غير مصرح. يرجى تسجيل الدخول.',
  FORBIDDEN: 'لا توجد صلاحيات كافية.',
  NOT_FOUND: 'لم يتم العثور على البيانات المطلوبة.',
  VALIDATION_ERROR: 'البيانات المدخلة غير صحيحة.',
  SERVER_ERROR: 'حدث خطأ في الخادم. يرجى المحاولة لاحقاً.',
  NETWORK_ERROR: 'خطأ في الاتصال بالشبكة.',
  UNKNOWN_ERROR: 'حدث خطأ غير متوقع.',
} as const

// ==================== Success Messages ====================

/**
 * رسائل النجاح
 */
export const SUCCESS_MESSAGES = {
  CUSTOMER_CREATED: 'تم إضافة العميل بنجاح.',
  CUSTOMER_UPDATED: 'تم تحديث بيانات العميل بنجاح.',
  CUSTOMER_DELETED: 'تم حذف العميل بنجاح.',
  INVOICE_CREATED: 'تم إضافة الفاتورة بنجاح.',
  INVOICE_UPDATED: 'تم تحديث الفاتورة بنجاح.',
  INVOICE_DELETED: 'تم حذف الفاتورة بنجاح.',
  INVOICE_MARKED_PAID: 'تم تعليم الفاتورة كمدفوعة.',
  PRODUCT_CREATED: 'تم إضافة المنتج بنجاح.',
  PRODUCT_UPDATED: 'تم تحديث المنتج بنجاح.',
  PRODUCT_DELETED: 'تم حذف المنتج بنجاح.',
  LOGIN_SUCCESS: 'تم تسجيل الدخول بنجاح.',
  LOGOUT_SUCCESS: 'تم تسجيل الخروج بنجاح.',
  REGISTER_SUCCESS: 'تم التسجيل بنجاح. يرجى تسجيل الدخول.',
} as const

// ==================== Navigation ====================

/**
 * روابط التنقل الرئيسية
 */
export const NAVIGATION_LINKS = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  CUSTOMERS: '/dashboard/customers',
  INVOICES: '/dashboard/invoices',
  PRODUCTS: '/dashboard/products',
  ALERTS: '/dashboard/alerts',
} as const

// ==================== Timeout Values ====================

/**
 * قيم انتظار العمليات (بالميلي ثانية)
 */
export const TIMEOUTS = {
  /** انتظار الطلب */
  REQUEST: 30000,
  /** انتظار الإشعار */
  NOTIFICATION: 3000,
  /** انتظار التحديث التلقائي */
  AUTO_REFRESH: 60000,
  /** انتظار البحث */
  SEARCH_DEBOUNCE: 300,
} as const

// ==================== Local Storage Keys ====================

/**
 * مفاتيح التخزين المحلي
 */
export const LOCAL_STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_COLLAPSED: 'sidebarCollapsed',
} as const
