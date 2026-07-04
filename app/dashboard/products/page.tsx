'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Package, AlertTriangle, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

const mockProducts = [
  { id: 1, name: 'قماش قطن أبيض', sku: 'FAB-001', price: 45, stock: 120, minStock: 20, unit: 'متر', status: 'ok' },
  { id: 2, name: 'خيط بوليستر أسود', sku: 'THR-002', price: 8, stock: 5, minStock: 15, unit: 'بكرة', status: 'low' },
  { id: 3, name: 'أزرار بلاستيك', sku: 'BTN-003', price: 2, stock: 0, minStock: 50, unit: 'حبة', status: 'out' },
  { id: 4, name: 'قماش جينز', sku: 'FAB-004', price: 65, stock: 80, minStock: 15, unit: 'متر', status: 'ok' },
  { id: 5, name: 'سحاب معدني', sku: 'ZIP-005', price: 5, stock: 8, minStock: 30, unit: 'حبة', status: 'low' },
]
const statusConfig = {
  ok: { label: 'متوفر', class: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  low: { label: 'منخفض', class: 'bg-amber-100 text-amber-700 border-amber-200' },
  out: { label: 'نفذ', class: 'bg-red-100 text-red-700 border-red-200' },
}
export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const filtered = mockProducts.filter(p => p.name.includes(search) || p.sku.includes(search))
  const lowStock = mockProducts.filter(p => p.status === 'low' || p.status === 'out').length
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-foreground">المنتجات</h1><p className="text-muted-foreground text-sm mt-0.5">{mockProducts.length} منتج مسجل</p></div>
        <Button asChild className="gap-2 shadow-sm"><Link href="/dashboard/products/new"><Plus className="w-4 h-4" />منتج جديد</Link></Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-border shadow-sm"><CardContent className="p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><Package className="w-5 h-5 text-blue-600" /></div><div><p className="text-xl font-bold">{mockProducts.length}</p><p className="text-xs text-muted-foreground">إجمالي المنتجات</p></div></CardContent></Card>
        <Card className="border border-border shadow-sm"><CardContent className="p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-amber-600" /></div><div><p className="text-xl font-bold">{lowStock}</p><p className="text-xs text-muted-foreground">تحتاج تخزين</p></div></CardContent></Card>
        <Card className="border border-border shadow-sm"><CardContent className="p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center"><Package className="w-5 h-5 text-emerald-600" /></div><div><p className="text-xl font-bold">{mockProducts.filter(p => p.status === 'ok').length}</p><p className="text-xs text-muted-foreground">متوفر بكمية كافية</p></div></CardContent></Card>
      </div>
      <div className="relative"><Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="ابحث باسم المنتج أو الكود..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-10 h-11 bg-card" /></div>
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="border border-border"><CardContent className="p-12 text-center"><Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" /><p className="text-muted-foreground">لا توجد منتجات</p></CardContent></Card>
        ) : filtered.map((product) => (
          <Card key={product.id} className={`border shadow-sm hover:shadow-md transition-all ${product.status === 'out' ? 'border-red-200 bg-red-50/30' : product.status === 'low' ? 'border-amber-200 bg-amber-50/30' : 'border-border'}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"><Package className="w-5 h-5 text-primary" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-foreground text-sm">{product.name}</p>
                    <Badge variant="outline" className={`text-xs ${statusConfig[product.status as keyof typeof statusConfig].class}`}>{statusConfig[product.status as keyof typeof statusConfig].label}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">كود: {product.sku} · الحد الأدنى: {product.minStock} {product.unit}</p>
                </div>
                <div className="text-left flex-shrink-0">
                  <p className={`text-base font-bold ${product.stock === 0 ? 'text-red-600' : product.stock < product.minStock ? 'text-amber-600' : 'text-foreground'}`}>{product.stock} {product.unit}</p>
                  <p className="text-xs text-muted-foreground">{product.price} ج.م / {product.unit}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="w-8 h-8 flex-shrink-0"><MoreVertical className="w-4 h-4" /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>تحديث المخزون</DropdownMenuItem>
                    <DropdownMenuItem>تعديل</DropdownMenuItem>
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
