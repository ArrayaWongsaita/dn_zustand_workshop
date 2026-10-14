import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, test } from 'vitest'
import App from '../../App.jsx'
import { useSiteStore } from '../site-store.js'

// The site store is a module-level singleton, so state would otherwise leak
// between cases in this file (a reveal left open, a page left visited).
beforeEach(() => {
  useSiteStore.setState({ visited: [], revealed: [] })
})

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

  test('opening a page marks its sidebar row as visited', () => {
    renderAt('/01-counter')

    const nav = screen.getByRole('navigation')
    const row = within(nav).getByRole('link', { name: /^1ตัวนับ/ })
    expect(within(row).getByText('✓')).toBeInTheDocument()
  })

  test('reveal state is per page', () => {
    renderAt('/01-counter')
    fireEvent.click(screen.getByRole('button', { name: 'ดูเฉลย' }))
    expect(
      screen.getByText('src/store/useCounterStore.js'),
    ).toBeInTheDocument()

    // Move to page 2 through the sidebar; its reveal is its own and must still
    // be collapsed — page 1's open state does not leak across pages.
    fireEvent.click(
      within(screen.getByRole('navigation')).getByRole('link', {
        name: /^2ตัวนับสองตัว/,
      }),
    )

    expect(
      screen.getByRole('heading', { level: 1, name: 'ตัวนับสองตัว' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'ดูเฉลย' })).toBeInTheDocument()
    expect(screen.queryByText('src/App.jsx')).not.toBeInTheDocument()
  })
})
