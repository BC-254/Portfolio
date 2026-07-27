import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import prerender from '@prerenderer/rollup-plugin'

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    prerender({
      routes: [
        '/',
        '/about',
        '/sherialens',
        '/actuarial',
      ],
      renderer: '@prerenderer/renderer-puppeteer',
      rendererOptions: {
        renderAfterTime: 3000, //3 seconds before taking snapshot
      }
    })],
  server: {
    allowedHosts: true,
  },
})

