import { writable } from 'svelte/store'

function createThemeStore() {
  const { subscribe, set, update } = writable('dark')

  return {
    subscribe,
    toggle: () => update(current => current === 'dark' ? 'light' : 'dark'),
    set: theme => set(theme)
  }
}

export const theme = createThemeStore()
