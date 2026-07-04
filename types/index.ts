/**
 * أنواع TypeScript الرئيسية للمشروع
 * 
 * هذا الملف يحتوي على جميع الأنواع الأساسية المستخدمة في المشروع
 * يجب استيراد الأنواع من هنا بدلاً من تعريفها في كل مكان
 */

// ==================== User Types ====================

/**
 * نوع المستخدم
 */
export interface User {
  /** معرف المستخدم الفريد */
  id: string
  /** البريد الإلكتروني */
  email: string
  /** اسم العمل/المتجر */
  businessName: string
  /** رقم الهاتف */
  phone?: string
  /** تاريخ الإنشاء */
  createdAt: Date
  /** تاريخ التحديث */
  updatedAt: Date
}

/**
 * بيانات تسجيل المستخدم الجديد
 */
export interface RegisterData {
  email: string
  password: string
  businessName: string
  phone?: string
}

/**
 * بيانات تسجيل الدخول
 */
export interface LoginData {
  email: string
  password: string
}

/**
 * استجابة المصادقة
 */
export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}

// ==================== Customer Types ====================

/**
 * حالات العميل الممكنة
 */
export type CustomerStatus = 'active' | 'suspended' | 'defaulted'

/**
 * نوع العميل
 */
export interface Customer {
  /** معرف العميل الفريد */
  id: string
  /** معرف المستخدم (المالك) */
  userId: string
  /** اسم العميل */
  name: string
  /** رقم الهاتف */
  phone: string
  /** البريد الإلكتروني */
  email?: string
  /** العنوان */
  address?: string
  /** الحد الائتماني (الحد الأقصى للآجل) */
  creditLimit: number
  /** الرصيد الحالي (المستحقات) */
  currentBalance: number
  /** حالة العميل */
  status: CustomerStatus
  /** تاريخ الإنشاء */
  createdAt: Date
  /** تاريخ التحديث */
  updatedAt: Date
}

/**
 * بيانات إضافة/تعديل العميل
 */
export interface CustomerFormData {
  name: string
  phone: string
  email?: string
  address?: string
  creditLimit: number
}

// ==================== Invoice Types ====================

/**
 * حالات الفاتورة الممكنة
 */
export type InvoiceStatus = 'paid' | 'pending' | 'overdue'

/**
 * نوع الفاتورة
 */
export interface Invoice {
  /** معرف الفاتورة الفريد */
  id: string
  /** معرف المستخدم (المالك) */
  userId: string
  /** معرف العميل */
  customerId: string
  /** رقم الفاتورة */
  invoiceNumber: string
  /** تاريخ الفاتورة */
  invoiceDate: Date
  /** تاريخ الاستحقاق */
  dueDate: Date
  /** المبلغ الإجمالي */
  totalAmount: number
  /** المبلغ المدفوع */
  paidAmount: number
  /** حالة الفاتورة */
  status: InvoiceStatus
  /** ملاحظات */
  notes?: string
  /** تاريخ الإنشاء */
  createdAt: Date
  /** تاريخ التحديث */
  updatedAt: Date
  /** بيانات العميل (عند الجلب) */
  customer?: Customer
  /** بنود الفاتورة */
  items?: InvoiceItem[]
}

/**
 * بند الفاتورة
 */
export interface InvoiceItem {
  /** معرف البند */
  id: string
  /** معرف الفاتورة */
  invoiceId: string
  /** معرف المنتج */
  productId: string
  /** الكمية */
  quantity: number
  /** سعر الوحدة */
  unitPrice: number
  /** السعر الإجمالي */
  totalPrice: number
  /** بيانات المنتج (عند الجلب) */
  product?: Product
}

/**
 * بيانات إضافة/تعديل الفاتورة
 */
export interface InvoiceFormData {
  customerId: string
  invoiceNumber: string
  invoiceDate: Date
  dueDate: Date
  items: InvoiceItemFormData[]
  notes?: string
}

/**
 * بيانات بند الفاتورة في النموذج
 */
export interface InvoiceItemFormData {
  productId: string
  quantity: number
  unitPrice: number
}

// ==================== Product Types ====================

/**
 * نوع المنتج
 */
export interface Product {
  /** معرف المنتج الفريد */
  id: string
  /** معرف المستخدم (المالك) */
  userId: string
  /** اسم المنتج */
  name: string
  /** كود المنتج (SKU) */
  sku: string
  /** السعر */
  price: number
  /** الكمية الحالية */
  quantityOnHand: number
  /** الحد الأدنى للمخزون */
  minimumQuantity: number
  /** الفئة */
  category?: string
  /** ملاحظات */
  notes?: string
  /** تاريخ الإنشاء */
  createdAt: Date
  /** تاريخ التحديث */
  updatedAt: Date
}

