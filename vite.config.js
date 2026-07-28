import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import prerender from '@prerenderer/rollup-plugin'

const plugins = [react(), tailwindcss()]

if (process.env.PRERENDER === 'true') {
  plugins.push(
    prerender({
      routes: ['/', '/about', '/sherialens', '/actuarial'],
      renderer: '@prerenderer/renderer-puppeteer',
      rendererOptions: {
        renderAfterTime: 3000,
      },
    })
  )
}

export default defineConfig({
  plugins,
  server: {
    allowedHosts: true,
  },
})

