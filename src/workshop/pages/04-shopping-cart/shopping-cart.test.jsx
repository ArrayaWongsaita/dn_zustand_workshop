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

// The catalog is the first list on the page. Finding a row through its product
// text keeps each product's button unambiguous even once the same product also
// appears in the cart.
function catalogRow(name) {
  const [catalog] = screen.getAllByRole('list')
  return within(catalog).getByText(new RegExp(`^${name} · `)).closest('li')
}

function addToCart(name) {
  fireEvent.click(
    within(catalogRow(name)).getByRole('button', { name: 'เพิ่มลงตะกร้า' }),
  )
}

// The cart panel is the region holding the cart heading. Its rows repeat the
// catalog's product text, so every cart lookup goes through the panel first.
function cartPanel() {
  return screen.getByText('ตะกร้าสินค้า').closest('div')
}

function cartRow(name) {
  return within(cartPanel())
    .getByText(new RegExp(`^${name} · `))
    .closest('li')
}

describe('หน้า 4 — ตะกร้าสินค้า', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  test('กด "เพิ่มลงตะกร้า" ที่สินค้าหนึ่ง สินค้านั้นปรากฏในตะกร้าด้วยจำนวน 1', async () => {
    await mountDemo()

    expect(
      within(cartPanel()).getByText('ยังไม่มีสินค้าในตะกร้า'),
    ).toBeInTheDocument()

    addToCart('กาแฟ')

    expect(within(cartRow('กาแฟ')).getByText('1')).toBeInTheDocument()
    expect(
      within(cartPanel()).queryByText('ยังไม่มีสินค้าในตะกร้า'),
    ).not.toBeInTheDocument()
  })

  test('กด "เพิ่มลงตะกร้า" ที่สินค้าเดิมอีกครั้ง จำนวนของรายการนั้นเพิ่มขึ้น และไม่มีบรรทัดใหม่เกิดขึ้น', async () => {
    await mountDemo()

    addToCart('กาแฟ')
    addToCart('กาแฟ')

    expect(within(cartRow('กาแฟ')).getByText('2')).toBeInTheDocument()
    expect(within(cartPanel()).getAllByRole('listitem')).toHaveLength(1)
  })

  test('ปุ่ม − และ + เปลี่ยนจำนวนเฉพาะรายการนั้น และลดจนเหลือ 0 แล้วรายการนั้นหายไป', async () => {
    await mountDemo()

    addToCart('กาแฟ')
    addToCart('ชา')

    fireEvent.click(within(cartRow('กาแฟ')).getByRole('button', { name: '+' }))
    expect(within(cartRow('กาแฟ')).getByText('2')).toBeInTheDocument()
    expect(within(cartRow('ชา')).getByText('1')).toBeInTheDocument()

    fireEvent.click(within(cartRow('กาแฟ')).getByRole('button', { name: '−' }))
    expect(within(cartRow('กาแฟ')).getByText('1')).toBeInTheDocument()
    expect(within(cartRow('ชา')).getByText('1')).toBeInTheDocument()

    fireEvent.click(within(cartRow('กาแฟ')).getByRole('button', { name: '−' }))
    expect(within(cartPanel()).queryByText(/^กาแฟ · /)).not.toBeInTheDocument()
    expect(within(cartRow('ชา')).getByText('1')).toBeInTheDocument()
  })

  test('กด "ลบ" ของรายการหนึ่ง รายการนั้นหายไปจากตะกร้า', async () => {
    await mountDemo()

    addToCart('กาแฟ')
    addToCart('ชา')

    fireEvent.click(
      within(cartRow('กาแฟ')).getByRole('button', { name: 'ลบ' }),
    )

    expect(within(cartPanel()).queryByText(/^กาแฟ · /)).not.toBeInTheDocument()
    expect(within(cartRow('ชา')).getByText('1')).toBeInTheDocument()
  })

  test('พิมพ์ข้อความในช่อง "หมายเหตุ" แล้วข้อความยังอยู่ และรายการสินค้าในตะกร้ายังอยู่ครบ', async () => {
    await mountDemo()

    addToCart('กาแฟ')
    addToCart('ชา')

    const note = screen.getByRole('textbox', { name: 'หมายเหตุ' })
    fireEvent.change(note, { target: { value: 'ส่งตอนเย็น' } })

    expect(note).toHaveValue('ส่งตอนเย็น')
    expect(within(cartRow('กาแฟ')).getByText('1')).toBeInTheDocument()
    expect(within(cartRow('ชา')).getByText('1')).toBeInTheDocument()
  })
})
