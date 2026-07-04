'use client'

/**
 * =====================================================================
 * صفحة إضافة عميل جديد — منصة "سيولة"
 * =====================================================================
 * - تحفظ العميل فعلياً في Supabase عبر createCustomer من lib/data.ts
 * - تحقق من صحة المدخلات + رسائل خطأ عربية + إعادة توجيه بعد النجاح
 * =====================================================================
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Loader2, UserPlus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createCustomer } from '@/lib/data'

export default function NewCustomerPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    credit_limit: '',
    current_balance: '',
  })

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // تحقق أساسي من المدخلات
    if (!form.name.trim()) {
      setError('اسم العميل مطلوب')
      return
    }

    setSaving(true)
    const { error } = await createCustomer({
      name: form.name.trim(),
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
      address: form.address.trim() || null,
      credit_limit: form.credit_limit ? Number(form.credit_limit) : 0,
      current_balance: form.current_balance ? Number(form.current_balance) : 0,
    })
    setSaving(false)

    if (error) {
      setError(error)
      return
    }
    router.push('/dashboard/customers')
    router.refresh()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* العنوان مع زر الرجوع */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/customers">
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">إضافة عميل جديد</h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            سجّل بيانات العميل لتتابع الآجل الخاص به
          </p>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            بيانات العميل
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
              <Label htmlFor="name">
                اسم العميل <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="مثال: أحمد محمد"
                value={form.name}
                onChange={set('name')}
                className="h-11"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input
                  id="phone"
                  placeholder="01xxxxxxxxx"
                  value={form.phone}
                  onChange={set('phone')}
                  className="h-11"
                  dir="ltr"
                />
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="customer@email.com"
                  value={form.email}
                  onChange={set('email')}
                  className="h-11"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="address">العنوان</Label>
              <Textarea
                id="address"
                placeholder="عنوان العميل (اختياري)"
                value={form.address}
                onChange={set('address')}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <Label htmlFor="credit_limit">حد الائتمان (ج.م)</Label>
                <Input
                  id="credit_limit"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0"
                  value={form.credit_limit}
                  onChange={set('credit_limit')}
                  className="h-11"
                  dir="ltr"
                />
                <p className="text-xs text-muted-foreground">
                  أقصى مبلغ آجل مسموح به لهذا العميل
                </p>
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="current_balance">رصيد افتتاحي عليه (ج.م)</Label>
                <Input
                  id="current_balance"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0"
                  value={form.current_balance}
                  onChange={set('current_balance')}
                  className="h-11"
                  dir="ltr"
                />
                <p className="text-xs text-muted-foreground">
                  لو عليه فلوس قديمة قبل استخدام المنصة
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving} className="h-11 px-8">
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  'حفظ العميل'
                )}
              </Button>
              <Button type="button" variant="outline" className="h-11" asChild>
                <Link href="/dashboard/customers">إلغاء</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
