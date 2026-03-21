import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/svelte'
import JsonTool from '$lib/tools/JsonTool.svelte'

describe('JsonTool', () => {
  let component

  beforeEach(() => {
    component = render(JsonTool)
  })

  it('should not show error for empty input initially', () => {
    const inputArea = screen.getByPlaceholderText('Paste your JSON here...')
    expect(inputArea).toBeInTheDocument()
  })

  it('should validate and format valid JSON', async () => {
    const inputArea = screen.getByPlaceholderText('Paste your JSON here...')
    await fireEvent.input(inputArea, { target: { value: '{"name": "test", "value": 123}' } })
    
    // Wait for debouncing
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const outputArea = document.querySelector('.output-area')
    expect(outputArea.textContent).toContain('name')
    expect(outputArea.textContent).toContain('test')
    expect(outputArea.textContent).toContain('value')
    expect(outputArea.textContent).toContain('123')
  })

  it('should show error for invalid JSON', async () => {
    const inputArea = screen.getByPlaceholderText('Paste your JSON here...')
    await fireEvent.input(inputArea, { target: { value: '{"name": "test", "value": 123' } })
    
    // Wait for debouncing
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const errorDiv = document.querySelector('.error-state span')
    expect(errorDiv.textContent).toContain('Invalid JSON')
  })

  it('should show error with line and column for invalid JSON', async () => {
    const inputArea = screen.getByPlaceholderText('Paste your JSON here...')
    await fireEvent.input(inputArea, { target: { value: '{\n  "name": "test",\n  "value": 123\n  "broken": "string"\n}' } })
    
    // Wait for debouncing
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const errorDiv = document.querySelector('.error-state span')
    expect(errorDiv.textContent).toContain('line')
    expect(errorDiv.textContent).toContain('column')
  })

  it('should minify JSON when minify button is clicked', async () => {
    const inputArea = screen.getByPlaceholderText('Paste your JSON here...')
    await fireEvent.input(inputArea, { target: { value: '{"name": "test", "value": 123}' } })
    
    // Wait for initial processing
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const minifyButton = screen.getByText('Minify')
    await fireEvent.click(minifyButton)
    
    // Wait for the minification to process
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const outputArea = document.querySelector('.output-area')
    expect(outputArea.textContent).toBe('{"name":"test","value":123}')
  })

  it('should prettify JSON when prettify button is clicked', async () => {
    const inputArea = screen.getByPlaceholderText('Paste your JSON here...')
    await fireEvent.input(inputArea, { target: { value: '{"name":"test","value":123}' } }) // Minified JSON
    
    // Wait for initial processing
    await new Promise(resolve => setTimeout(resolve, 400)); // Allow debounce processing
    
    // Click prettify
    const prettifyButton = screen.getByText('Prettify')
    await fireEvent.click(prettifyButton)
    
    // Wait for the prettification to process
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const outputArea = document.querySelector('.output-area')
    expect(outputArea.textContent).toContain('"name"')
    expect(outputArea.textContent).toContain('test')
    expect(outputArea.textContent).toContain('"value"')
    expect(outputArea.textContent).toContain('123')
  })

  it('should maintain prettified state after processing', async () => {
    const inputArea = screen.getByPlaceholderText('Paste your JSON here...')
    await fireEvent.input(inputArea, { target: { value: '{"name": "test", "value": 123}' } }) // Pretty JSON
    
    // Wait for initial processing
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Minify
    const minifyButton = screen.getByText('Minify')
    await fireEvent.click(minifyButton)
    await new Promise(resolve => setTimeout(resolve, 100));
    
    let outputArea = document.querySelector('.output-area')
    expect(outputArea.textContent).toBe('{"name":"test","value":123}')
    
    // Prettify again
    const prettifyButton = screen.getByText('Prettify')
    await fireEvent.click(prettifyButton)
    await new Promise(resolve => setTimeout(resolve, 100));
    
    outputArea = document.querySelector('.output-area')
    expect(outputArea.textContent).toContain('{')
    expect(outputArea.textContent).toContain('test')
  })

  it('should clear all fields when clear button is clicked', async () => {
    const inputArea = screen.getByPlaceholderText('Paste your JSON here...')
    await fireEvent.input(inputArea, { target: { value: '{"name": "test"}' } })
    
    // Wait for initial processing
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const clearButton = document.querySelector('.btn-ghost[title="Clear"]')
    await fireEvent.click(clearButton)
    
    expect(inputArea.value).toBe('')
    // Check that the output area is cleared - it becomes empty string by default
    const outputArea = document.querySelector('.output-area')
    expect(outputArea.textContent).toBe('')
  })

  it('should debounce input changes', async () => {
    const inputArea = screen.getByPlaceholderText('Paste your JSON here...')
    
    // Rapid fire multiple changes
    await fireEvent.input(inputArea, { target: { value: '{' } })
    await fireEvent.input(inputArea, { target: { value: '{"name": "test"' } })
    await fireEvent.input(inputArea, { target: { value: '{"name": "test", "value": 123}' } })
    
    // Initially output should remain unchanged until debouncing occurs
    const outputArea = document.querySelector('.output-area')
    expect(outputArea.textContent).toBe('')
    
    // Wait for the final debounce timeout (300+ms as configured)
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Now it should contain the final JSON content
    expect(outputArea.textContent).toContain('name')
  })

  it('should handle complex nested JSON', async () => {
    const inputArea = screen.getByPlaceholderText('Paste your JSON here...')
    const complexJson = `{
      "user": {
        "name": "John Doe",
        "age": 30,
        "address": {
          "street": "123 Main St",
          "city": "New York",
          "coordinates": {
            "lat": 40.7128,
            "lng": -74.0060
          }
        },
        "hobbies": ["reading", "swimming", "coding"]
      }
    }`
    
    await fireEvent.input(inputArea, { target: { value: complexJson } })
    
    // Wait for debouncing
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const outputArea = document.querySelector('pre.output-area')
    expect(outputArea.textContent).toContain('user')
    expect(outputArea.textContent).toContain('address')
    expect(outputArea.textContent).toContain('hobbies')
    expect(outputArea.textContent).toContain('John Doe')
    expect(outputArea.textContent).toContain('reading')
  })
})