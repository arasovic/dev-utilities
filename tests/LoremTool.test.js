import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte'
import LoremTool from '$lib/tools/LoremTool.svelte'

describe('LoremTool', () => {
  let component

  beforeEach(() => {
    component = render(LoremTool)
  })

  it('should generate lorem ipsum text when input is made', async () => {
    // Find inputs based on their positions/placeholder text instead or associated labels  
    const paragraphsInputs = screen.getAllByRole('spinbutton') // There should be two: paragraphs and words
    const paragraphsInput = paragraphsInputs[0] // First should be paragraphs since rendered first
    
    await fireEvent.input(paragraphsInput, { target: { value: '1' } })
    
    await new Promise(resolve => setTimeout(resolve, 200)); // wait for debounce
    
    const outputBox = document.querySelector('.output-content')
    expect(outputBox).toBeInTheDocument()
    expect(outputBox.textContent).toBeTruthy()
    expect(outputBox.textContent.toLowerCase()).toContain('lorem')
  })

  it('should generate specified number of paragraphs', async () => {
    const paragraphsInputs = screen.getAllByRole('spinbutton') 
    const paragraphsInput = paragraphsInputs[0]
      
    await fireEvent.input(paragraphsInput, { target: { value: '3' } })
    
    await new Promise(resolve => setTimeout(resolve, 200)); // wait for debounce
    
    const outputBox = document.querySelector('.output-content')
    const paragraphs = outputBox.textContent.split('\n\n').filter(p => p.trim())
    expect(paragraphs).toHaveLength(3)
  })

  it('should generate specified words per paragraph', async () => {
    const paragraphsInputs = screen.getAllByRole('spinbutton') 
    const wordsInput = paragraphsInputs[1] // Second should be words input
    const paragraphsInput = paragraphsInputs[0] // First should be paragraphs input
    
    await fireEvent.input(paragraphsInput, { target: { value: '1' } })
    await fireEvent.input(wordsInput, { target: { value: '10' } })
    
    await new Promise(resolve => setTimeout(resolve, 200)); // wait for debounce
    
    const outputBox = document.querySelector('.output-content')
    expect(outputBox).toBeInTheDocument()
    if (outputBox) {
      const words = outputBox.textContent.split(' ').filter(word => word.trim() !== '');
      expect(words.length).toBe(10)
    }
  })

  it('should respect start with Lorem checkbox', async () => { 
    // Get the checkboxes (there's only one - the startWithLorem checkbox)
    const startLoremCheckbox = screen.getByRole('checkbox') 
    const paragraphsInputs = screen.getAllByRole('spinbutton')
    const paragraphsInput = paragraphsInputs[0]

    // Test with start with Lorem (default, checked)
    await fireEvent.input(paragraphsInput, { target: { value: '1' } })
    
    await new Promise(resolve => setTimeout(resolve, 200)); // wait for debounce
    
    const outputBox = document.querySelector('.output-content')
    expect(outputBox.textContent.charAt(0)).toBe('L')
    
    // Test without start with Lorem (unchecked)
    await fireEvent.click(startLoremCheckbox)
    // Need to wait a bit for state change then clear and enter value again
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Clear the input first
    await fireEvent.input(paragraphsInput, { target: { value: '0' } })
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Then set the desired input
    await fireEvent.input(paragraphsInput, { target: { value: '1' } })
    
    await new Promise(resolve => setTimeout(resolve, 200)); // wait for debounce
    
    const newOutputBox = document.querySelector('.output-content')
    expect(newOutputBox.textContent.charAt(0)).toBe('l')
  })

  it('should not generate output when paragraphs < 1', async () => {
    const paragraphsInputs = screen.getAllByRole('spinbutton')
    const paragraphsInput = paragraphsInputs[0]
    
    await fireEvent.input(paragraphsInput, { target: { value: '0' } })
    
    await new Promise(resolve => setTimeout(resolve, 200)); // wait for debounce
    
    // Look for empty state or lack of content  
    const emptyState = document.querySelector('.empty-state')
    expect(emptyState).toBeInTheDocument()
  })

  it('should reset fields when clear button is clicked', async () => {
    const clearButton = screen.getByTitle('Clear') // Title attribute used for clearing
    
    const paragraphsInputs = screen.getAllByRole('spinbutton')
    const paragraphsInput = paragraphsInputs[0]
    const wordsInput = paragraphsInputs[1]

    // Set some values
    await fireEvent.input(paragraphsInput, { target: { value: '2' } })
    await fireEvent.input(wordsInput, { target: { value: '20' } })
    
    // Click clear button
    await fireEvent.click(clearButton)

    // Check if fields have been reset - wait a tiny bit for UI updates  
    await new Promise(resolve => setTimeout(resolve, 50));

    // Values should be back to defaults (3 paragraphs, 50 words)
    expect(paragraphsInput.value).toBe('3') 
    expect(wordsInput.value).toBe('50')
  })

  it('should use default word count when not specified', async () => {
    const paragraphsInputs = screen.getAllByRole('spinbutton')
    const paragraphsInput = paragraphsInputs[0] 
    const wordsInput = paragraphsInputs[1]
    
    // Set paragraphs 
    await fireEvent.input(paragraphsInput, { target: { value: '1' } })
    // Don't set words - let component use default
        
    await new Promise(resolve => setTimeout(resolve, 200)); // wait for debounce
    
    const outputBox = document.querySelector('.output-content')
    const words = outputBox.textContent.split(' ').filter(word => word.trim() !== '');
    expect(words.length).toBeGreaterThanOrEqual(40) // Default should be 50 words approximately
    expect(words.length).toBeLessThanOrEqual(60)  // Reasonable bound for default 50
  })

  it('should debounce input changes', async () => {
    const paragraphsInputs = screen.getAllByRole('spinbutton')
    const paragraphsInput = paragraphsInputs[0]
    
    // Rapid fire multiple changes
    await fireEvent.input(paragraphsInput, { target: { value: '2' } })
    await fireEvent.input(paragraphsInput, { target: { value: '5' } })
    await fireEvent.input(paragraphsInput, { target: { value: '3' } })
    
    // Output should not change immediately due to debouncing
    const initialOutput = document.querySelector('.output-content')?.textContent || ''
    
    // Wait for debounce timeout
    await waitFor(() => {
      const currentOutput = document.querySelector('.output-content').textContent
      expect(currentOutput).not.toBe(initialOutput)
    }, { timeout: 300 })
  })
})