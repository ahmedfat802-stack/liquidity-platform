/**
 * =====================================================================
 * الصفحة الرئيسية (Landing Page) — منصة "سيولة"
 * =====================================================================
 * صفحة الترحيب وعرض مميزات المنصة مع التوجيه للتسجيل أو الدخول
 * =====================================================================
 */

import Link from 'next/link'
import {
  Wallet,
  Bell,
  Users,
  FileText,
  Package,
  LayoutDashboard,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

/** المميزات الرئيسية الثلاث */
const highlights = [
  {
    icon: Wallet,
    title: 'رؤية شاملة للسيولة',
    description: 'اعرف حالتك المالية في لحظة: كم فلوس معاك، وكم فلوس ليك عند العملاء',
  },
  {
    icon: Bell,
    title: 'تنبيهات ذكية',
    description: 'تنبيهات قبل استحقاق الفواتير وعند انخفاض المخزون وقبل أي أزمة سيولة',
  },
  {
    icon: TrendingUp,
    title: 'قرارات أوضح',
    description: 'تابع الآجل والمستحقات بالأرقام وخد قراراتك التجارية بثقة',
  },
]

/** الخصائص التفصيلية */
const features = [
  {
    icon: Users,
    title: 'إدارة العملاء',
    description: 'سجّل عملاءك وتابع رصيد كل عميل وحد الائتمان المسموح به',
  },
  {
    icon: FileText,
    title: 'إدارة الفواتير الآجلة',
    description: 'سجّل فواتير الآجل وتواريخ الاستحقاق وعلّمها كمدفوعة عند السداد',
  },
  {
    icon: Package,
    title: 'إدارة المخزون',
    description: 'تابع منتجاتك وكمياتها واحصل على تنبيه قبل ما أي منتج يخلص',
  },
  {
    icon: LayoutDashboard,
    title: 'لوحة تحكم متكاملة',
    description: 'ملخص السيولة والفواتير والمخزون والتنبيهات في شاشة واحدة',
  },
  {
    icon: Bell,
    title: 'تنبيهات داخل المنصة',
    description: 'فواتير قربت تستحق، فواتير متأخرة، مخزون منخفض — كله قدامك',
  },
  {
    icon: ShieldCheck,
    title: 'آمن وخاص',
    description: 'بياناتك محمية ومعزولة تماماً — كل تاجر يشوف بياناته هو فقط',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50/40">
      {/* شريط علوي */}
      <header className="container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">سيولة</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link href="/login">تسجيل الدخول</Link>
          </Button>
          <Button asChild>
            <Link href="/register">ابدأ مجاناً</Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6">
        {/* Hero */}
        <section className="text-center py-20 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
            اعرف فلوسك فين
            <br />
            <span className="text-primary">قبل ما السيولة تخنقك</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mt-6 leading-relaxed">
            سيولة منصة للتجار في مصر تساعدك تتابع الفلوس اللي معاك، والآجل اللي ليك عند
            العملاء، والفواتير المستحقة، والمخزون — مع تنبيهات ذكية تمنع أزمات السيولة قبل ما
            تحصل.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Button size="lg" className="h-12 px-10 text-base" asChild>
              <Link href="/register">إنشاء حساب مجاني</Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-10 text-base" asChild>
              <Link href="/login">تسجيل الدخول</Link>
            </Button>
          </div>
        </section>

        {/* المميزات الرئيسية */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-20">
          {highlights.map((h) => (
            <Card key={h.title} className="shadow-sm border-blue-100">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                  <h.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{h.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{h.description}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* الخصائص التفصيلية */}
        <section className="pb-20">
          <h2 className="text-3xl font-bold text-center text-foreground mb-4">
            كل اللي محتاجه في مكان واحد
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            من غير تمويل ومن غير تعقيد — بس رؤية واضحة ومتابعة دقيقة وتنبيهات في وقتها
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex gap-4 p-6 rounded-2xl bg-white border border-border shadow-sm"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{f.title}</h3>
                  <p className="text-muted-foreground text-sm mt-1.5 leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA نهائي */}
        <section className="text-center pb-24">
          <div className="max-w-2xl mx-auto rounded-3xl bg-primary p-12 text-white shadow-lg">
            <h2 className="text-3xl font-bold">جاهز تمسك حساباتك صح؟</h2>
            <p className="text-blue-100 mt-4 text-lg">
              انضم لسيولة اليوم وابدأ متابعة فلوسك وآجلك ومخزونك بذكاء
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="h-12 px-10 mt-8 text-base font-bold"
              asChild
            >
              <Link href="/register">إنشاء حساب مجاني الآن</Link>
            </Button>
          </div>
        </section>
      </div>

      {/* تذييل */}
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        سيولة © {new Date().getFullYear()} — منصة إدارة السيولة والآجل للتجار
      </footer>
    </main>
  )
}
