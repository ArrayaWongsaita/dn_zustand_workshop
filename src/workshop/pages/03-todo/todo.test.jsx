import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, test, vi } from 'vitest'

// A page store is a module-level singleton, so state leaks between tests in a
// file. Importing the record fresh per test gives each test the goal demo from
// a clean state without reaching into store internals.
async function mountDemo() {
  vi.resetModules()
  const { default: page } = await import('./index.js')
  render(<page.Demo />)
  return page
}

// One row is the smallest visible region holding a checkbox, its text and the
// remove button, so the row is found through the text it shows.
function row(text) {
  return within(screen.getByText(text).closest('li'))
}

describe('หน้า 3 — รายการสิ่งที่ต้องทำ', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  test('เปิดหน้าแล้วเห็นข้อความ "ยังไม่มีรายการ"', async () => {
    await mountDemo()

    expect(screen.getByText('ยังไม่มีรายการ')).toBeInTheDocument()
  })

  test('พิมพ์ข้อความแล้วกด "เพิ่ม" รายการใหม่ปรากฏขึ้น และช่องกรอกกลับมาว่าง', async () => {
    await mountDemo()

    const input = screen.getByPlaceholderText('งานที่ต้องทำ')
    fireEvent.change(input, { target: { value: 'ซื้อของ' } })
    fireEvent.click(screen.getByRole('button', { name: 'เพิ่ม' }))

    expect(screen.getByText('ซื้อของ')).toBeInTheDocument()
    expect(input).toHaveValue('')
  })

  test('ติ๊ก checkbox ของรายการหนึ่ง ข้อความถูกลากเส้นทับ และรายการอื่นไม่เปลี่ยน', async () => {
    await mountDemo()

    const input = screen.getByPlaceholderText('งานที่ต้องทำ')
    fireEvent.change(input, { target: { value: 'ซื้อของ' } })
    fireEvent.click(screen.getByRole('button', { name: 'เพิ่ม' }))
    fireEvent.change(input, { target: { value: 'ทำงานบ้าน' } })
    fireEvent.click(screen.getByRole('button', { name: 'เพิ่ม' }))

    fireEvent.click(row('ซื้อของ').getByRole('checkbox'))

    expect(screen.getByText('ซื้อของ')).toHaveStyle({
      textDecoration: 'line-through',
    })
    expect(screen.getByText('ทำงานบ้าน')).not.toHaveStyle({
      textDecoration: 'line-through',
    })
  })

  test('กด "ลบ" ของรายการหนึ่ง รายการนั้นหายไปจากลิสต์', async () => {
    await mountDemo()

    const input = screen.getByPlaceholderText('งานที่ต้องทำ')
    fireEvent.change(input, { target: { value: 'ซื้อของ' } })
    fireEvent.click(screen.getByRole('button', { name: 'เพิ่ม' }))
    fireEvent.change(input, { target: { value: 'ทำงานบ้าน' } })
    fireEvent.click(screen.getByRole('button', { name: 'เพิ่ม' }))

    fireEvent.click(row('ซื้อของ').getByRole('button', { name: 'ลบ' }))

    expect(screen.queryByText('ซื้อของ')).not.toBeInTheDocument()
    expect(screen.getByText('ทำงานบ้าน')).toBeInTheDocument()
  })

  test('กด "เพิ่ม" ขณะช่องกรอกว่าง ไม่มีรายการใหม่เกิดขึ้น', async () => {
    await mountDemo()

    fireEvent.click(screen.getByRole('button', { name: 'เพิ่ม' }))

    expect(screen.getByText('ยังไม่มีรายการ')).toBeInTheDocument()
  })
})
