'use client'

/**
 * صفحة لوحة التحكم الرئيسية
 * تعرض: السيولة الحالية، الفواتير المستحقة، التنبيهات، والإحصائيات
 */

import { TrendingUp, Users, FileText, Package, AlertTriangle, Clock, CheckCircle, ArrowUpRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// بيانات تجريبية - ستُستبدل بـ Supabase
const stats = [
  {
    title: 'السيولة المتاحة',
    value: '٢٤,٥٠٠ ج.م',
    change: '+١٢٪',
    trend: 'up',
    icon: TrendingUp,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    description: 'النقدي في الخزنة',
  },
  {
    title: 'فلوس عند العملاء',
    value: '٨٧,٢٠٠ ج.م',
    change: '+٥ فواتير',
    trend: 'neutral',
    icon: Users,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    description: 'إجمالي الآجل',
  },
  {
    title: 'فواتير مستحقة',
    value: '١٢ فاتورة',
    change: 'هذا الأسبوع',
    trend: 'warning',
    icon: FileText,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    description: 'تستحق خلال ٧ أيام',
  },
  {
    title: 'منتجات قليلة',
    value: '٣ منتجات',
    change: 'تحت الحد',
    trend: 'down',
    icon: Package,
    color: 'text-red-600',
    bg: 'bg-red-50',
    description: 'تحتاج إعادة تخزين',
  },
]

const alerts = [
  {
    type: 'danger',
    title: 'تحذير سيولة',
    message: 'السيولة المتاحة أقل من ١٠,٠٠٠ ج.م - قد لا تتمكن من شراء بضاعة جديدة',
    icon: AlertTriangle,
    time: 'الآن',
  },
  {
    type: 'warning',
    title: 'فاتورة مستحقة',
    message: 'فاتورة أحمد محمد (٣,٥٠٠ ج.م) تستحق خلال يومين',
    icon: Clock,
    time: 'منذ ساعة',
  },
  {
    type: 'success',
    title: 'تم السداد',
    message: 'سدد محمد علي فاتورة بقيمة ٢,٢٠٠ ج.م',
    icon: CheckCircle,
    time: 'منذ ٣ ساعات',
  },
]

const recentInvoices = [
  { customer: 'أحمد محمد', amount: '٣,٥٠٠', dueDate: 'بعد يومين', status: 'pending' },
  { customer: 'سارة أحمد', amount: '١,٨٠٠', dueDate: 'بعد ٥ أيام', status: 'pending' },
  { customer: 'محمد علي', amount: '٥,٢٠٠', dueDate: 'متأخر ٣ أيام', status: 'overdue' },
  { customer: 'فاطمة حسن', amount: '٩٠٠', dueDate: 'بعد أسبوع', status: 'upcoming' },
]

const statusConfig = {
  pending: { label: 'مستحق قريباً', class: 'bg-amber-100 text-amber-700 border-amber-200' },
  overdue: { label: 'متأخر', class: 'bg-red-100 text-red-700 border-red-200' },
  upcoming: { label: 'قادم', class: 'bg-blue-100 text-blue-700 border-blue-200' },
  paid: { label: 'مدفوع', class: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">لوحة التحكم</h1>
          <p className="text-muted-foreground text-sm mt-0.5">مرحباً بك، هذه نظرة عامة على وضعك المالي</p>
        </div>
        <div className="text-sm text-muted-foreground bg-card border border-border rounded-lg px-3 py-1.5">
          {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border border-border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  stat.trend === 'up' ? 'bg-emerald-100 text-emerald-700' :
                  stat.trend === 'down' ? 'bg-red-100 text-red-700' :
                  stat.trend === 'warning' ? 'bg-amber-100 text-amber-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground mb-0.5">{stat.value}</p>
              <p className="text-sm font-medium text-foreground/80">{stat.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts */}
        <div className="lg:col-span-1">
          <Card className="border border-border shadow-sm h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">التنبيهات</CardTitle>
                <Badge variant="destructive" className="text-xs">٢ تنبيه</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {alerts.map((alert, i) => (
                <div
                  key={i}
                  className={`flex gap-3 p-3 rounded-xl border ${
                    alert.type === 'danger' ? 'bg-red-50 border-red-200' :
                    alert.type === 'warning' ? 'bg-amber-50 border-amber-200' :
                    'bg-emerald-50 border-emerald-200'
                  }`}
                >
                  <alert.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                    alert.type === 'danger' ? 'text-red-600' :
                    alert.type === 'warning' ? 'text-amber-600' :
                    'text-emerald-600'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground">{alert.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{alert.message}</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Invoices */}
        <div className="lg:col-span-2">
          <Card className="border border-border shadow-sm h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">الفواتير القريبة</CardTitle>
                  <CardDescription className="text-xs mt-0.5">الفواتير المستحقة خلال الأيام القادمة</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild className="text-xs text-primary">
                  <Link href="/dashboard/invoices">
                    عرض الكل
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentInvoices.map((invoice, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">{invoice.customer[0]}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{invoice.customer}</p>
                        <p className="text-xs text-muted-foreground">{invoice.dueDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-foreground">{invoice.amount} ج.م</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusConfig[invoice.status as keyof typeof statusConfig].class}`}>
                        {statusConfig[invoice.status as keyof typeof statusConfig].label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/dashboard/customers/new">
          <Card className="border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">إضافة عميل</p>
                <p className="text-xs text-muted-foreground">أضف عميل جديد</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/invoices/new">
          <Card className="border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                <FileText className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">فاتورة جديدة</p>
                <p className="text-xs text-muted-foreground">سجل بيع آجل</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/products/new">
          <Card className="border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">إضافة منتج</p>
                <p className="text-xs text-muted-foreground">أضف منتج للمخزون</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
