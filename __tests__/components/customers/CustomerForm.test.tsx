/**
 * اختبارات مكون CustomerForm
 * 
 * اختبار نموذج إضافة/تعديل العميل
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CustomerForm from '@/components/customers/CustomerForm'

// Mock useCustomers hook
jest.mock('@/hooks/useCustomers', () => ({
  useCustomers: jest.fn(() => ({
    addCustomer: jest.fn(),
    updateCustomer: jest.fn(),
  })),
}))

describe('CustomerForm Component', () => {
  // ========== Render Tests ==========

  it('يجب أن يتم عرض النموذج بدون أخطاء', () => {
    render(<CustomerForm onCancel={() => {}} />)
    expect(screen.getByText('اسم العميل *')).toBeInTheDocument()
  })

  it('يجب أن يحتوي النموذج على جميع الحقول', () => {
    render(<CustomerForm onCancel={() => {}} />)
    expect(screen.getByLabelText('اسم العميل *')).toBeInTheDocument()
    expect(screen.getByLabelText('رقم الهاتف *')).toBeInTheDocument()
    expect(screen.getByLabelText('البريد الإلكتروني')).toBeInTheDocument()
    expect(screen.getByLabelText('العنوان')).toBeInTheDocument()
    expect(screen.getByLabelText('الحد الائتماني (ج.م) *')).toBeInTheDocument()
  })

  // ========== Button Tests ==========

  it('يجب أن يحتوي النموذج على زر الإرسال', () => {
    render(<CustomerForm onCancel={() => {}} />)
    expect(screen.getByRole('button', { name: /إضافة عميل/i })).toBeInTheDocument()
  })

  it('يجب أن يحتوي النموذج على زر الإلغاء', () => {
    render(<CustomerForm onCancel={() => {}} />)
    expect(screen.getByRole('button', { name: /إلغاء/i })).toBeInTheDocument()
  })

  // ========== Interaction Tests ==========

  it('يجب استدعاء onCancel عند الضغط على زر الإلغاء', async () => {
    const onCancel = jest.fn()
    render(<CustomerForm onCancel={onCancel} />)

    const cancelButton = screen.getByRole('button', { name: /إلغاء/i })
    fireEvent.click(cancelButton)

    expect(onCancel).toHaveBeenCalled()
  })

  // ========== Validation Tests ==========

  it('يجب عرض رسالة خطأ للحقول الفارغة', async () => {
    render(<CustomerForm onCancel={() => {}} />)

    const submitButton = screen.getByRole('button', { name: /إضافة عميل/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/اسم العميل قصير جداً/i)).toBeInTheDocument()
    })
  })

  // ========== Input Tests ==========

  it('يجب إدخال البيانات في الحقول', async () => {
    const user = userEvent.setup()
    render(<CustomerForm onCancel={() => {}} />)

    const nameInput = screen.getByLabelText('اسم العميل *') as HTMLInputElement
    await user.type(nameInput, 'محمد أحمد')

    expect(nameInput.value).toBe('محمد أحمد')
  })
})
