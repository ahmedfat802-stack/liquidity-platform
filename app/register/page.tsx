'use client'

/**
 * =====================================================================
 * صفحة إنشاء حساب جديد — مربوطة فعلياً بـ Supabase Auth
 * =====================================================================
 * - signUp مع بيانات النشاط التجاري في user_metadata
 * - البريد يتأكد تلقائياً (auto_confirm trigger) فيدخل مباشرة للـ dashboard
 * =====================================================================
 */
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Wallet, Loader2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getSupabaseClient } from '@/lib/supabase/client'

/** ترجمة أخطاء Supabase الشائعة للعربية */
function translateAuthError(message: string): string {
  if (message.includes('already registered') || message.includes('already been registered'))
    return 'هذا البريد الإلكتروني مسجل بالفعل، جرب تسجيل الدخول'
  if (message.includes('Password should be at least'))
    return 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
  if (message.includes('email_address_invalid') || message.includes('is invalid'))
    return 'البريد الإلكتروني غير صالح، جرب بريداً آخر'
  if (message.includes('rate limit') || message.includes('Too many'))
    return 'محاولات كثيرة، انتظر قليلاً ثم حاول مجدداً'
  return 'حدث خطأ أثناء إنشاء الحساب، حاول مرة أخرى'
}

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [businessName, setBusinessName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      return
    }

    setLoading(true)
    try {
      const supabase = getSupabaseClient()
      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            business_name: businessName.trim(),
            phone: phone.trim(),
          },
        },
      })
      if (authError) {
        setError(translateAuthError(authError.message))
        setLoading(false)
        return
      }
      if (data.session) {
        // البريد مؤكد تلقائياً → دخول مباشر
        router.push('/dashboard')
        router.refresh()
      } else {
        // احتياطاً لو التأكيد التلقائي متعطل
        router.push('/login')
      }
    } catch {
      setError('تعذر الاتصال بالخادم، تحقق من الإنترنت')
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-6"
      dir="rtl"
    >
      {/* خلفية زخرفية */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* الشعار */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 shadow-xl shadow-blue-600/30 mb-5">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">سيولة</h1>
          <p className="text-slate-400 text-sm mt-2">
            ابدأ في متابعة فلوسك وفواتيرك الآجلة في دقيقة
          </p>
        </div>

        <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
          <CardHeader className="pb-4 space-y-2">
            <CardTitle className="text-white text-xl">إنشاء حساب جديد</CardTitle>
            <CardDescription className="text-slate-400">
              أدخل بيانات نشاطك التجاري للبدء
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="businessName" className="text-slate-300 text-sm">
                  اسم النشاط التجاري
                </Label>
                <Input
                  id="businessName"
                  type="text"
                  placeholder="مثال: مؤسسة النور للتجارة"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-blue-400 h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-300 text-sm">
                  رقم الهاتف
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="01xxxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-blue-400 h-11"
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300 text-sm">
                  البريد الإلكتروني
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-blue-400 h-11"
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300 text-sm">
                  كلمة المرور
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="6 أحرف على الأقل"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-blue-400 h-11 pl-10"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-lg shadow-blue-600/30 transition-all duration-200"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    جاري إنشاء الحساب...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    إنشاء الحساب
                    <ArrowLeft className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-400 text-sm">
                لديك حساب بالفعل؟{' '}
                <Link
                  href="/login"
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  تسجيل الدخول
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
