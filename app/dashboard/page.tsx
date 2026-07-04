'use client'

/**
 * =====================================================================
 * لوحة التحكم الرئيسية — منصة "سيولة"
 * =====================================================================
 * - تعرض بيانات حقيقية من Supabase عبر lib/data.ts (fetchDashboardStats)
 * - كروت إحصائيات + تنبيهات ذكية + الفواتير القريبة/المتأخرة + إجراءات سريعة
 * - قاعدة ثابتة: لا استعلامات Supabase مباشرة هنا — كل شيء عبر lib/data.ts
 * =====================================================================
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Users,
  FileText,
  AlertTriangle,
  Wallet,
  Package,
  Plus,
  ArrowLeft,
  Clock,
  Loader2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { fetchDashboardStats, type DashboardStats } from '@/lib/data'
import { formatCurrency } from '@/lib/utils'

/** حساب عدد الأيام المتبقية حتى تاريخ الاستحقاق */
function daysUntil(dateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dateStr)
  due.setHours(0, 0, 0, 0)
  return Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardStats().then(({ data, error }) => {
      setStats(data)
      setError(error)
      setLoading(false)
    })
  }, [])

  /* ------------------------- حالة التحميل ------------------------- */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">جاري تحميل بياناتك...</p>
      </div>
    )
  }

  /* ------------------------- حالة الخطأ ------------------------- */
  if (error || !stats) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <AlertTriangle className="w-8 h-8 text-destructive" />
        <p className="text-muted-foreground">حدث خطأ أثناء تحميل البيانات: {error}</p>
        <Button onClick={() => location.reload()}>إعادة المحاولة</Button>
      </div>
    )
  }

  const alertsCount =
    stats.overdueInvoices.length + stats.dueSoonInvoices.length + stats.lowStockProducts.length

  const statCards = [
    {
      title: 'فلوسك عند العملاء',
      value: formatCurrency(stats.totalReceivables),
      icon: Wallet,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      hint: 'إجمالي الآجل غير المسدد',
    },
    {
      title: 'فواتير غير مدفوعة',
      value: String(stats.pendingInvoicesCount),
      icon: FileText,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      hint: `${stats.overdueInvoices.length} منها متأخرة`,
    },
    {
      title: 'عدد العملاء',
      value: String(stats.customersCount),
      icon: Users,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      hint: 'إجمالي عملاء الآجل',
    },
    {
      title: 'تنبيهات نشطة',
      value: String(alertsCount),
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      hint: 'تحتاج إلى انتباهك',
    },
  ]

  return (
    <div className="space-y-8">
      {/* العنوان */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">لوحة التحكم</h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            نظرة شاملة على سيولتك وفلوسك عند العملاء
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/dashboard/invoices/new">
              <Plus className="w-4 h-4 ml-2" />
              فاتورة جديدة
            </Link>
          </Button>
        </div>
      </div>

      {/* كروت الإحصائيات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <Card key={card.title} className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="text-2xl font-bold text-foreground">{card.value}</p>
                  <p className="text-xs text-muted-foreground">{card.hint}</p>
                </div>
                <div className={`w-11 h-11 rounded-xl ${card.bg} flex items-center justify-center`}>
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* التنبيهات الذكية */}
      {alertsCount > 0 && (
        <Card className="shadow-sm border-amber-200 bg-amber-50/40">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              التنبيهات الذكية
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.overdueInvoices.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between gap-4 p-4 rounded-lg bg-red-50 border border-red-100"
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-900">
                    فاتورة <span className="font-bold">{inv.invoice_number}</span> للعميل{' '}
                    <span className="font-bold">{inv.customers?.name ?? '—'}</span> متأخرة{' '}
                    {Math.abs(daysUntil(inv.due_date))} يوم — المتبقي{' '}
                    {formatCurrency(Number(inv.total_amount) - Number(inv.paid_amount))}
                  </p>
                </div>
                <Badge variant="destructive">متأخرة</Badge>
              </div>
            ))}
            {stats.dueSoonInvoices.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between gap-4 p-4 rounded-lg bg-amber-50 border border-amber-100"
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <p className="text-sm text-amber-900">
                    فاتورة <span className="font-bold">{inv.invoice_number}</span> للعميل{' '}
                    <span className="font-bold">{inv.customers?.name ?? '—'}</span> تستحق خلال{' '}
                    {daysUntil(inv.due_date)} يوم — المبلغ{' '}
                    {formatCurrency(Number(inv.total_amount) - Number(inv.paid_amount))}
                  </p>
                </div>
                <Badge className="bg-amber-500 hover:bg-amber-500">قريبة</Badge>
              </div>
            ))}
            {stats.lowStockProducts.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-4 p-4 rounded-lg bg-orange-50 border border-orange-100"
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  <p className="text-sm text-orange-900">
                    مخزون <span className="font-bold">{p.name}</span> منخفض:{' '}
                    {p.quantity_on_hand} متبقي (الحد الأدنى {p.minimum_quantity})
                  </p>
                </div>
                <Badge className="bg-orange-500 hover:bg-orange-500">مخزون</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* حالة فارغة للمستخدم الجديد */}
      {stats.customersCount === 0 && stats.pendingInvoicesCount === 0 && (
        <Card className="shadow-sm">
          <CardContent className="py-16 flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Wallet className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-lg">أهلاً بك في سيولة!</h3>
              <p className="text-muted-foreground text-sm mt-2 max-w-md">
                ابدأ بإضافة عملائك، ثم سجّل فواتير الآجل، وسيولة هتتابع لك كل حاجة وتنبهك في
                الوقت المناسب.
              </p>
            </div>
            <div className="flex gap-3 mt-2">
              <Button asChild>
                <Link href="/dashboard/customers/new">
                  <Plus className="w-4 h-4 ml-2" />
                  أضف أول عميل
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/products/new">أضف منتج</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* الفواتير القريبة + الإجراءات السريعة */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* الفواتير القادمة */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base">الفواتير القادمة والمتأخرة</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/invoices" className="text-primary">
                عرض الكل
                <ArrowLeft className="w-4 h-4 mr-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {stats.overdueInvoices.length === 0 && stats.dueSoonInvoices.length === 0 ? (
              <div className="py-10 text-center text-muted-foreground text-sm">
                لا توجد فواتير مستحقة قريباً — كل شيء تحت السيطرة
              </div>
            ) : (
              <div className="space-y-3">
                {[...stats.overdueInvoices, ...stats.dueSoonInvoices].slice(0, 6).map((inv) => {
                  const d = daysUntil(inv.due_date)
                  const remaining = Number(inv.total_amount) - Number(inv.paid_amount)
                  return (
                    <div
                      key={inv.id}
                      className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border hover:bg-muted/40 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {inv.customers?.name ?? '—'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1" dir="ltr">
                          {inv.invoice_number}
                        </p>
                      </div>
                      <div className="text-left flex-shrink-0">
                        <p className="text-sm font-bold text-foreground">
                          {formatCurrency(remaining)}
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            d < 0 ? 'text-red-600 font-medium' : 'text-muted-foreground'
                          }`}
                        >
                          {d < 0 ? `متأخرة ${Math.abs(d)} يوم` : d === 0 ? 'تستحق اليوم' : `بعد ${d} يوم`}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* إجراءات سريعة */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">إجراءات سريعة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start h-11" asChild>
              <Link href="/dashboard/customers/new">
                <Users className="w-4 h-4 ml-3 text-primary" />
                إضافة عميل جديد
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start h-11" asChild>
              <Link href="/dashboard/invoices/new">
                <FileText className="w-4 h-4 ml-3 text-primary" />
                تسجيل فاتورة آجل
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start h-11" asChild>
              <Link href="/dashboard/products/new">
                <Package className="w-4 h-4 ml-3 text-primary" />
                إضافة منتج للمخزون
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
