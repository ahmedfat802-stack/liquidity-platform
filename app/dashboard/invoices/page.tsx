'use client'

/**
 * =====================================================================
 * صفحة الفواتير — منصة "سيولة"
 * =====================================================================
 * - بيانات حقيقية من Supabase عبر lib/data.ts
 *   (fetchInvoices / markInvoicePaid / deleteInvoice)
 * - تبويبات فلترة: الكل / متأخرة / غير مدفوعة / مدفوعة
 * - تعليم الفاتورة كمدفوعة + حذف مع تأكيد + حالة فارغة
 * =====================================================================
 */

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  FileText,
  Plus,
  Trash2,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Clock,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { fetchInvoices, markInvoicePaid, deleteInvoice, type Invoice } from '@/lib/data'
import { formatCurrency } from '@/lib/utils'

/** حساب عدد الأيام حتى/منذ تاريخ الاستحقاق */
function daysUntil(dateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dateStr)
  due.setHours(0, 0, 0, 0)
  return Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

/** تصنيف حالة الفاتورة للعرض */
function invoiceState(inv: Invoice): 'paid' | 'overdue' | 'pending' {
  if (inv.status === 'paid' || Number(inv.paid_amount) >= Number(inv.total_amount)) return 'paid'
  if (daysUntil(inv.due_date) < 0) return 'overdue'
  return 'pending'
}

