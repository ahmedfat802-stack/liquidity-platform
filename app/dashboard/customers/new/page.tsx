'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, User, Phone, MapPin, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function NewCustomerPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', address: '', notes: '' })
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    router.push('/dashboard/customers')
  }
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild className="w-8 h-8"><Link href="/dashboard/customers"><ArrowRight className="w-4 h-4" /></Link></Button>
        <div><h1 className="text-2xl font-bold text-foreground">إضافة عميل جديد</h1><p className="text-muted-foreground text-sm">أضف بيانات العميل لمتابعة مستحقاته</p></div>
      </div>
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-4"><CardTitle className="text-base">بيانات العميل</CardTitle><CardDescription>أدخل بيانات العميل بدقة لتسهيل المتابعة</CardDescription></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium flex items-center gap-1.5"><User className="w-3.5 h-3.5" />الاسم الكامل *</Label>
              <Input id="name" placeholder="مثال: أحمد محمد علي" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />رقم الهاتف *</Label>
              <Input id="phone" placeholder="01xxxxxxxxx" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required className="h-11" dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />العنوان</Label>
              <Input id="address" placeholder="مثال: القاهرة، مدينة نصر" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" />ملاحظات</Label>
              <Textarea id="notes" placeholder="أي ملاحظات إضافية..." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="resize-none" rows={3} />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1 h-11" disabled={loading}>{loading ? 'جاري الحفظ...' : 'حفظ العميل'}</Button>
              <Button type="button" variant="outline" className="h-11" asChild><Link href="/dashboard/customers">إلغاء</Link></Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
