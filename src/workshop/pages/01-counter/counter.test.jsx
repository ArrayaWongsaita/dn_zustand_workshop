import { fireEvent, render, screen } from '@testing-library/react'
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

describe('หน้า 1 — ตัวนับ', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  test('เปิดหน้าแล้วเห็นเลข 0', async () => {
    await mountDemo()

    expect(screen.getByText('0')).toBeInTheDocument()
  })

  test('กด "เพิ่ม" แล้วตัวเลขเพิ่มขึ้น 1', async () => {
    await mountDemo()

    fireEvent.click(screen.getByRole('button', { name: 'เพิ่ม' }))

    expect(screen.getByText('1')).toBeInTheDocument()
  })

  test('กด "ลด" แล้วตัวเลขลดลง 1', async () => {
    await mountDemo()

    fireEvent.click(screen.getByRole('button', { name: 'ลด' }))

    expect(screen.getByText('-1')).toBeInTheDocument()
  })

  test('กด "รีเซ็ต" แล้วตัวเลขกลับเป็น 0', async () => {
    await mountDemo()

    fireEvent.click(screen.getByRole('button', { name: 'เพิ่ม' }))
    fireEvent.click(screen.getByRole('button', { name: 'เพิ่ม' }))
    expect(screen.getByText('2')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'รีเซ็ต' }))

    expect(screen.getByText('0')).toBeInTheDocument()
  })
})
