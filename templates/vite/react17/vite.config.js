import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sourcemaps from 'rollup-plugin-sourcemaps'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), sourcemaps()],
  resolve: {
    alias: {
      'react/jsx-dev-runtime': '$0',
      'react-dom/client': '$1',
      'react-dom': '$2',
      react: '$3',
    }
  },
})
