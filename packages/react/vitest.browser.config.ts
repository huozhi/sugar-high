import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: { include: ['src/**/*.browser.tsx'] },
})
