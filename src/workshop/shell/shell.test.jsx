import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, test } from 'vitest'
import App from '../../App.jsx'

// Renders the real shell at a path, so the routes, the sidebar and the page
// template are exercised the way a learner meets them.
function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('site shell', () => {
  test('home renders the heading and the start-here card', () => {
    renderAt('/')

    expect(
      screen.getByRole('heading', { level: 1, name: 'เวิร์กช็อป Zustand' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'เริ่มต้นใช้งาน' }),
    ).toBeInTheDocument()
  })

  test('an unknown path falls back to home', () => {
    renderAt('/does-not-exist')

    expect(
      screen.getByRole('heading', { level: 1, name: 'เวิร์กช็อป Zustand' }),
    ).toBeInTheDocument()
  })

  test('page 1 renders the seven template sections in order', () => {
    renderAt('/01-counter')

    expect(
      screen.getByRole('heading', { level: 1, name: 'ตัวนับ' }),
    ).toBeInTheDocument()
    expect(
      screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent),
    ).toEqual([
      'เดโมเป้าหมาย',
      'โจทย์',
      'เกณฑ์ความสำเร็จ',
      'กับดัก',
      'คำใบ้',
      'ส่วนเฉลย',
    ])
  })

  test('the solution reveal starts collapsed', () => {
    renderAt('/01-counter')

    expect(screen.getByRole('button', { name: 'ดูเฉลย' })).toBeInTheDocument()
    expect(screen.queryByText('src/App.jsx')).not.toBeInTheDocument()
  })

  test('opening the reveal shows code blocks only', () => {
    renderAt('/01-counter')

    fireEvent.click(screen.getByRole('button', { name: 'ดูเฉลย' }))

    expect(
      screen.getByRole('button', { name: 'ซ่อนเฉลย' }),
    ).toBeInTheDocument()
    expect(screen.getByText('src/store/useCounterStore.js')).toBeInTheDocument()
    expect(screen.getByText('src/App.jsx')).toBeInTheDocument()
  })

  test('the start-here page renders the setup copy and no store code', () => {
    renderAt('/start')

    expect(
      screen.getByRole('heading', { level: 1, name: 'เริ่มต้นใช้งาน' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/npm create vite@latest zustand-workshop/)).toBeInTheDocument()
    expect(screen.getByText(/npm ls zustand/)).toBeInTheDocument()
    expect(screen.queryByText(/import \{ create \}/)).not.toBeInTheDocument()
  })
})
