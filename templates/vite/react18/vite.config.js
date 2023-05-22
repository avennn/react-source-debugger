import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sourcemaps from 'rollup-plugin-sourcemaps'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), sourcemaps()],
  resolve: {
    alias: {
      'react/jsx-dev-runtime': '$0',
      'react/jsx-runtime': '$1',
      'react-dom/client': '$2',
      'react-dom': '$3',
      react: '$4',
    }
  },
})
