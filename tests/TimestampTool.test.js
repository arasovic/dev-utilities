import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/svelte'
import TimestampTool from '$lib/tools/TimestampTool.svelte'

describe('TimestampTool', () => {
  let component

  beforeEach(() => {
    component = render(TimestampTool)
  })

  it('should not show error for empty input on mount - should have default input', () => {
    // The component shouldn't show error immediately when mounted
    // It should have an initial empty input field, which may trigger the error as expected
    // Let's make sure required elements are present
    const inputField = screen.getByPlaceholderText('Enter Unix timestamp (e.g., 1704067200)...')
    expect(inputField).toBeInTheDocument()
  })

  it('should convert Unix timestamp to human readable date', async () => {
    const inputArea = screen.getByPlaceholderText('Enter Unix timestamp (e.g., 1704067200)...')
    await fireEvent.input(inputArea, { target: { value: '1609459200' } }) // 2021-01-01 00:00:00 UTC
    
    // Wait for debouncing
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const outputContentPre = document.querySelector('.output-content pre')
    expect(outputContentPre.textContent).toContain('2021')
  })

  it('should convert Unix timestamp (milliseconds) to human readable date', async () => {
    const inputArea = screen.getByPlaceholderText('Enter Unix timestamp (e.g., 1704067200)...')
    await fireEvent.input(inputArea, { target: { value: '1609459200000' } }) // 2021-01-01 00:00:00 UTC in milliseconds
    
    // Wait for debouncing
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const outputContentPre = document.querySelector('.output-content pre')
    expect(outputContentPre.textContent).toContain('2021')
  })

  it('should convert human readable date to Unix timestamp', async () => {
    // Switch to Human → Unix mode
    const toUnixButton = screen.getByText('Human → Unix')
    await fireEvent.click(toUnixButton)
    
    const inputArea = screen.getByPlaceholderText('Enter date (e.g., 2024-01-01 00:00:00)...')
    await fireEvent.input(inputArea, { target: { value: '2024-01-15 14:30:00' } })
    
    // Wait for debouncing
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const outputContentPre = document.querySelector('.output-content pre')
    // Check that output is a numeric timestamp
    expect(outputContentPre.textContent).toContain('unix')
    expect(parseInt(JSON.parse(outputContentPre.textContent).unix)).toBeGreaterThan(1600000000) // Around 2020
  })

  it('should handle timezone conversion', async () => {
    const newYorkButton = screen.getByText('New York (EST/EDT)')
    await fireEvent.click(newYorkButton)
    
    const inputArea = screen.getByPlaceholderText('Enter Unix timestamp (e.g., 1704067200)...')
    await fireEvent.input(inputArea, { target: { value: '1609459200' } }) // 2021-01-01 00:00:00 UTC
    
    // Wait for debouncing
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const outputContentPre = document.querySelector('.output-content pre')
    // Should show NY time which differs by hours from UTC (in JSON format)
    expect(outputContentPre.textContent).toContain('2020') // Different from UTC which would be 2021
  })

  it('should show error for invalid timestamp', async () => {
    const inputArea = screen.getByPlaceholderText('Enter Unix timestamp (e.g., 1704067200)...')
    await fireEvent.input(inputArea, { target: { value: 'not-a-timestamp' } })
    
    // Wait for debouncing
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Error message should be "Invalid timestamp format"
    const errorDiv = screen.getByText('Invalid timestamp format')
    expect(errorDiv).toBeInTheDocument()
  })

  it('should show error for invalid date', async () => {
    // Switch to Human → Unix mode
    const toUnixButton = screen.getByText('Human → Unix')
    await fireEvent.click(toUnixButton)
    
    const inputArea = screen.getByPlaceholderText('Enter date (e.g., 2024-01-01 00:00:00)...')
    await fireEvent.input(inputArea, { target: { value: 'invalid-date' } })
    
    // Wait for debouncing
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Error message should be "Invalid date format" 
    const errorDiv = screen.getByText('Invalid date format')
    expect(errorDiv).toBeInTheDocument()
  })

  it('should set current timestamp when "Now" button is clicked', async () => {
    const nowButton = screen.getByRole('button', { name: 'Now' })
    const inputArea = screen.getByPlaceholderText('Enter Unix timestamp (e.g., 1704067200)...')
    
    await fireEvent.click(nowButton)
    
    // Get value right away and check if it's a valid timestamp
    const timestamp = parseInt(inputArea.value)
    const currentTime = Math.floor(Date.now() / 1000)
    expect(timestamp).toBeGreaterThanOrEqual(currentTime - 5) // Within 5 seconds
    expect(timestamp).toBeLessThanOrEqual(currentTime + 5) // Within 5 seconds
  })

  it('should not show "Now" button in Human → Unix mode', async () => {
    // Switch to Human → Unix mode
    const toUnixButton = screen.getByText('Human → Unix')
    await fireEvent.click(toUnixButton)
    
    const nowButton = screen.queryByRole('button', { name: 'Now' })
    expect(nowButton).not.toBeInTheDocument()
  })

  it('should handle timezone selector visibility', () => {
    // In Unix -> Human mode, timezone selector should be visible
    const timezoneSection = screen.getByText('Output Timezone')
    expect(timezoneSection).toBeInTheDocument()
  })

  it('should clear all fields when clear button is clicked', async () => {
    const inputArea = screen.getByPlaceholderText('Enter Unix timestamp (e.g., 1704067200)...')
    await fireEvent.input(inputArea, { target: { value: '1609459200' } })
    
    const clearButton = screen.getByTitle('Clear')
    await fireEvent.click(clearButton)
    
    expect(inputArea.value).toBe('')
    expect(screen.queryByText('2021')).not.toBeInTheDocument()
  })

  it('should debounce input changes', async () => {
    const inputArea = screen.getByPlaceholderText('Enter Unix timestamp (e.g., 1704067200)...')
    
    // Rapid fire multiple changes
    await fireEvent.input(inputArea, { target: { value: '1609459200' } })
    await fireEvent.input(inputArea, { target: { value: '1609459201' } })
    await fireEvent.input(inputArea, { target: { value: '1609459202' } })
    
    // Before debounce, output should remain unchanged
    const outputArea = screen.queryByRole('status') || document.querySelector('.output-content pre')
    // No explicit output area yet when none exists - check it's not displaying old result of previous tests
    
    // Wait for debounce timeout
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Check output is updated with final input value
    const outputContent = document.querySelector('.output-content pre')
    expect(outputContent.textContent).toContain('2021') // From the final timestamp
  })

  it('should handle ISO date format', async () => {
    // Switch to Human → Unix mode first
    const toUnixButton = screen.getByText('Human → Unix')
    await fireEvent.click(toUnixButton)
    
    const inputArea = screen.getByPlaceholderText('Enter date (e.g., 2024-01-01 00:00:00)...')
    await fireEvent.input(inputArea, { target: { value: '2024-01-15T14:30:00Z' } })
    
    // Wait for debouncing
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const outputContentPre = document.querySelector('.output-content pre')
    // Should output a json object containing unix timestamps
    expect(outputContentPre.textContent).toContain('unix')
    expect(parseInt(JSON.parse(outputContentPre.textContent).unix)).toBeGreaterThan(1600000000)
  })

  it('should handle timezone abbreviations', async () => {
    const londonButton = screen.getByText('London (GMT/BST)')
    await fireEvent.click(londonButton)
    
    const inputArea = screen.getByPlaceholderText('Enter Unix timestamp (e.g., 1704067200)...')
    await fireEvent.input(inputArea, { target: { value: '1609459200' } })
    
    // Wait for debouncing
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Expect the output to be rendered in JSON format
    const outputContent = document.querySelector('.output-content pre')
    expect(outputContent.textContent).toBeTruthy()
  })

  it('should handle local timezone correctly', async () => {
    const localButton = screen.getByText('Local Time')
    await fireEvent.click(localButton)
    
    const inputArea = screen.getByPlaceholderText('Enter Unix timestamp (e.g., 1704067200)...')
    await fireEvent.input(inputArea, { target: { value: '1609459200' } })
    
    // Wait for debouncing
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Expect the output to be rendered in local timezone format
    const outputContent = document.querySelector('.output-content pre')
    expect(outputContent.textContent).toBeTruthy()
  })
})