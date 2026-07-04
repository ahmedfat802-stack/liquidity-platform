'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Clock, CheckCircle, AlertTriangle, MoreVertical, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

const mockInvoices = [
  { id: 1, customer: 'أحمد محمد', amount: 3500, issueDate: '٢٠٢٤/١/١', dueDate: '٢٠٢٤/١/١٥', status: 'pending', daysLeft: 2 },
  { id: 2, customer: 'سارة أحمد', amount: 1800, issueDate: '٢٠٢٤/١/٣', dueDate: '٢٠٢٤/١/١٨', status: 'pending', daysLeft: 5 },
  { id: 3, customer: 'محمد علي', amount: 5200, issueDate: '٢٠٢٣/١٢/١', dueDate: '٢٠٢٤/١/١', status: 'overdue', daysLeft: -3 },
  { id: 4, customer: 'فاطمة حسن', amount: 900, issueDate: '٢٠٢٤/١/٥', dueDate: '٢٠٢٤/١/٢٢', status: 'upcoming', daysLeft: 9 },
  { id: 5, customer: 'عمر خالد', amount: 2200, issueDate: '٢٠٢٣/١٢/١٥', dueDate: '٢٠٢٤/١/١٠', status: 'paid', daysLeft: 0 },
]
const statusConfig = {
  pending: { label: 'مستحق قريباً', class: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
  overdue: { label: 'متأخر', class: 'bg-red-100 text-red-700 border-red-200', icon: AlertTriangle },
  upcoming: { label: 'قادم', class: 'bg-blue-100 text-blue-700 border-blue-200', icon: Clock },
  paid: { label: 'مدفوع', class: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle },
}
export default function InvoicesPage() {
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('all')
  const filtered = mockInvoices.filter(inv => {
    const matchSearch = inv.customer.includes(search)
    const matchTab = tab === 'all' || inv.status === tab
    return matchSearch && matchTab
  })
  const totalPending = mockInvoices.filter(i => i.status !== 'paid').reduce((s, i) => s + i.amount, 0)
  const overdueCount = mockInvoices.filter(i => i.status === 'overdue').length
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-foreground">الفواتير</h1><p className="text-muted-foreground text-sm mt-0.5">{mockInvoices.length} فاتورة مسجلة</p></div>
        <Button asChild className="gap-2 shadow-sm"><Link href="/dashboard/invoices/new"><Plus className="w-4 h-4" />فاتورة جديدة</Link></Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-border shadow-sm"><CardContent className="p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center"><FileText className="w-5 h-5 text-amber-600" /></div><div><p className="text-xl font-bold">{totalPending.toLocaleString()} ج.م</p><p className="text-xs text-muted-foreground">إجمالي المستحق</p></div></CardContent></Card>
        <Card className="border border-border shadow-sm"><CardContent className="p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-red-600" /></div><div><p className="text-xl font-bold">{overdueCount}</p><p className="text-xs text-muted-foreground">فواتير متأخرة</p></div></CardContent></Card>
        <Card className="border border-border shadow-sm"><CardContent className="p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center"><CheckCircle className="w-5 h-5 text-emerald-600" /></div><div><p className="text-xl font-bold">{mockInvoices.filter(i => i.status === 'paid').length}</p><p className="text-xs text-muted-foreground">فواتير مدفوعة</p></div></CardContent></Card>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1"><Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="ابحث باسم العميل..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-10 h-11 bg-card" /></div>
        <Tabs value={tab} onValueChange={setTab}><TabsList className="h-11"><TabsTrigger value="all">الكل</TabsTrigger><TabsTrigger value="overdue">متأخر</TabsTrigger><TabsTrigger value="pending">قريب</TabsTrigger><TabsTrigger value="paid">مدفوع</TabsTrigger></TabsList></Tabs>
      </div>
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="border border-border"><CardContent className="p-12 text-center"><FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" /><p className="text-muted-foreground">لا توجد فواتير</p></CardContent></Card>
        ) : filtered.map((invoice) => {
          const config = statusConfig[invoice.status as keyof typeof statusConfig]
          return (
            <Card key={invoice.id} className="border border-border shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"><span className="text-sm font-bold text-primary">{invoice.customer[0]}</span></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-foreground text-sm">{invoice.customer}</p>
                      <Badge variant="outline" className={`text-xs ${config.class}`}>{config.label}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">تاريخ الإصدار: {invoice.issueDate} · الاستحقاق: {invoice.dueDate}</p>
                  </div>
                  <div className="text-left flex-shrink-0">
                    <p className="text-base font-bold text-foreground">{invoice.amount.toLocaleString()} ج.م</p>
                    {invoice.status === 'overdue' && <p className="text-xs text-red-600">متأخر {Math.abs(invoice.daysLeft)} أيام</p>}
                    {invoice.status === 'pending' && <p className="text-xs text-amber-600">يستحق بعد {invoice.daysLeft} أيام</p>}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="w-8 h-8 flex-shrink-0"><MoreVertical className="w-4 h-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>تعليم كمدفوع</DropdownMenuItem>
                      <DropdownMenuItem>تعديل</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">حذف</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
