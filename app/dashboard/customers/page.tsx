'use client'

/**
 * =====================================================================
 * صفحة العملاء — منصة "سيولة"
 * =====================================================================
 * - بيانات حقيقية من Supabase عبر lib/data.ts (fetchCustomers/deleteCustomer)
 * - بحث فوري + كروت إحصائيات + حالة فارغة + حذف مع تأكيد
 * - قاعدة ثابتة: لا استعلامات Supabase مباشرة هنا — كل شيء عبر lib/data.ts
 * =====================================================================
 */

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Users, Plus, Search, Trash2, Phone, Loader2, AlertTriangle, Wallet } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
import { fetchCustomers, deleteCustomer, type Customer } from '@/lib/data'
import { formatCurrency } from '@/lib/utils'

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchCustomers().then(({ data, error }) => {
      setCustomers(data ?? [])
      setError(error)
      setLoading(false)
    })
  }, [])

  /** حذف عميل مع تحديث القائمة فوراً */
  const handleDelete = async (id: string) => {
    setDeletingId(id)
    const { error } = await deleteCustomer(id)
    if (!error) setCustomers((prev) => prev.filter((c) => c.id !== id))
    setDeletingId(null)
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return customers
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.phone ?? '').includes(q) ||
        (c.email ?? '').toLowerCase().includes(q)
    )
  }, [customers, search])

  const totalBalance = customers.reduce((s, c) => s + Number(c.current_balance), 0)
  const debtors = customers.filter((c) => Number(c.current_balance) > 0).length

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">جاري تحميل العملاء...</p>
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
          <h1 className="text-2xl font-bold text-foreground">العملاء</h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            إدارة عملاء الآجل ومتابعة أرصدتهم
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/customers/new">
            <Plus className="w-4 h-4 ml-2" />
            إضافة عميل
          </Link>
        </Button>
      </div>

      {/* كروت الإحصائيات */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">إجمالي العملاء</p>
              <p className="text-xl font-bold text-foreground mt-1">{customers.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">إجمالي الفلوس عندهم</p>
              <p className="text-xl font-bold text-foreground mt-1">
                {formatCurrency(totalBalance)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">عملاء عليهم فلوس</p>
              <p className="text-xl font-bold text-foreground mt-1">{debtors}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* البحث */}
      <div className="relative max-w-md">
        <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="ابحث بالاسم أو الهاتف أو البريد..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pr-10 h-11"
        />
      </div>

      {/* القائمة */}
      {filtered.length === 0 ? (
        <Card className="shadow-sm">
          <CardContent className="py-16 flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Users className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">
                {customers.length === 0 ? 'لا يوجد عملاء بعد' : 'لا توجد نتائج للبحث'}
              </h3>
              <p className="text-muted-foreground text-sm mt-2">
                {customers.length === 0
                  ? 'أضف أول عميل لتبدأ في متابعة الآجل'
                  : 'جرّب كلمة بحث مختلفة'}
              </p>
            </div>
            {customers.length === 0 && (
              <Button asChild className="mt-2">
                <Link href="/dashboard/customers/new">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة عميل
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((customer) => {
            const balance = Number(customer.current_balance)
            return (
              <Card key={customer.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-primary">
                          {customer.name.charAt(0)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate">{customer.name}</p>
                        {customer.phone && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Phone className="w-3 h-3" />
                            <span dir="ltr">{customer.phone}</span>
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge
                      variant={balance > 0 ? 'destructive' : 'secondary'}
                      className={
                        balance === 0
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                          : ''
                      }
                    >
                      {balance > 0 ? 'عليه فلوس' : 'مسدد'}
                    </Badge>
                  </div>

                  <div className="mt-5 pt-5 border-t border-border flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">الرصيد الحالي</p>
                      <p
                        className={`text-lg font-bold mt-1 ${
                          balance > 0 ? 'text-red-600' : 'text-emerald-600'
                        }`}
                      >
                        {formatCurrency(balance)}
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-destructive"
                          disabled={deletingId === customer.id}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent dir="rtl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>حذف العميل {customer.name}؟</AlertDialogTitle>
                          <AlertDialogDescription>
                            سيتم حذف العميل وجميع فواتيره نهائياً. لا يمكن التراجع عن هذا
                            الإجراء.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>إلغاء</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive hover:bg-destructive/90"
                            onClick={() => handleDelete(customer.id)}
                          >
                            حذف نهائياً
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
