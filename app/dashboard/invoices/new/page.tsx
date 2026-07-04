'use client'

/**
 * =====================================================================
 * صفحة إنشاء فاتورة آجل جديدة — منصة "سيولة"
 * =====================================================================
 * - تجلب العملاء الفعليين من Supabase لاختيار عميل الفاتورة
 * - تحفظ الفاتورة عبر createInvoice من lib/data.ts
 *   (والتي تحدّث رصيد العميل تلقائياً)
 * - توليد رقم فاتورة تلقائي + تحقق من المدخلات
 * =====================================================================
 */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Loader2, FileText, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { fetchCustomers, createInvoice, type Customer } from '@/lib/data'

/** توليد رقم فاتورة تلقائي مثل INV-20260704-483 */
function generateInvoiceNumber(): string {
  const d = new Date()
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(
    d.getDate()
  ).padStart(2, '0')}`
  return `INV-${ymd}-${Math.floor(100 + Math.random() * 900)}`
}

/** تاريخ اليوم بصيغة YYYY-MM-DD لحقل التاريخ */
function todayStr(): string {
  return new Date().toISOString().split('T')[0]
}

export default function NewInvoicePage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loadingCustomers, setLoadingCustomers] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    customer_id: '',
    invoice_number: generateInvoiceNumber(),
    invoice_date: todayStr(),
    due_date: '',
    total_amount: '',
    paid_amount: '',
    notes: '',
  })

  useEffect(() => {
    fetchCustomers().then(({ data }) => {
      setCustomers(data ?? [])
      setLoadingCustomers(false)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // تحقق من المدخلات
    if (!form.customer_id) return setError('اختر العميل أولاً')
    if (!form.due_date) return setError('حدد تاريخ الاستحقاق')
    const total = Number(form.total_amount)
    if (!total || total <= 0) return setError('أدخل مبلغ الفاتورة بشكل صحيح')
    const paid = Number(form.paid_amount || 0)
    if (paid < 0 || paid > total) return setError('المبلغ المدفوع يجب أن يكون بين 0 وإجمالي الفاتورة')
    if (new Date(form.due_date) < new Date(form.invoice_date))
      return setError('تاريخ الاستحقاق يجب أن يكون بعد تاريخ الفاتورة')

    setSaving(true)
    const { error } = await createInvoice({
      customer_id: form.customer_id,
      invoice_number: form.invoice_number,
      invoice_date: form.invoice_date,
      due_date: form.due_date,
      total_amount: total,
      paid_amount: paid,
      notes: form.notes.trim() || null,
    })
    setSaving(false)

    if (error) return setError(error)
    router.push('/dashboard/invoices')
    router.refresh()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* العنوان */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/invoices">
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">فاتورة آجل جديدة</h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            سجّل الفاتورة وسيولة هتحدّث رصيد العميل وتنبهك قبل الاستحقاق
          </p>
        </div>
      </div>

      {/* لا يوجد عملاء؟ وجّه المستخدم لإضافة عميل أولاً */}
      {!loadingCustomers && customers.length === 0 ? (
        <Card className="shadow-sm">
          <CardContent className="py-16 flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Users className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">لازم تضيف عميل الأول</h3>
              <p className="text-muted-foreground text-sm mt-2">
                الفاتورة لازم تكون مرتبطة بعميل. أضف أول عميل وارجع هنا.
              </p>
            </div>
            <Button asChild className="mt-2">
              <Link href="/dashboard/customers/new">إضافة عميل</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              بيانات الفاتورة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="space-y-2.5">
                <Label>
                  العميل <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={form.customer_id}
                  onValueChange={(v) => setForm((f) => ({ ...f, customer_id: v }))}
                  dir="rtl"
                >
                  <SelectTrigger className="h-11">
                    <SelectValue
                      placeholder={loadingCustomers ? 'جاري تحميل العملاء...' : 'اختر العميل'}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <Label htmlFor="invoice_number">رقم الفاتورة</Label>
                  <Input
                    id="invoice_number"
                    value={form.invoice_number}
                    onChange={(e) => setForm((f) => ({ ...f, invoice_number: e.target.value }))}
                    className="h-11"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="invoice_date">تاريخ الفاتورة</Label>
                  <Input
                    id="invoice_date"
                    type="date"
                    value={form.invoice_date}
                    onChange={(e) => setForm((f) => ({ ...f, invoice_date: e.target.value }))}
                    className="h-11"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <Label htmlFor="due_date">
                    تاريخ الاستحقاق <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={form.due_date}
                    onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))}
                    className="h-11"
                    dir="ltr"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    هننبهك قبل هذا التاريخ بـ 3 أيام
                  </p>
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="total_amount">
                    إجمالي الفاتورة (ج.م) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="total_amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    value={form.total_amount}
                    onChange={(e) => setForm((f) => ({ ...f, total_amount: e.target.value }))}
                    className="h-11"
                    dir="ltr"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="paid_amount">مبلغ مدفوع مقدماً (ج.م)</Label>
                <Input
                  id="paid_amount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={form.paid_amount}
                  onChange={(e) => setForm((f) => ({ ...f, paid_amount: e.target.value }))}
                  className="h-11 max-w-xs"
                  dir="ltr"
                />
                <p className="text-xs text-muted-foreground">
                  لو العميل دفع جزء من الفاتورة عند الشراء
                </p>
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="notes">ملاحظات</Label>
                <Textarea
                  id="notes"
                  placeholder="أي تفاصيل إضافية (اختياري)"
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={saving || loadingCustomers} className="h-11 px-8">
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    'حفظ الفاتورة'
                  )}
                </Button>
                <Button type="button" variant="outline" className="h-11" asChild>
                  <Link href="/dashboard/invoices">إلغاء</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
