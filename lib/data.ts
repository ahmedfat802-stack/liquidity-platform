/**
 * =====================================================================
 * lib/data.ts — طبقة البيانات الموحدة (Data Layer)
 * =====================================================================
 *
 * ⚠️ قاعدة ثابتة لأي Agent يعمل على هذا المشروع:
 * - كل استعلامات Supabase من صفحات الـ Dashboard يجب أن تمر من هذا الملف فقط
 * - لا تكتب استعلامات supabase.from() مباشرة داخل الصفحات
 * - كل دالة ترجع { data, error } ولا ترمي exceptions
 * - user_id يُقرأ تلقائياً من الجلسة الحالية (RLS يحمي البيانات أيضاً)
 * =====================================================================
 */
'use client'

import { getSupabaseClient } from '@/lib/supabase/client'

/* =====================================================================
 * الأنواع (Types) — مطابقة تماماً لهيكل جداول Supabase
 * ===================================================================== */

export interface Customer {
  id: string
  user_id: string
  name: string
  phone: string | null
  email: string | null
  address: string | null
  credit_limit: number
  current_balance: number
  status: string
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: string
  user_id: string
  customer_id: string
  invoice_number: string
  invoice_date: string
  due_date: string
  total_amount: number
  paid_amount: number
  status: string // pending | paid | overdue | partial
  notes: string | null
  created_at: string
  updated_at: string
  /** يتم جلبها بـ join مع جدول العملاء */
  customers?: { name: string } | null
}

export interface Product {
  id: string
  user_id: string
  name: string
  sku: string | null
  price: number
  quantity_on_hand: number
  minimum_quantity: number
  category: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

type Result<T> = { data: T | null; error: string | null }

/* =====================================================================
 * مساعد: الحصول على user_id من الجلسة الحالية
 * ===================================================================== */
async function getUserId(): Promise<string | null> {
  const supabase = getSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user?.id ?? null
}

/* =====================================================================
 * العملاء (Customers)
 * ===================================================================== */

/** جلب كل عملاء المستخدم الحالي مرتبين بالأحدث */
export async function fetchCustomers(): Promise<Result<Customer[]>> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false })
  return { data: (data as Customer[]) ?? [], error: error?.message ?? null }
}

/** إضافة عميل جديد */
export async function createCustomer(input: {
  name: string
  phone?: string | null
  email?: string | null
  address?: string | null
  credit_limit?: number
  current_balance?: number
}): Promise<Result<Customer>> {
  const supabase = getSupabaseClient()
  const userId = await getUserId()
  if (!userId) return { data: null, error: 'يجب تسجيل الدخول أولاً' }

  const { data, error } = await supabase
    .from('customers')
    .insert({
      user_id: userId,
      name: input.name,
      phone: input.phone || null,
      email: input.email || null,
      address: input.address || null,
      credit_limit: input.credit_limit ?? 0,
      current_balance: input.current_balance ?? 0,
      status: 'active',
    })
    .select()
    .single()
  return { data: data as Customer, error: error?.message ?? null }
}

/** تعديل عميل */
export async function updateCustomer(
  id: string,
  input: Partial<Pick<Customer, 'name' | 'phone' | 'email' | 'address' | 'credit_limit' | 'status'>>
): Promise<Result<Customer>> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('customers')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  return { data: data as Customer, error: error?.message ?? null }
}

/** حذف عميل */
export async function deleteCustomer(id: string): Promise<Result<boolean>> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from('customers').delete().eq('id', id)
  return { data: !error, error: error?.message ?? null }
}

/* =====================================================================
 * الفواتير (Invoices)
 * ===================================================================== */

/** جلب كل الفواتير مع اسم العميل */
export async function fetchInvoices(): Promise<Result<Invoice[]>> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('invoices')
    .select('*, customers(name)')
    .order('due_date', { ascending: true })
  return { data: (data as Invoice[]) ?? [], error: error?.message ?? null }
}

