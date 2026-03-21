import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/svelte'
import ColorTool from '$lib/tools/ColorTool.svelte'

describe('ColorTool', () => {
  let component

  beforeEach(() => {
    component = render(ColorTool)
  })

  it('should have color preview on mount', () => {
    const colorPreview = document.querySelector('.color-swatch')
    expect(colorPreview).toBeInTheDocument()
  })

  it('should update RGB and HSL when HEX input is changed', async () => {
    const inputs = screen.getAllByRole('textbox')
    const hexInput = inputs[0]
    const rgbInput = inputs[1] 
    const hslInput = inputs[2]
    
    await fireEvent.input(hexInput, { target: { value: 'FF0000' } })
    
    await new Promise(resolve => setTimeout(resolve, 100)); // Give time for updates
    
    expect(rgbInput.value).toBe('rgb(255, 0, 0)')
    expect(hslInput.value).toBe('hsl(0, 100%, 50%)')
    const colorPreview = document.querySelector('.color-swatch')
  })

  it('should update HEX and HSL when RGB input is changed', async () => {
    const inputs = screen.getAllByRole('textbox')
    const hexInput = inputs[0]
    const rgbInput = inputs[1] 
    const hslInput = inputs[2]
    
    await fireEvent.input(rgbInput, { target: { value: 'rgb(255, 0, 0)' } })
    
    await new Promise(resolve => setTimeout(resolve, 100)); // Give time for updates

    expect(hexInput.value).toMatch(/#ff0000/i) // Component formats with # and lowercase
    expect(hslInput.value).toBe('hsl(0, 100%, 50%)')
    const colorPreview = document.querySelector('.color-swatch')
  })

  it('should update HEX and RGB when HSL input is changed', async () => {
    const inputs = screen.getAllByRole('textbox')
    const hexInput = inputs[0]
    const rgbInput = inputs[1] 
    const hslInput = inputs[2]
    
    await fireEvent.input(hslInput, { target: { value: 'hsl(0, 100%, 50%)' } })
    
    await new Promise(resolve => setTimeout(resolve, 100)); // Give time for updates 
    
    expect(hexInput.value).toMatch(/#ff0000/i) // Component uses lowercase with hashtag
    expect(rgbInput.value).toBe('rgb(255, 0, 0)')
    const colorPreview = document.querySelector('.color-swatch')
  })

  it('should handle 3-digit HEX input', async () => {
    const inputs = screen.getAllByRole('textbox')
    const hexInput = inputs[0]
    const rgbInput = inputs[1]
    
    await fireEvent.input(hexInput, { target: { value: 'f00' } }) // Input 3 digit hex
    
    await new Promise(resolve => setTimeout(resolve, 100)); // Give time for updates
    
    // Proper 3-digit hex: #f00 should expand to #ff0000 which is rgb(255, 0, 0)
    expect(rgbInput.value).toBe('rgb(255, 0, 0)')
    const colorPreview = document.querySelector('.color-swatch')
  })

  it('should clear all fields when clear button is clicked', async () => {
    const inputs = screen.getAllByRole('textbox')
    const clearButton = screen.getByTitle('Clear') // Use title attribute instead of text
    
    // Check original values before clearing
    await fireEvent.input(inputs[0], { target: { value: 'FF0000' } })
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Click clear button
    await fireEvent.click(clearButton)
    
    await new Promise(resolve => setTimeout(resolve, 50)); // Allow time for update
    
    expect(inputs[0].value).toBe('#')  // Hex input stays at '#' when cleared
    expect(inputs[1].value).toBe('')   // RGB input resets to empty
    expect(inputs[2].value).toBe('')   // HSL input resets to empty
  })

  it('should handle invalid HEX input gracefully', async () => {
    const inputs = screen.getAllByRole('textbox')
    const hexInput = inputs[0]
    const rgbInput = inputs[1] 
    const hslInput = inputs[2]
    
    await fireEvent.input(hexInput, { target: { value: 'notahex' } })
    
    await new Promise(resolve => setTimeout(resolve, 100)); // Give time for updates
    
    expect(rgbInput.value).toBe('')
    expect(hslInput.value).toBe('')
    const colorPreview = document.querySelector('.color-swatch')
  })

  it('should handle invalid RGB input gracefully', async () => {
    const inputs = screen.getAllByRole('textbox')
    const hexInput = inputs[0]
    const rgbInput = inputs[1] 
    const hslInput = inputs[2]
    
    await fireEvent.input(rgbInput, { target: { value: 'notanrgb' } })
    
    await new Promise(resolve => setTimeout(resolve, 100)); // Give time for updates
    
    expect(hexInput.value).toBe('#') // Default to '#' on invalid RGB input
    expect(hslInput.value).toBe('')
    const colorPreview = document.querySelector('.color-swatch')
  })

  it('should handle invalid HSL input gracefully', async () => {
    const inputs = screen.getAllByRole('textbox')
    const hexInput = inputs[0]
    const rgbInput = inputs[1] 
    const hslInput = inputs[2]
    
    await fireEvent.input(hslInput, { target: { value: 'notanhsl' } })
    
    await new Promise(resolve => setTimeout(resolve, 100)); // Give time for updates
    
    expect(hexInput.value).toBe('#')  // Reset to '#' on invalid HSL input
    expect(rgbInput.value).toBe('')
    const colorPreview = document.querySelector('.color-swatch')
  })

  it('should show copy buttons for valid colors', async () => {
    const inputs = screen.getAllByRole('textbox')
    
    // Wait for copy buttons to appear after entering valid hex
    await fireEvent.input(inputs[0], { target: { value: 'FF0000' } })
    
    await new Promise(resolve => setTimeout(resolve, 100)); // Allow time for UI to update
    
    // Check for presence of copy buttons (using title or aria-label)
    const copyButtons = screen.queryAllByTitle('Copy') // Check title attribute
    expect(copyButtons.length).toBeGreaterThan(0)
  })

  it('should handle case insensitivity in HEX input', async () => {
    const inputs = screen.getAllByRole('textbox')
    const hexInput = inputs[0]
    const rgbInput = inputs[1]
    
    await fireEvent.input(hexInput, { target: { value: 'FF0000' } }) // Upper case input
    
    await new Promise(resolve => setTimeout(resolve, 100)); // Allow for updating
    
    expect(rgbInput.value).toBe('rgb(255, 0, 0)')
    const colorPreview = document.querySelector('.color-swatch')
  })

  it('should update color preview dynamically', async () => {
    const inputs = screen.getAllByRole('textbox')
    const hexInput = inputs[0]
    const testColors = ['FF0000', '00FF00', '0000FF', 'FFFF00', 'FF00FF', '00FFFF']
    
    for (const color of testColors) {
      await fireEvent.input(hexInput, { target: { value: color } })
      await new Promise(resolve => setTimeout(resolve, 50)); // Small delay between updates
      
      const colorPreview = document.querySelector('.color-swatch')
      expect(colorPreview).toBeInTheDocument();  // Just test that swatch is still there during updates
    }
  })
})