import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import App from './App'

describe('App Smoke Test', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders app header and default columns', () => {
    render(<App />)

    expect(screen.getByText(/KanFlow/i)).toBeInTheDocument()
    expect(screen.getByText('Todo')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
    expect(screen.getByText('Done')).toBeInTheDocument()
  })

  it('renders default tasks', () => {
    render(<App />)

    expect(screen.getByText('Design landing page')).toBeInTheDocument()
    expect(screen.getByText('Setup project repo')).toBeInTheDocument()
    expect(screen.getByText('Write README')).toBeInTheDocument()
  })
})
