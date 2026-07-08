import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import localCms from './vite-plugin-local-cms'

// https://vite.dev/config/
export default defineConfig({
  base: "/portfolio",
  plugins: [react(), localCms()],
  css: {
    modules: {
      localsConvention: "camelCase",
    }
  },

})


