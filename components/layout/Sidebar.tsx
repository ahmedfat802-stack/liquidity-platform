'use client'

/**
 * =====================================================================
 * Sidebar — الشريط الجانبي الرئيسي لمنصة "سيولة"
 * =====================================================================
 * - يظهر على اليمين (RTL) ويحتوي على روابط التنقل
 * - يعرض اسم النشاط التجاري الفعلي من Supabase (user_metadata.business_name)
 * - زر تسجيل الخروج يعمل فعلياً عبر supabase.auth.signOut()
 * =====================================================================
 */

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  FileText,
  Package,
  LogOut,
  Wallet,
  Menu,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { getSupabaseClient } from '@/lib/supabase/client'

const navItems = [
  {
    href: '/dashboard',
    label: 'لوحة التحكم',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: '/dashboard/customers',
    label: 'العملاء',
    icon: Users,
  },
  {
    href: '/dashboard/invoices',
    label: 'الفواتير',
    icon: FileText,
  },
  {
    href: '/dashboard/products',
    label: 'المنتجات',
    icon: Package,
  },
]

interface SidebarProps {
  className?: string
}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [businessName, setBusinessName] = useState('حسابي')
  const [email, setEmail] = useState('')
  const [loggingOut, setLoggingOut] = useState(false)

  // جلب بيانات المستخدم الفعلية من Supabase
  useEffect(() => {
    const supabase = getSupabaseClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const meta = user.user_metadata as { business_name?: string }
        setBusinessName(meta?.business_name || 'حسابي')
        setEmail(user.email || '')
      }
    })
  }, [])

  /** تسجيل الخروج الفعلي ثم التوجيه لصفحة الدخول */
  const handleLogout = async () => {
    setLoggingOut(true)
    const supabase = getSupabaseClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* الشعار */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border">
        <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center shadow-sm">
          <Wallet className="w-5 h-5 text-sidebar-primary-foreground" />
        </div>
        <div>
          <p className="font-bold text-sidebar-foreground text-base leading-tight">سيولة</p>
          <p className="text-xs text-sidebar-foreground/50 mt-0.5">إدارة السيولة والآجل</p>
        </div>
      </div>

      {/* روابط التنقل */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
              )}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
              {active && (
                <div className="mr-auto w-1.5 h-1.5 rounded-full bg-sidebar-primary-foreground/70" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* بيانات المستخدم + تسجيل الخروج */}
      <div className="px-4 py-5 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2.5 mb-3">
          <div className="w-9 h-9 rounded-full bg-sidebar-accent flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-sidebar-foreground">
              {businessName.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{businessName}</p>
            <p className="text-xs text-sidebar-foreground/50 truncate" dir="ltr">
              {email}
            </p>
          </div>
        </div>
        <button
          className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-red-400 transition-all duration-150 disabled:opacity-50"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          <LogOut className="w-4 h-4" />
          <span>{loggingOut ? 'جاري الخروج...' : 'تسجيل الخروج'}</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col w-64 bg-sidebar border-l border-sidebar-border h-screen sticky top-0',
          className
        )}
      >
        <SidebarContent />
      </aside>

      {/* زر القائمة للموبايل */}
      <button
        className="lg:hidden fixed top-4 right-4 z-50 w-10 h-10 rounded-xl bg-sidebar flex items-center justify-center shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? (
          <X className="w-5 h-5 text-sidebar-foreground" />
        ) : (
          <Menu className="w-5 h-5 text-sidebar-foreground" />
        )}
      </button>

      {/* خلفية الموبايل */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar الموبايل */}
      <aside
        className={cn(
          'lg:hidden fixed top-0 right-0 z-40 w-72 h-full bg-sidebar border-l border-sidebar-border transform transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <SidebarContent />
      </aside>
    </>
  )
}
