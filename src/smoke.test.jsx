import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import appSource from './workshop/pages/01-counter/App.jsx?raw'

// A trivial component, enough to prove React renders under the test runner.
function Greeting({ name }) {
  return <p>สวัสดี {name}</p>
}

describe('site test runner', () => {
  test('renders a component and shows its output to the user', () => {
    render(<Greeting name="Zustand" />)

    expect(screen.getByText('สวัสดี Zustand')).toBeInTheDocument()
  })

  test('resolves Vite ?raw imports for the solution reveal', () => {
    expect(appSource).toContain('export default function App()')
  })
})
