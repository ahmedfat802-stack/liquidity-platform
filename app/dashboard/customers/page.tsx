'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Phone, MapPin, MoreVertical, TrendingUp, Users, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

const mockCustomers = [
  { id: 1, name: 'أحمد محمد علي', phone: '01012345678', address: 'القاهرة، مصر الجديدة', totalDebt: 8500, invoicesCount: 3, status: 'active' },
  { id: 2, name: 'سارة أحمد حسن', phone: '01098765432', address: 'الجيزة، المهندسين', totalDebt: 3200, invoicesCount: 1, status: 'active' },
  { id: 3, name: 'محمد علي إبراهيم', phone: '01155443322', address: 'الإسكندرية، سيدي بشر', totalDebt: 15600, invoicesCount: 5, status: 'overdue' },
  { id: 4, name: 'فاطمة حسن محمود', phone: '01234567890', address: 'القاهرة، مدينة نصر', totalDebt: 0, invoicesCount: 8, status: 'clear' },
  { id: 5, name: 'عمر خالد عبدالله', phone: '01187654321', address: 'الجيزة، الدقي', totalDebt: 4700, invoicesCount: 2, status: 'active' },
]
const statusConfig = {
  active: { label: 'نشط', class: 'bg-blue-100 text-blue-700 border-blue-200' },
  overdue: { label: 'متأخر', class: 'bg-red-100 text-red-700 border-red-200' },
  clear: { label: 'مسدد', class: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
}
export default function CustomersPage() {
  const [search, setSearch] = useState('')
  const filtered = mockCustomers.filter(c => c.name.includes(search) || c.phone.includes(search))
  const totalDebt = mockCustomers.reduce((s, c) => s + c.totalDebt, 0)
  const overdueCount = mockCustomers.filter(c => c.status === 'overdue').length
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">العملاء</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{mockCustomers.length} عميل مسجل</p>
        </div>
        <Button asChild className="gap-2 shadow-sm">
          <Link href="/dashboard/customers/new"><Plus className="w-4 h-4" />عميل جديد</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-border shadow-sm"><CardContent className="p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><Users className="w-5 h-5 text-blue-600" /></div><div><p className="text-xl font-bold">{mockCustomers.length}</p><p className="text-xs text-muted-foreground">إجمالي العملاء</p></div></CardContent></Card>
        <Card className="border border-border shadow-sm"><CardContent className="p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-amber-600" /></div><div><p className="text-xl font-bold">{totalDebt.toLocaleString()} ج.م</p><p className="text-xs text-muted-foreground">إجمالي الديون</p></div></CardContent></Card>
        <Card className="border border-border shadow-sm"><CardContent className="p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center"><AlertCircle className="w-5 h-5 text-red-600" /></div><div><p className="text-xl font-bold">{overdueCount}</p><p className="text-xs text-muted-foreground">عملاء متأخرون</p></div></CardContent></Card>
      </div>
      <div className="relative"><Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="ابحث باسم العميل أو رقم الهاتف..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-10 h-11 bg-card" /></div>
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="border border-border"><CardContent className="p-12 text-center"><Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" /><p className="text-muted-foreground">لا يوجد عملاء مطابقون للبحث</p></CardContent></Card>
        ) : filtered.map((customer) => (
          <Card key={customer.id} className="border border-border shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"><span className="text-sm font-bold text-primary">{customer.name[0]}</span></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-foreground text-sm">{customer.name}</p>
                    <Badge variant="outline" className={`text-xs ${statusConfig[customer.status as keyof typeof statusConfig].class}`}>{statusConfig[customer.status as keyof typeof statusConfig].label}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{customer.phone}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{customer.address}</span>
                  </div>
                </div>
                <div className="text-left flex-shrink-0">
                  <p className={`text-base font-bold ${customer.totalDebt > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>{customer.totalDebt > 0 ? `${customer.totalDebt.toLocaleString()} ج.م` : 'مسدد'}</p>
                  <p className="text-xs text-muted-foreground">{customer.invoicesCount} فاتورة</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="w-8 h-8 flex-shrink-0"><MoreVertical className="w-4 h-4" /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>عرض التفاصيل</DropdownMenuItem>
                    <DropdownMenuItem>إضافة فاتورة</DropdownMenuItem>
                    <DropdownMenuItem>تعديل البيانات</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">حذف</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
