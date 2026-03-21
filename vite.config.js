import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'

export default defineConfig({
  base: '/dev-utilities/',
  plugins: [svelte()],
  resolve: {
    alias: {
      $lib: path.resolve(__dirname, './src/lib')
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    include: ['src/**/*.{test,spec}.{js,ts}', 'tests/**/*.{test,spec}.{js,ts}'],
    svelte: {
      compilerOptions: {
        accessors: false,
        immutable: false,
        legacy: false,
        namespace: false,
        customElement: false,
        hydratable: false,
        emitCss: false,
        store: 'auto',
        strict: false
      }
    }
  }
})