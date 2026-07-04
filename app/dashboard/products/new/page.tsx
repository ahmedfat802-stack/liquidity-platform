'use client'

/**
 * =====================================================================
 * صفحة إضافة منتج جديد — منصة "سيولة"
 * =====================================================================
 * - تحفظ المنتج فعلياً في Supabase عبر createProduct من lib/data.ts
 * - حقول: الاسم (مطلوب)، الكود، السعر (مطلوب)، الكمية (مطلوب)،
 *   الحد الأدنى للتنبيه، التصنيف، ملاحظات
 * - تحقق من المدخلات + رسائل خطأ عربية
 * =====================================================================
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Loader2, PackagePlus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createProduct } from '@/lib/data'

export default function NewProductPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    sku: '',
    price: '',
    quantity_on_hand: '',
    minimum_quantity: '',
    category: '',
    notes: '',
  })

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // تحقق من المدخلات
    if (!form.name.trim()) return setError('اسم المنتج مطلوب')
    const price = Number(form.price)
    if (form.price === '' || isNaN(price) || price < 0) return setError('أدخل سعر المنتج بشكل صحيح')
    const qty = Number(form.quantity_on_hand)
    if (form.quantity_on_hand === '' || isNaN(qty) || qty < 0)
      return setError('أدخل الكمية المتوفرة بشكل صحيح')
    const minQty = Number(form.minimum_quantity || 0)
    if (minQty < 0) return setError('الحد الأدنى للكمية لا يمكن أن يكون سالباً')

    setSaving(true)
    const { error } = await createProduct({
      name: form.name.trim(),
      sku: form.sku.trim() || undefined,
      price,
      quantity_on_hand: qty,
      minimum_quantity: minQty,
      category: form.category.trim() || undefined,
      notes: form.notes.trim() || undefined,
    })
    setSaving(false)

    if (error) return setError(error)
    router.push('/dashboard/products')
    router.refresh()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* العنوان */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/products">
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">إضافة منتج جديد</h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            سجّل المنتج وحدد الحد الأدنى عشان سيولة تنبهك قبل ما يخلص
          </p>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <PackagePlus className="w-5 h-5 text-primary" />
            بيانات المنتج
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <Label htmlFor="name">
                  اسم المنتج <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="مثال: سكر 1 كجم"
                  value={form.name}
                  onChange={set('name')}
                  className="h-11"
                  required
                />
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="sku">كود المنتج (SKU)</Label>
                <Input
                  id="sku"
                  placeholder="SKU-001"
                  value={form.sku}
                  onChange={set('sku')}
                  className="h-11"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <Label htmlFor="price">
                  سعر البيع (ج.م) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={form.price}
                  onChange={set('price')}
                  className="h-11"
                  dir="ltr"
                  required
                />
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="category">التصنيف</Label>
                <Input
                  id="category"
                  placeholder="مثال: مواد غذائية"
                  value={form.category}
                  onChange={set('category')}
                  className="h-11"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <Label htmlFor="quantity_on_hand">
                  الكمية المتوفرة <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="quantity_on_hand"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="0"
                  value={form.quantity_on_hand}
                  onChange={set('quantity_on_hand')}
                  className="h-11"
                  dir="ltr"
                  required
                />
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="minimum_quantity">الحد الأدنى للتنبيه</Label>
                <Input
                  id="minimum_quantity"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="مثال: 10"
                  value={form.minimum_quantity}
                  onChange={set('minimum_quantity')}
                  className="h-11"
                  dir="ltr"
                />
                <p className="text-xs text-muted-foreground">
                  هننبهك لما الكمية توصل لهذا الرقم أو أقل
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="notes">ملاحظات</Label>
              <Textarea
                id="notes"
                placeholder="أي تفاصيل إضافية (اختياري)"
                value={form.notes}
                onChange={set('notes')}
                rows={2}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving} className="h-11 px-8">
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  'حفظ المنتج'
                )}
              </Button>
              <Button type="button" variant="outline" className="h-11" asChild>
                <Link href="/dashboard/products">إلغاء</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