/** إضافة فاتورة جديدة + زيادة رصيد العميل بالمبلغ غير المسدد */
export async function createInvoice(input: {
  customer_id: string
  total_amount: number
  invoice_date: string
  due_date: string
  invoice_number?: string
  paid_amount?: number
  notes?: string | null
}): Promise<Result<Invoice>> {
  const supabase = getSupabaseClient()
  const userId = await getUserId()
  if (!userId) return { data: null, error: 'يجب تسجيل الدخول أولاً' }

  // رقم الفاتورة: من الصفحة أو توليد تلقائي INV-YYYYMMDD-XXXX
  const invoiceNumber =
    input.invoice_number?.trim() ||
    `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(
      1000 + Math.random() * 9000
    )}`

  const total = Number(input.total_amount)
  const paid = Number(input.paid_amount ?? 0)
  const status = paid >= total ? 'paid' : paid > 0 ? 'partial' : 'pending'
  const remaining = Math.max(0, total - paid)

  const { data, error } = await supabase
    .from('invoices')
    .insert({
      user_id: userId,
      customer_id: input.customer_id,
      invoice_number: invoiceNumber,
      invoice_date: input.invoice_date,
      due_date: input.due_date,
      total_amount: total,
      paid_amount: paid,
      status,
      notes: input.notes || null,
    })
    .select()
    .single()

  if (error) return { data: null, error: error.message }

  // تحديث رصيد العميل (زيادة الدين بالمبلغ المتبقي فقط)
  if (remaining > 0) {
    const { data: customer } = await supabase
      .from('customers')
      .select('current_balance')
      .eq('id', input.customer_id)
      .single()
    if (customer) {
      await supabase
        .from('customers')
        .update({
          current_balance: Number(customer.current_balance) + remaining,
          updated_at: new Date().toISOString(),
        })
        .eq('id', input.customer_id)
    }
  }

  return { data: data as Invoice, error: null }
}

/** تسجيل سداد فاتورة (كلي) + تخفيض رصيد العميل — تستقبل id الفاتورة فقط */
export async function markInvoicePaid(invoiceId: string): Promise<Result<boolean>> {
  const supabase = getSupabaseClient()

  // جلب الفاتورة أولاً لمعرفة المبلغ المتبقي والعميل المرتبط
  const { data: invoice, error: fetchError } = await supabase
    .from('invoices')
    .select('id, customer_id, total_amount, paid_amount')
    .eq('id', invoiceId)
    .single()
  if (fetchError || !invoice)
    return { data: null, error: fetchError?.message ?? 'الفاتورة غير موجودة' }

  const remaining = Number(invoice.total_amount) - Number(invoice.paid_amount)

  const { error } = await supabase
    .from('invoices')
    .update({
      paid_amount: invoice.total_amount,
      status: 'paid',
      updated_at: new Date().toISOString(),
    })
    .eq('id', invoice.id)
  if (error) return { data: null, error: error.message }

  // تخفيض دين العميل
  const { data: customer } = await supabase
    .from('customers')
    .select('current_balance')
    .eq('id', invoice.customer_id)
    .single()
  if (customer) {
    await supabase
      .from('customers')
      .update({
        current_balance: Math.max(0, Number(customer.current_balance) - remaining),
        updated_at: new Date().toISOString(),
      })
      .eq('id', invoice.customer_id)
  }

  return { data: true, error: null }
}

/** حذف فاتورة + تخفيض رصيد العميل بالمبلغ غير المسدد — تستقبل id الفاتورة فقط */
export async function deleteInvoice(invoiceId: string): Promise<Result<boolean>> {
  const supabase = getSupabaseClient()

  // جلب الفاتورة أولاً لمعرفة المبلغ المتبقي والعميل المرتبط
  const { data: invoice, error: fetchError } = await supabase
    .from('invoices')
    .select('id, customer_id, total_amount, paid_amount')
    .eq('id', invoiceId)
    .single()
  if (fetchError || !invoice)
    return { data: null, error: fetchError?.message ?? 'الفاتورة غير موجودة' }

  const remaining = Number(invoice.total_amount) - Number(invoice.paid_amount)

  const { error } = await supabase.from('invoices').delete().eq('id', invoice.id)
  if (error) return { data: null, error: error.message }

  if (remaining > 0) {
    const { data: customer } = await supabase
      .from('customers')
      .select('current_balance')
      .eq('id', invoice.customer_id)
      .single()
    if (customer) {
      await supabase
        .from('customers')
        .update({
          current_balance: Math.max(0, Number(customer.current_balance) - remaining),
          updated_at: new Date().toISOString(),
        })
        .eq('id', invoice.customer_id)
    }
  }

  return { data: true, error: null }
}

