import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte'
import UuidTool from '$lib/tools/UuidTool.svelte'

// Mock the crypto functions
vi.mock('$lib/utils/crypto.js', () => ({
  generateUUID: () => '12345678-1234-5678-9abc-123456789abc',
  generateUUIDs: (count) => Array(count).fill('12345678-1234-5678-9abc-123456789abc')
}))

describe('UuidTool', () => {
  let component

  beforeEach(() => {
    component = render(UuidTool)
  })

  it('should generate a single UUID when generate button is clicked', async () => {
    const generateButton = screen.getByText('Generate')
    await fireEvent.click(generateButton)
    
    await new Promise(resolve => setTimeout(resolve, 100)) // Wait for short delay after generation
    
    // In the new component, output will either be in a .uuid-single element or in a list for multiple
    const uuidElement = document.querySelector('.uuid-single')
    expect(uuidElement).toBeInTheDocument()
    expect(uuidElement.textContent).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
  })

  it('should generate multiple UUIDs when count > 1', async () => {
    const countInput = document.querySelector('.count-input')
    await fireEvent.input(countInput, { target: { value: '3' } })
    
    // Wait for debounce
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const uuidList = document.querySelectorAll('.uuid-item')
    expect(uuidList).toHaveLength(3)
    
    // Check each UUID in the list
    for (let i = 0; i < 3; i++) {
      const uuidElement = uuidList[i].querySelector('.uuid-text')
      expect(uuidElement.textContent).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    }
  })

  it('should show error when count < 1', async () => {
    const countInput = document.querySelector('.count-input')
    await fireEvent.input(countInput, { target: { value: '0' } })
    
    // Wait for debounce
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const errorEl = document.querySelector('.error-state span')
    expect(errorEl.textContent).toContain('Count must be between 1 and 100')
  })

  it('should show error when count > 100', async () => {
    const countInput = document.querySelector('.count-input')
    await fireEvent.input(countInput, { target: { value: '101' } })
    
    // Wait for debounce
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const errorEl = document.querySelector('.error-state span')
    expect(errorEl.textContent).toContain('Count must be between 1 and 100')
  })

  it('should clear output and reset count when clear button is clicked', async () => {
    // First generate some UUIDs
    const countInput = document.querySelector('.count-input')
    await fireEvent.input(countInput, { target: { value: '2' } })
    
    // Wait 
    await new Promise(resolve => setTimeout(resolve, 200))
    expect(document.querySelector('.uuid-list')).toBeInTheDocument()
    
    // Clear
    const clearButton = document.querySelector('.btn-ghost[title="Clear"]')
    await fireEvent.click(clearButton)
    
    // Give time for the DOM content update to happen
    await new Promise(resolve => setTimeout(resolve, 20));
    
    // Verify that the count is reset to 1
    expect(countInput.value).toBe('1')
    
    // After clear, either no list exists or the single uuid element should be clear
    const uuidList = document.querySelector('.uuid-list')
    expect(uuidList).toBeNull() // Multiple UUIDs should not be displayed
    
    // The single uuid case doesn't apply when count > 1, only applies for count == 1 at the beginning
    // So we don't expect any uuids since we had count=2 initially
    expect(document.querySelector('.uuid-item')).toBeNull()
    
    const errorEl = document.querySelector('.error-state')
    expect(errorEl).toBeNull()
  })

  it('should debounce input changes', async () => {
    const countInput = document.querySelector('.count-input')
    
    // Get initial output - this might be the initial UUID generated when component loads or empty string
    // When component mounts with count=1, an initial UUID is generated
    await new Promise(resolve => setTimeout(resolve, 200)) // Wait for component mount if first load

    // Rapid fire multiple changes
    await fireEvent.input(countInput, { target: { value: '1' } }) // Default count
    await fireEvent.input(countInput, { target: { value: '2' } })
    await fireEvent.input(countInput, { target: { value: '3' } })
    
    // Output should not change immediately due to debouncing (but will keep initial values during debounce)
    // After rapid inputs, the content might still reflect the previous value due to debouncing
    const uuidElementsBeforeDebounce = document.querySelectorAll('.uuid-item')
    const countBefore = uuidElementsBeforeDebounce.length

    // Wait for debounce timeout (150ms + buffer)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // After debounce, there should be the expected count of UUIDs (should now be 3 items)
    const uuidItemsAfter = document.querySelectorAll('.uuid-item')
    expect(uuidItemsAfter).toHaveLength(3)
  })
})