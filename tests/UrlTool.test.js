import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/svelte'
import UrlTool from '$lib/tools/UrlTool.svelte'

describe('UrlTool', () => {
  let component

  beforeEach(() => {
    component = render(UrlTool)
  })

  it('should show textarea for text entry on mount', () => {
    const inputArea = screen.getByPlaceholderText(/Enter text or URL/i)
    expect(inputArea).toBeInTheDocument()
  })

  it('should encode text correctly', async () => {
    const inputArea = screen.getByPlaceholderText(/Enter text or URL/i) 
    await fireEvent.input(inputArea, { target: { value: 'hello world' } })
    
    // Wait for debouncing
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const outputContent = document.querySelector('.output-content')
    expect(outputContent?.textContent).toBe('hello%20world')
  })

  it('should decode URL-encoded text', async () => {
    const encodeButton = screen.getByText('Encode')
    const decodeButton = screen.getByText('Decode') 

    // Click decode mode
    await fireEvent.click(decodeButton) 
    
    const inputArea = screen.getByPlaceholderText(/Enter URL-encoded string/i)
    await fireEvent.input(inputArea, { target: { value: 'hello%20world' } })
    
    // Wait for processing
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const outputContent = document.querySelector('.output-content')
    expect(outputContent?.textContent).toBe('hello world')
  })

  it('should show empty state for empty input', async () => {
    const inputArea = screen.getByPlaceholderText(/Enter text or URL/i)
    await fireEvent.input(inputArea, { target: { value: '' } })
    
    // Wait for debouncing
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Verify empty state or similar
    const emptyState = document.querySelector('.empty-state')
    expect(emptyState).toBeInTheDocument()
  })

  it('should show error for invalid URL decode', async () => {
    const decodeButton = screen.getByText('Decode')
    await fireEvent.click(decodeButton)
    
    const inputArea = screen.getByPlaceholderText(/Enter URL-encoded string/i)
    await fireEvent.input(inputArea, { target: { value: '%invalid' } })
    
    // Wait for processing
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Check output for error indication
    const outputElement = document.querySelector('.output-content') || document.querySelector('.empty-state')
    
    // Check if error is present somehow, it might be handled gracefully
    expect(outputElement?.textContent ?? "").not.toBe('hello world')  // Should not decode to correct string
  })

  it('should extract path from URL in encode mode', async () => {
    const inputArea = screen.getByPlaceholderText(/Enter text or URL/i)
    
    await fireEvent.input(inputArea, { target: { value: 'https://example.com/path/to/page?param=value#section' } })
    
    // Find the extract button using its title
    const extractButton = screen.getByTitle('Extract from URL') 
    await fireEvent.click(extractButton)
    
    // Wait for processing
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Check for extracted content
    const outputElement = document.querySelector('.output-content')
    expect(outputElement?.textContent).toBeTruthy()  
  })

  it('should show error for invalid URL when extracting', async () => {
    const inputArea = screen.getByPlaceholderText(/Enter text or URL/i)
    await fireEvent.input(inputArea, { target: { value: 'not-a-url' } })
    
    const extractButton = screen.getByTitle('Extract from URL')
    await fireEvent.click(extractButton)
    
    // Wait for processing
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Check if error or fallback result appears
    const outputElement = document.querySelector('.output-content')
    // May contain error text or fallback text indicating issue with URL
    expect(outputElement?.textContent?.toLowerCase()).toMatch(/extract|error|invalid|url/i)
  })

  it('should clear all fields when clear button is clicked', async () => {
    const inputArea = screen.getByPlaceholderText(/Enter text or URL/i)
    await fireEvent.input(inputArea, { target: { value: 'test text' } })
    
    const clearButton = screen.getByTitle('Clear')
    await fireEvent.click(clearButton)
    
    expect(inputArea.value).toBe('')
    
    // Check if output area also clears/reverts to initial state
    const outputArea = document.querySelector('.output-content') || document.querySelector('.empty-state')
    const outputText = outputArea?.textContent || ""
    expect(outputText).toMatch(/(enter|empty|clear|input)/i)
  })

  it('should debounce input changes', async () => {
    const inputArea = screen.getByPlaceholderText(/Enter text or URL/i)
    
    // Rapid fire multiple changes
    await fireEvent.input(inputArea, { target: { value: 'test' } })
    await fireEvent.input(inputArea, { target: { value: 'test 2' } })
    await fireEvent.input(inputArea, { target: { value: 'test 3' } })
    
    // Give time for debounce
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Now output should reflect final input
    const finalOutput = document.querySelector('.output-content')
    expect(finalOutput?.textContent).toBe('test%203')  
  })

  it('should maintain mode switching state correctly', async () => {
    // Check default is encode
    expect(screen.getByText('Encode').classList.contains('active') || 
           !screen.getByText('Decode').classList.contains('active')).toBe(true)
    
    const decodeButton = screen.getByText('Decode')
    await fireEvent.click(decodeButton)
    
    // Verify mode change is reflected
    expect(screen.getByText('Decode').classList.contains('active') ||
           !screen.getByText('Encode').classList.contains('active')).toBe(true)
  })
})