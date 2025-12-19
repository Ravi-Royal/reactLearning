import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/reactLearning/',
  plugins: [
    tailwindcss(),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    proxy: {
      // Any request starting with /yahooFinance will be forwarded to Yahoo
      '/yahooFinance': {
        target: 'https://query1.finance.yahoo.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/yahooFinance/, ''),
      },
    },
  },
})
