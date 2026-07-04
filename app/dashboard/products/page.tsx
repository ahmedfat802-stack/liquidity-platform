'use client'

/**
 * =====================================================================
 * صفحة المنتجات والمخزون — منصة "سيولة"
 * =====================================================================
 * - بيانات حقيقية من Supabase عبر lib/data.ts (fetchProducts / deleteProduct)
 * - 3 كروت إحصائيات: إجمالي المنتجات / منخفضة المخزون / نفذت
 * - حالة كل منتج: متوفر / منخفض / نفذ (حسب quantity_on_hand vs minimum_quantity)
 * - بحث بالاسم أو SKU أو التصنيف + حذف مع تأكيد + حالة فارغة
 * =====================================================================
 */

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Package,
  Plus,
  Search,
  Trash2,
  Loader2,
  AlertTriangle,
  PackageX,
  PackageMinus,
} from 'lucide-react'
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
import { fetchProducts, deleteProduct, type Product } from '@/lib/data'
import { formatCurrency } from '@/lib/utils'

/** تصنيف حالة المخزون للمنتج */
function stockState(p: Product): 'available' | 'low' | 'out' {
  if (Number(p.quantity_on_hand) === 0) return 'out'
  if (Number(p.quantity_on_hand) <= Number(p.minimum_quantity)) return 'low'
  return 'available'
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts().then(({ data, error }) => {
      setProducts(data ?? [])
      setError(error)
      setLoading(false)
    })
  }, [])

  /** حذف منتج بعد التأكيد */
  const handleDelete = async (id: string) => {
    setBusyId(id)
    const { error } = await deleteProduct(id)
    if (!error) setProducts((prev) => prev.filter((p) => p.id !== id))
    setBusyId(null)
  }

  const stats = useMemo(
    () => ({
      total: products.length,
      low: products.filter((p) => stockState(p) === 'low').length,
      out: products.filter((p) => stockState(p) === 'out').length,
    }),
    [products]
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.sku ?? '').toLowerCase().includes(q) ||
        (p.category ?? '').toLowerCase().includes(q)
    )
  }, [products, query])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">جاري تحميل المنتجات...</p>
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
          <h1 className="text-2xl font-bold text-foreground">المنتجات والمخزون</h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            تابع مخزونك وسيولة هتنبهك لما أي منتج يقرب يخلص
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/products/new">
            <Plus className="w-4 h-4 ml-2" />
            منتج جديد
          </Link>
        </Button>
      </div>

      {/* كروت الإحصائيات */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">إجمالي المنتجات</p>
              <p className="text-2xl font-bold text-foreground mt-0.5">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
              <PackageMinus className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">مخزون منخفض</p>
              <p className="text-2xl font-bold text-amber-600 mt-0.5">{stats.low}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
              <PackageX className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">منتجات نفذت</p>
              <p className="text-2xl font-bold text-red-600 mt-0.5">{stats.out}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* البحث */}
      {products.length > 0 && (
        <div className="relative max-w-md">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ابحث بالاسم أو الكود أو التصنيف..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11 pr-10"
          />
        </div>
      )}

      {/* القائمة */}
      {filtered.length === 0 ? (
        <Card className="shadow-sm">
          <CardContent className="py-16 flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Package className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">
                {products.length === 0 ? 'لا توجد منتجات بعد' : 'لا توجد نتائج للبحث'}
              </h3>
              <p className="text-muted-foreground text-sm mt-2">
                {products.length === 0
                  ? 'أضف منتجاتك لتتابع المخزون وتوصلك تنبيهات قبل ما يخلص'
                  : 'جرّب كلمة بحث مختلفة'}
              </p>
            </div>
            {products.length === 0 && (
              <Button asChild className="mt-2">
                <Link href="/dashboard/products/new">
                  <Plus className="w-4 h-4 ml-2" />
                  منتج جديد
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((p) => {
            const state = stockState(p)
            return (
              <Card key={p.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 space-y-4">
                  {/* رأس الكارت */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          state === 'available'
                            ? 'bg-emerald-50'
                            : state === 'low'
                            ? 'bg-amber-50'
                            : 'bg-red-50'
                        }`}
                      >
                        <Package
                          className={`w-5 h-5 ${
                            state === 'available'
                              ? 'text-emerald-600'
                              : state === 'low'
                              ? 'text-amber-600'
                              : 'text-red-600'
                          }`}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate">{p.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5" dir="ltr">
                          {p.sku || '—'}
                        </p>
                      </div>
                    </div>
                    {state === 'available' && (
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 flex-shrink-0">
                        متوفر
                      </Badge>
                    )}
                    {state === 'low' && (
                      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 flex-shrink-0">
                        منخفض
                      </Badge>
                    )}
                    {state === 'out' && (
                      <Badge variant="destructive" className="flex-shrink-0">
                        نفذ
                      </Badge>
                    )}
                  </div>

                  {/* التفاصيل */}
                  <div className="grid grid-cols-3 gap-3 py-3 border-y border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">السعر</p>
                      <p className="font-bold text-foreground text-sm mt-1">
                        {formatCurrency(Number(p.price))}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">الكمية</p>
                      <p
                        className={`font-bold text-sm mt-1 ${
                          state === 'available'
                            ? 'text-foreground'
                            : state === 'low'
                            ? 'text-amber-600'
                            : 'text-red-600'
                        }`}
                      >
                        {p.quantity_on_hand}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">الحد الأدنى</p>
                      <p className="font-bold text-foreground text-sm mt-1">
                        {p.minimum_quantity}
                      </p>
                    </div>
                  </div>

                  {/* التصنيف + الحذف */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {p.category ? `التصنيف: ${p.category}` : 'بدون تصنيف'}
                    </span>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-destructive h-8"
                          disabled={busyId === p.id}
                        >
                          {busyId === p.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent dir="rtl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>حذف المنتج &quot;{p.name}&quot;؟</AlertDialogTitle>
                          <AlertDialogDescription>
                            سيتم حذف المنتج نهائياً ولن يمكن استرجاعه.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>إلغاء</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive hover:bg-destructive/90"
                            onClick={() => handleDelete(p.id)}
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
