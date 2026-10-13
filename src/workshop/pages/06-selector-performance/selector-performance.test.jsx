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

// Each part labels its own counter `<part> · render: N`. Reading the number off
// the visible line is the observable the criteria are written against; the
// tests only ever compare whether a counter moved, never the absolute value.
function renderCount(part) {
  const label = screen.getByText(new RegExp(`^${part} · render: \\d+$`))
  return Number(label.textContent.match(/(\d+)$/)[1])
}

// The item list is the section holding its counter label. Its first list is the
// catalog, its second the cart rows.
function itemListSection() {
  return screen.getByText(/^รายการสินค้า · render:/).closest('section')
}

function catalogRow(name) {
  const [catalog] = within(itemListSection()).getAllByRole('list')
  return within(catalog).getByText(new RegExp(`^${name} · `)).closest('li')
}

function cartRow(name) {
  const lists = within(itemListSection()).getAllByRole('list')
  return within(lists[1]).getByText(new RegExp(`^${name} · `)).closest('li')
}

function addToCart(name) {
  fireEvent.click(
    within(catalogRow(name)).getByRole('button', { name: 'เพิ่มลงตะกร้า' }),
  )
}

// The summary line is the only text of its exact shape, so reading it asserts
// what the learner sees without naming any selector or store field.
function summaryLine(count, total) {
  return screen.getByText(`รวม ${count} ชิ้น · เป็นเงิน ${total} บาท`)
}

describe('หน้า 6 — selector กับปัญหาการ render', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  test('เปิดหน้าแล้วเห็นตัวเลข render ของทั้งสี่ส่วน และตัวเลขของ App ไม่เพิ่มขึ้นอีกหลังจากการวาดครั้งแรก', async () => {
    await mountDemo()

    expect(renderCount('App')).toEqual(expect.any(Number))
    expect(renderCount('รายการสินค้า')).toEqual(expect.any(Number))
    expect(renderCount('การ์ดสรุปยอด')).toEqual(expect.any(Number))
    expect(renderCount('หมายเหตุ')).toEqual(expect.any(Number))

    // App subscribes to nothing, so a store change moves the parts but leaves
    // App's own counter where it was after the first paint.
    const appBefore = renderCount('App')
    addToCart('กาแฟ')
    expect(renderCount('App')).toBe(appBefore)
  })

  test('กด "เพิ่มลงตะกร้า" ที่กาแฟแล้วที่ชา ตัวเลข render ของรายการสินค้าและการ์ดสรุปยอดเพิ่มขึ้น แต่ของ App ไม่เพิ่ม และการ์ดสรุปยอดบอก 2 ชิ้น เป็นเงิน 105 บาท', async () => {
    await mountDemo()

    const appBefore = renderCount('App')
    const itemBefore = renderCount('รายการสินค้า')
    const summaryBefore = renderCount('การ์ดสรุปยอด')

    addToCart('กาแฟ')
    addToCart('ชา')

    expect(renderCount('รายการสินค้า')).toBeGreaterThan(itemBefore)
    expect(renderCount('การ์ดสรุปยอด')).toBeGreaterThan(summaryBefore)
    expect(renderCount('App')).toBe(appBefore)
    expect(summaryLine(2, 105)).toBeInTheDocument()
  })

  test('กด + ที่กาแฟ หนึ่งครั้ง ตัวเลข render ของรายการสินค้าและการ์ดสรุปยอดเพิ่มขึ้น แต่ของหมายเหตุไม่เพิ่ม และการ์ดสรุปยอดบอก 3 ชิ้น เป็นเงิน 165 บาท', async () => {
    await mountDemo()

    addToCart('กาแฟ')
    addToCart('ชา')

    const itemBefore = renderCount('รายการสินค้า')
    const summaryBefore = renderCount('การ์ดสรุปยอด')
    const noteBefore = renderCount('หมายเหตุ')

    fireEvent.click(within(cartRow('กาแฟ')).getByRole('button', { name: '+' }))

    expect(renderCount('รายการสินค้า')).toBeGreaterThan(itemBefore)
    expect(renderCount('การ์ดสรุปยอด')).toBeGreaterThan(summaryBefore)
    expect(renderCount('หมายเหตุ')).toBe(noteBefore)
    expect(summaryLine(3, 165)).toBeInTheDocument()
  })

  test('พิมพ์ข้อความในช่อง "หมายเหตุ" ตัวเลข render ของหมายเหตุเพิ่มขึ้น แต่ของรายการสินค้าและการ์ดสรุปยอดไม่เพิ่ม', async () => {
    await mountDemo()

    addToCart('กาแฟ')
    addToCart('ชา')

    const itemBefore = renderCount('รายการสินค้า')
    const summaryBefore = renderCount('การ์ดสรุปยอด')
    const noteBefore = renderCount('หมายเหตุ')

    const note = screen.getByRole('textbox')
    fireEvent.change(note, { target: { value: 'ส่งตอนเย็น' } })

    expect(renderCount('หมายเหตุ')).toBeGreaterThan(noteBefore)
    expect(renderCount('รายการสินค้า')).toBe(itemBefore)
    expect(renderCount('การ์ดสรุปยอด')).toBe(summaryBefore)
    expect(note).toHaveValue('ส่งตอนเย็น')
  })

  test('ใช้งานต่อไปสักครู่แล้วหน้าไม่ค้าง และ console ไม่มี error เรื่องการอัปเดตซ้ำหรือ getSnapshot', async () => {
    const messages = []
    const errorSpy = vi.spyOn(console, 'error').mockImplementation((...args) => {
      messages.push(args.map(String).join(' '))
    })

    try {
      await mountDemo()

      addToCart('กาแฟ')
      addToCart('ชา')
      fireEvent.click(
        within(cartRow('กาแฟ')).getByRole('button', { name: '+' }),
      )
      fireEvent.click(
        within(cartRow('กาแฟ')).getByRole('button', { name: '−' }),
      )
      const note = screen.getByRole('textbox')
      fireEvent.change(note, { target: { value: 'ส่งตอนเย็น' } })
      fireEvent.change(note, { target: { value: 'ส่งตอนเช้า' } })
      fireEvent.click(
        within(cartRow('กาแฟ')).getByRole('button', { name: 'ลบ' }),
      )

      // The page is still responsive after the whole session: the summary
      // tracks the cart, so it has not frozen on a repeating update.
      expect(summaryLine(1, 45)).toBeInTheDocument()

      const repeating = messages.filter((message) =>
        /Maximum update depth exceeded|getSnapshot should be cached|infinite loop/i.test(
          message,
        ),
      )
      expect(repeating).toEqual([])
    } finally {
      errorSpy.mockRestore()
    }
  })
})