/**
 * بيانات إضافة/تعديل المنتج
 */
export interface ProductFormData {
  name: string
  sku: string
  price: number
  quantityOnHand: number
  minimumQuantity: number
  category?: string
  notes?: string
}

// ==================== Alert Types ====================

/**
 * أنواع التنبيهات الممكنة
 */
export type AlertType =
  | 'liquidity_warning'
  | 'liquidity_critical'
  | 'liquidity_opportunity'
  | 'invoice_due_soon'
  | 'invoice_overdue'
  | 'customer_defaulted'
  | 'inventory_low'
  | 'inventory_out'
  | 'inventory_slow_moving'
  | 'combined_warning'

/**
 * نوع التنبيه
 */
export interface Alert {
  /** معرف التنبيه الفريد */
  id: string
  /** معرف المستخدم */
  userId: string
  /** نوع التنبيه */
  alertType: AlertType
  /** رسالة التنبيه */
  message: string
  /** هل تم قراءة التنبيه */
  isRead: boolean
  /** تاريخ الإنشاء */
  createdAt: Date
}

// ==================== Dashboard Types ====================

/**
 * ملخص السيولة
 */
export interface LiquiditySummary {
  /** السيولة الحالية المتاحة */
  availableLiquidity: number
  /** إجمالي المستحقات */
  totalReceivables: number
  /** المستحقات المتوقعة في الأيام القادمة */
  expectedIncoming: number
  /** مؤشر الخطر */
  riskLevel: 'safe' | 'warning' | 'critical'
}

/**
 * ملخص الفواتير
 */
export interface InvoicesSummary {
  /** عدد الفواتير المستحقة اليوم */
  dueTodayCount: number
  /** مبلغ الفواتير المستحقة اليوم */
  dueTodayAmount: number
  /** عدد الفواتير المتأخرة */
  overdueCount: number
  /** مبلغ الفواتير المتأخرة */
  overdueAmount: number
}

/**
 * ملخص المخزون
 */
export interface InventorySummary {
  /** عدد المنتجات الناقصة */
  outOfStockCount: number
  /** عدد المنتجات القريبة من النفاد */
  lowStockCount: number
  /** عدد المنتجات بطيئة الحركة */
  slowMovingCount: number
}

/**
 * بيانات لوحة التحكم
 */
export interface DashboardData {
  /** ملخص السيولة */
  liquidity: LiquiditySummary
  /** ملخص الفواتير */
  invoices: InvoicesSummary
  /** ملخص المخزون */
  inventory: InventorySummary
  /** آخر التنبيهات */
  recentAlerts: Alert[]
}

// ==================== API Response Types ====================

/**
 * استجابة API عامة
 */
export interface ApiResponse<T> {
  /** البيانات */
  data?: T
  /** رسالة الخطأ */
  error?: string
  /** رمز الحالة */
  status: number
  /** رسالة النجاح */
  message?: string
}

/**
 * استجابة API مع قائمة
 */
export interface ApiListResponse<T> {
  /** البيانات */
  data: T[]
  /** إجمالي العناصر */
  total: number
  /** الصفحة الحالية */
  page: number
  /** عدد العناصر في الصفحة */
  limit: number
}

// ==================== Pagination Types ====================

/**
 * معاملات التصفح
 */
export interface PaginationParams {
  /** رقم الصفحة */
  page: number
  /** عدد العناصر في الصفحة */
  limit: number
  /** حقل الترتيب */
  sortBy?: string
  /** اتجاه الترتيب */
  sortOrder?: 'asc' | 'desc'
}

// ==================== Filter Types ====================

/**
 * معاملات البحث والتصفية
 */
export interface FilterParams {
  /** نص البحث */
  search?: string
  /** التاريخ من */
  dateFrom?: Date
  /** التاريخ إلى */
  dateTo?: Date
  /** الحالة */
  status?: string
}

// ==================== Form State Types ====================

/**
 * حالة النموذج
 */
export interface FormState {
  /** هل النموذج قيد الإرسال */
  isLoading: boolean
  /** رسالة الخطأ */
  error?: string
  /** رسالة النجاح */
  success?: string
}

// ==================== Notification Types ====================

/**
 * أنواع الإشعارات
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info'

/**
 * الإشعار
 */
export interface Notification {
  /** معرف الإشعار */
  id: string
  /** النوع */
  type: NotificationType
  /** الرسالة */
  message: string
  /** المدة (بالميلي ثانية) */
  duration?: number
}