type Tab = 'all' | 'overdue' | 'pending' | 'paid'

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('all')
  const [busyId, setBusyId] = useState<string | null>(null)

  useEffect(() => {
    fetchInvoices().then(({ data, error }) => {
      setInvoices(data ?? [])
      setError(error)
      setLoading(false)
    })
  }, [])

  /** تعليم الفاتورة كمدفوعة بالكامل */
  const handleMarkPaid = async (inv: Invoice) => {
    setBusyId(inv.id)
    const { error } = await markInvoicePaid(inv.id)
    if (!error) {
      setInvoices((prev) =>
        prev.map((i) =>
          i.id === inv.id ? { ...i, status: 'paid', paid_amount: i.total_amount } : i
        )
      )
    }
    setBusyId(null)
  }

  /** حذف فاتورة */
  const handleDelete = async (id: string) => {
    setBusyId(id)
    const { error } = await deleteInvoice(id)
    if (!error) setInvoices((prev) => prev.filter((i) => i.id !== id))
    setBusyId(null)
  }

  const counts = useMemo(
    () => ({
      all: invoices.length,
      overdue: invoices.filter((i) => invoiceState(i) === 'overdue').length,
      pending: invoices.filter((i) => invoiceState(i) === 'pending').length,
      paid: invoices.filter((i) => invoiceState(i) === 'paid').length,
    }),
    [invoices]
  )

  const filtered = useMemo(
    () => (tab === 'all' ? invoices : invoices.filter((i) => invoiceState(i) === tab)),
    [invoices, tab]
  )

  const totalOutstanding = invoices
    .filter((i) => invoiceState(i) !== 'paid')
    .reduce((s, i) => s + (Number(i.total_amount) - Number(i.paid_amount)), 0)

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">جاري تحميل الفواتير...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <AlertTriangle className="w-8 h-8 text-destructive" />
        <p className="text-muted-foreground">حدث خطأ: {error}</p>
        <Button onClick={() => location.reload()}>إعادة المحاولة</Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* العنوان */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">الفواتير</h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            إجمالي المستحق لك حالياً:{' '}
            <span className="font-bold text-foreground">{formatCurrency(totalOutstanding)}</span>
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/invoices/new">
            <Plus className="w-4 h-4 ml-2" />
            فاتورة جديدة
          </Link>
        </Button>
      </div>

      {/* التبويبات */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)} dir="rtl">
        <TabsList className="h-11">
          <TabsTrigger value="all" className="px-5">
            الكل ({counts.all})
          </TabsTrigger>
          <TabsTrigger value="overdue" className="px-5">
            متأخرة ({counts.overdue})
          </TabsTrigger>
          <TabsTrigger value="pending" className="px-5">
            غير مدفوعة ({counts.pending})
          </TabsTrigger>
          <TabsTrigger value="paid" className="px-5">
            مدفوعة ({counts.paid})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* القائمة */}
      {filtered.length === 0 ? (
        <Card className="shadow-sm">
          <CardContent className="py-16 flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">
                {invoices.length === 0 ? 'لا توجد فواتير بعد' : 'لا توجد فواتير في هذا التصنيف'}
              </h3>
              <p className="text-muted-foreground text-sm mt-2">
                {invoices.length === 0
                  ? 'سجّل أول فاتورة آجل لتبدأ المتابعة'
                  : 'جرّب تبويباً آخر'}
              </p>
            </div>
            {invoices.length === 0 && (
              <Button asChild className="mt-2">
                <Link href="/dashboard/invoices/new">
                  <Plus className="w-4 h-4 ml-2" />
                  فاتورة جديدة
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((inv) => {
            const state = invoiceState(inv)
            const d = daysUntil(inv.due_date)
            const remaining = Number(inv.total_amount) - Number(inv.paid_amount)

            return (
              <Card key={inv.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-5">
                    {/* بيانات الفاتورة */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          state === 'paid'
                            ? 'bg-emerald-50'
                            : state === 'overdue'
                            ? 'bg-red-50'
                            : 'bg-amber-50'
                        }`}
                      >
                        <FileText
                          className={`w-5 h-5 ${
                            state === 'paid'
                              ? 'text-emerald-600'
                              : state === 'overdue'
                              ? 'text-red-600'
                              : 'text-amber-600'
                          }`}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <p className="font-semibold text-foreground" dir="ltr">
                            {inv.invoice_number}
                          </p>
                          {state === 'paid' && (
                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                              مدفوعة
                            </Badge>
                          )}
                          {state === 'overdue' && (
                            <Badge variant="destructive">متأخرة {Math.abs(d)} يوم</Badge>
                          )}
                          {state === 'pending' && (
                            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                              <Clock className="w-3 h-3 ml-1" />
                              {d === 0 ? 'تستحق اليوم' : `بعد ${d} يوم`}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1.5">
                          العميل: <span className="font-medium">{inv.customers?.name ?? '—'}</span>
                          {' · '}
                          تاريخ الاستحقاق:{' '}
                          <span dir="ltr">{new Date(inv.due_date).toLocaleDateString('ar-EG')}</span>
                        </p>
                      </div>
                    </div>

                    {/* المبالغ */}
                    <div className="flex items-center gap-8 lg:gap-10">
                      <div>
                        <p className="text-xs text-muted-foreground">الإجمالي</p>
                        <p className="font-bold text-foreground mt-1">
                          {formatCurrency(Number(inv.total_amount))}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">المتبقي</p>
                        <p
                          className={`font-bold mt-1 ${
                            state === 'paid' ? 'text-emerald-600' : 'text-red-600'
                          }`}
                        >
                          {formatCurrency(remaining)}
                        </p>
                      </div>
                    </div>

                    {/* الإجراءات */}
                    <div className="flex items-center gap-2 lg:mr-auto">
                      {state !== 'paid' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                          disabled={busyId === inv.id}
                          onClick={() => handleMarkPaid(inv)}
                        >
                          {busyId === inv.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4 ml-1.5" />
                              تم السداد
                            </>
                          )}
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-destructive"
                            disabled={busyId === inv.id}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent dir="rtl">
                          <AlertDialogHeader>
                            <AlertDialogTitle>حذف الفاتورة {inv.invoice_number}؟</AlertDialogTitle>
                            <AlertDialogDescription>
                              سيتم حذف الفاتورة نهائياً ولن يمكن استرجاعها.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>إلغاء</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive hover:bg-destructive/90"
                              onClick={() => handleDelete(inv.id)}
                            >
                              حذف نهائياً
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
