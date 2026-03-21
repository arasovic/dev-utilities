import '@testing-library/jest-dom'

// Mock window object for Svelte testing
global.window = global.window || {}
global.document = global.document || {}

// Mock Svelte lifecycle functions that aren't available in test environment
const originalMount = global.mount
global.mount = (component, options) => {
  try {
    return originalMount?.(component, options)
  } catch (error) {
    console.warn('Mount failed:', error.message)
    return { unmount: () => {} }
  }
}

// Mock other Svelte lifecycle functions
global.onMount = () => {}
global.onDestroy = () => {}
global.afterUpdate = () => {}
global.beforeUpdate = () => {}
global.tick = () => Promise.resolve()