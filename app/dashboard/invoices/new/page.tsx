'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, User, Calendar, DollarSign, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const mockCustomers = ['أحمد محمد علي', 'سارة أحمد حسن', 'محمد علي إبراهيم', 'فاطمة حسن محمود']

export default function NewInvoicePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ customer: '', amount: '', dueDate: '', notes: '' })
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    router.push('/dashboard/invoices')
  }
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild className="w-8 h-8"><Link href="/dashboard/invoices"><ArrowRight className="w-4 h-4" /></Link></Button>
        <div><h1 className="text-2xl font-bold text-foreground">فاتورة جديدة</h1><p className="text-muted-foreground text-sm">سجل بيع آجل لعميل</p></div>
      </div>
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-4"><CardTitle className="text-base">بيانات الفاتورة</CardTitle><CardDescription>أدخل تفاصيل البيع الآجل</CardDescription></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1.5"><User className="w-3.5 h-3.5" />العميل *</Label>
              <Select onValueChange={v => setForm({...form, customer: v})} required>
                <SelectTrigger className="h-11"><SelectValue placeholder="اختر العميل" /></SelectTrigger>
                <SelectContent>{mockCustomers.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" />المبلغ (ج.م) *</Label>
              <Input id="amount" type="number" placeholder="0.00" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required className="h-11" min="1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-sm font-medium flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />تاريخ الاستحقاق *</Label>
              <Input id="dueDate" type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} required className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" />ملاحظات</Label>
              <Textarea id="notes" placeholder="تفاصيل البضاعة أو أي ملاحظات..." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="resize-none" rows={3} />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1 h-11" disabled={loading}>{loading ? 'جاري الحفظ...' : 'حفظ الفاتورة'}</Button>
              <Button type="button" variant="outline" className="h-11" asChild><Link href="/dashboard/invoices">إلغاء</Link></Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
