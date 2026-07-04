import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ========== Validation Helpers ==========
export function isValidPhone(phone: string): boolean {
  return /^01[0125][0-9]{8}$/.test(phone.replace(/\s/g, ''))
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// ========== Format Helpers ==========
export function formatCurrency(amount: number, currency = 'EGP'): string {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

// ========== Invoice Helpers ==========
export function daysUntilDue(dueDate: string | Date): number {
  const due = new Date(dueDate)
  const now = new Date()
  const diff = due.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function calculateInvoiceStatus(dueDate: string | Date, isPaid: boolean): string {
  if (isPaid) return 'paid'
  const days = daysUntilDue(dueDate)
  if (days < 0) return 'overdue'
  if (days <= 7) return 'due_soon'
  return 'pending'
}

// ========== Error Helpers ==========
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'حدث خطأ غير متوقع'
}
