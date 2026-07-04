/**
 * الصفحة الرئيسية
 * 
 * صفحة الترحيب والتوجيه إلى لوحة التحكم أو تسجيل الدخول
 */

import Link from 'next/link'
import { NAVIGATION_LINKS, APP_NAME } from '@/lib/constants'

/**
 * الصفحة الرئيسية
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="container mx-auto px-4 py-20">
        {/* الرأس */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            {APP_NAME}
          </h1>
          <p className="text-xl text-muted mb-8">
            منصة متكاملة لإدارة السيولة والآجل للتجار
          </p>
        </div>

        {/* الميزات الرئيسية */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* الميزة 1 */}
          <div className="card">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold mb-2">رؤية شاملة للسيولة</h3>
            <p className="text-muted">
              اعرف حالتك المالية في الوقت الفعلي والفلوس اللي عند الناس
            </p>
          </div>

          {/* الميزة 2 */}
          <div className="card">
            <div className="text-4xl mb-4">🔔</div>
            <h3 className="text-xl font-bold mb-2">تنبيهات ذكية</h3>
            <p className="text-muted">
              احصل على تنبيهات فورية عند أي خطر أو فرصة شراء
            </p>
          </div>

          {/* الميزة 3 */}
          <div className="card">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">إدارة سهلة</h3>
            <p className="text-muted">
              أضف عملاء وفواتير ومنتجات بكل سهولة وتابع كل حاجة
            </p>
          </div>
        </div>

        {/* الأزرار */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={NAVIGATION_LINKS.LOGIN}
            className="btn btn-primary btn-lg"
          >
            تسجيل الدخول
          </Link>
          <Link
            href={NAVIGATION_LINKS.REGISTER}
            className="btn btn-outline btn-lg"
          >
            إنشاء حساب جديد
          </Link>
        </div>

        {/* الخصائص */}
        <div className="mt-20 pt-20 border-t border-border">
          <h2 className="text-3xl font-bold text-center mb-12">الخصائص الرئيسية</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* الخاصية 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">إدارة العملاء</h3>
                <p className="text-muted">
                  أضف وأدر عملاءك بسهولة مع تتبع الحد الائتماني والمستحقات
                </p>
              </div>
            </div>

            {/* الخاصية 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">إدارة الفواتير</h3>
                <p className="text-muted">
                  أنشئ فواتير وتابع المستحقات والفواتير المتأخرة
                </p>
              </div>
            </div>

            {/* الخاصية 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">إدارة المخزون</h3>
                <p className="text-muted">
                  تابع المنتجات والمخزون واحصل على تنبيهات عند النقص
                </p>
              </div>
            </div>

            {/* الخاصية 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">لوحة تحكم متقدمة</h3>
                <p className="text-muted">
                  اعرض ملخص السيولة والفواتير والمخزون في لمحة واحدة
                </p>
              </div>
            </div>

            {/* الخاصية 5 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">تنبيهات البريد الإلكتروني</h3>
                <p className="text-muted">
                  احصل على تنبيهات فورية عبر البريد الإلكتروني
                </p>
              </div>
            </div>

            {/* الخاصية 6 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">آمن وموثوق</h3>
                <p className="text-muted">
                  بيانات آمنة وموثوقة مع نسخ احتياطية دورية
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* الـ CTA النهائي */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-4">جاهز للبدء؟</h2>
          <p className="text-lg text-muted mb-8">
            انضم إلينا اليوم وابدأ إدارة سيولتك بذكاء
          </p>
          <Link
            href={NAVIGATION_LINKS.REGISTER}
            className="btn btn-primary btn-lg"
          >
            إنشاء حساب مجاني الآن
          </Link>
        </div>
      </div>
    </main>
  )
}
