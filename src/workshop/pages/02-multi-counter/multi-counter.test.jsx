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

// The demo is two unlabelled rows; each row starts with its Thai label, so the
// row is the smallest visible region holding one counter and its two buttons.
function counter(label) {
  return within(screen.getByText(label).parentElement)
}

describe('หน้า 2 — ตัวนับสองตัว', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  test('เปิดหน้าแล้วเห็นตัวนับ A และ B เป็น 0 ทั้งคู่', async () => {
    await mountDemo()

    expect(counter('ตัวนับ A').getByText('0')).toBeInTheDocument()
    expect(counter('ตัวนับ B').getByText('0')).toBeInTheDocument()
  })

  test('กด + ของตัวนับ A แล้ว A เพิ่มขึ้น 1 และ B ยังเป็นค่าเดิม', async () => {
    await mountDemo()

    fireEvent.click(counter('ตัวนับ A').getByRole('button', { name: '+' }))

    expect(counter('ตัวนับ A').getByText('1')).toBeInTheDocument()
    expect(counter('ตัวนับ B').getByText('0')).toBeInTheDocument()
  })

  test('กด − ของตัวนับ B แล้ว B ลดลง 1 และ A ยังเป็นค่าเดิม', async () => {
    await mountDemo()

    fireEvent.click(counter('ตัวนับ B').getByRole('button', { name: '−' }))

    expect(counter('ตัวนับ B').getByText('-1')).toBeInTheDocument()
    expect(counter('ตัวนับ A').getByText('0')).toBeInTheDocument()
  })

  test('กด "รีเซ็ตทั้งหมด" แล้วทั้ง A และ B กลับเป็น 0', async () => {
    await mountDemo()

    fireEvent.click(counter('ตัวนับ A').getByRole('button', { name: '+' }))
    fireEvent.click(counter('ตัวนับ A').getByRole('button', { name: '+' }))
    fireEvent.click(counter('ตัวนับ B').getByRole('button', { name: '−' }))
    expect(counter('ตัวนับ A').getByText('2')).toBeInTheDocument()
    expect(counter('ตัวนับ B').getByText('-1')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'รีเซ็ตทั้งหมด' }))

    expect(counter('ตัวนับ A').getByText('0')).toBeInTheDocument()
    expect(counter('ตัวนับ B').getByText('0')).toBeInTheDocument()
  })
})
