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

// The derived summary line is the only text of its exact shape, so reading it
// asserts what the learner sees without naming any selector or store field.
function cartSummary(count, total) {
  return within(cartPanel()).getByText(
    `รวม ${count} ชิ้น · เป็นเงิน ${total} บาท`,
  )
}

describe('หน้า 5 — ยอดรวมที่คำนวณจาก store', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  test('เปิดหน้าแล้วบรรทัดสรุปบอก 0 ชิ้น เป็นเงิน 0 บาท', async () => {
    await mountDemo()

    expect(cartSummary(0, 0)).toBeInTheDocument()
    expect(
      within(cartPanel()).getByText('ยังไม่มีสินค้าในตะกร้า'),
    ).toBeInTheDocument()
  })

  test('กด "เพิ่มลงตะกร้า" ที่กาแฟแล้วที่ชา บรรทัดสรุปบอก 2 ชิ้น เป็นเงิน 105 บาท', async () => {
    await mountDemo()

    addToCart('กาแฟ')
    addToCart('ชา')

    expect(cartSummary(2, 105)).toBeInTheDocument()
  })

  test('กด + ที่กาแฟ หนึ่งครั้ง บรรทัดสรุปบอก 3 ชิ้น เป็นเงิน 165 บาท', async () => {
    await mountDemo()

    addToCart('กาแฟ')
    addToCart('ชา')
    fireEvent.click(within(cartRow('กาแฟ')).getByRole('button', { name: '+' }))

    expect(cartSummary(3, 165)).toBeInTheDocument()
  })

  test('กด − ที่กาแฟจนรายการหายไป บรรทัดสรุปบอก 2 ชิ้น เป็นเงิน 105 บาท', async () => {
    await mountDemo()

    addToCart('กาแฟ')
    addToCart('กาแฟ')
    addToCart('ชา')
    expect(cartSummary(3, 165)).toBeInTheDocument()

    // The − that brings the coffee row to one unit moves the summary to the
    // criterion's 2 ชิ้น / 105 บาท.
    fireEvent.click(within(cartRow('กาแฟ')).getByRole('button', { name: '−' }))
    expect(cartSummary(2, 105)).toBeInTheDocument()

    // The next − reaches zero and drops the row; the summary follows it out.
    fireEvent.click(within(cartRow('กาแฟ')).getByRole('button', { name: '−' }))
    expect(within(cartPanel()).queryByText(/^กาแฟ · /)).not.toBeInTheDocument()
    expect(cartSummary(1, 45)).toBeInTheDocument()
  })

  test('พิมพ์ข้อความในช่อง "หมายเหตุ" แล้วบรรทัดสรุปยังเป็นตัวเลขเดิม', async () => {
    await mountDemo()

    addToCart('กาแฟ')
    addToCart('ชา')
    expect(cartSummary(2, 105)).toBeInTheDocument()

    const note = screen.getByRole('textbox', { name: 'หมายเหตุ' })
    fireEvent.change(note, { target: { value: 'ส่งตอนเย็น' } })

    expect(note).toHaveValue('ส่งตอนเย็น')
    expect(cartSummary(2, 105)).toBeInTheDocument()
  })
})
