'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Package, DollarSign, Hash, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', sku: '', price: '', stock: '', minStock: '', unit: '' })
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    router.push('/dashboard/products')
  }
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild className="w-8 h-8"><Link href="/dashboard/products"><ArrowRight className="w-4 h-4" /></Link></Button>
        <div><h1 className="text-2xl font-bold text-foreground">إضافة منتج جديد</h1><p className="text-muted-foreground text-sm">أضف منتج لمتابعة مخزونه</p></div>
      </div>
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-4"><CardTitle className="text-base">بيانات المنتج</CardTitle><CardDescription>أدخل تفاصيل المنتج والمخزون</CardDescription></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium flex items-center gap-1.5"><Package className="w-3.5 h-3.5" />اسم المنتج *</Label>
              <Input id="name" placeholder="مثال: قماش قطن أبيض" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="h-11" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="sku" className="text-sm font-medium flex items-center gap-1.5"><Hash className="w-3.5 h-3.5" />الكود</Label>
                <Input id="sku" placeholder="FAB-001" value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit" className="text-sm font-medium">وحدة القياس *</Label>
                <Input id="unit" placeholder="متر / حبة / كيلو" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} required className="h-11" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" />السعر (ج.م) *</Label>
              <Input id="price" type="number" placeholder="0.00" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required className="h-11" min="0" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="stock" className="text-sm font-medium">الكمية الحالية *</Label>
                <Input id="stock" type="number" placeholder="0" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required className="h-11" min="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minStock" className="text-sm font-medium flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" />الحد الأدنى *</Label>
                <Input id="minStock" type="number" placeholder="0" value={form.minStock} onChange={e => setForm({...form, minStock: e.target.value})} required className="h-11" min="0" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1 h-11" disabled={loading}>{loading ? 'جاري الحفظ...' : 'حفظ المنتج'}</Button>
              <Button type="button" variant="outline" className="h-11" asChild><Link href="/dashboard/products">إلغاء</Link></Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