/* =====================================================================
 * المنتجات (Products)
 * ===================================================================== */

/** جلب كل المنتجات */
export async function fetchProducts(): Promise<Result<Product[]>> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  return { data: (data as Product[]) ?? [], error: error?.message ?? null }
}

/** إضافة منتج جديد */
export async function createProduct(input: {
  name: string
  sku?: string
  price: number
  quantity_on_hand: number
  minimum_quantity: number
  category?: string
  notes?: string
}): Promise<Result<Product>> {
  const supabase = getSupabaseClient()
  const userId = await getUserId()
  if (!userId) return { data: null, error: 'يجب تسجيل الدخول أولاً' }

  const { data, error } = await supabase
    .from('products')
    .insert({
      user_id: userId,
      name: input.name,
      sku: input.sku || null,
      price: input.price,
      quantity_on_hand: input.quantity_on_hand,
      minimum_quantity: input.minimum_quantity,
      category: input.category || null,
      notes: input.notes || null,
    })
    .select()
    .single()
  return { data: data as Product, error: error?.message ?? null }
}

/** تعديل منتج (بما فيها الكمية) */
export async function updateProduct(
  id: string,
  input: Partial<Pick<Product, 'name' | 'sku' | 'price' | 'quantity_on_hand' | 'minimum_quantity' | 'category' | 'notes'>>
): Promise<Result<Product>> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('products')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  return { data: data as Product, error: error?.message ?? null }
}

/** حذف منتج */
export async function deleteProduct(id: string): Promise<Result<boolean>> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from('products').delete().eq('id', id)
  return { data: !error, error: error?.message ?? null }
}

/* =====================================================================
 * لوحة التحكم (Dashboard) — إحصائيات مجمعة
 * ===================================================================== */

export interface DashboardStats {
  /** إجمالي الفلوس عند العملاء (الآجل) */
  totalReceivables: number
  /** عدد الفواتير غير المدفوعة */
  pendingInvoicesCount: number
  /** الفواتير المستحقة خلال 7 أيام */
  dueSoonInvoices: Invoice[]
  /** الفواتير المتأخرة */
  overdueInvoices: Invoice[]
  /** منتجات تحت الحد الأدنى */
  lowStockProducts: Product[]
  /** عدد العملاء */
  customersCount: number
}

/** جلب كل إحصائيات لوحة التحكم في طلب واحد مجمع */
export async function fetchDashboardStats(): Promise<Result<DashboardStats>> {
  const [invoicesRes, productsRes, customersRes] = await Promise.all([
    fetchInvoices(),
    fetchProducts(),
    fetchCustomers(),
  ])

  if (invoicesRes.error) return { data: null, error: invoicesRes.error }
  if (productsRes.error) return { data: null, error: productsRes.error }
  if (customersRes.error) return { data: null, error: customersRes.error }

  const invoices = invoicesRes.data ?? []
  const products = productsRes.data ?? []
  const customers = customersRes.data ?? []

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const in7days = new Date(today)
  in7days.setDate(in7days.getDate() + 7)

  const unpaid = invoices.filter((i) => i.status !== 'paid')

  const overdueInvoices = unpaid.filter((i) => new Date(i.due_date) < today)
  const dueSoonInvoices = unpaid.filter((i) => {
    const due = new Date(i.due_date)
    return due >= today && due <= in7days
  })

  const totalReceivables = unpaid.reduce(
    (sum, i) => sum + (Number(i.total_amount) - Number(i.paid_amount)),
    0
  )

  const lowStockProducts = products.filter(
    (p) => p.quantity_on_hand <= p.minimum_quantity
  )

  return {
    data: {
      totalReceivables,
      pendingInvoicesCount: unpaid.length,
      dueSoonInvoices,
      overdueInvoices,
      lowStockProducts,
      customersCount: customers.length,
    },
    error: null,
  }
}
