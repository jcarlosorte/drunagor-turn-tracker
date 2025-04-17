import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'; // 👈 Importa 'path'

export default defineConfig({
  plugins: [react()],
  base: '/drunagor-turn-tracker/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 👈 Alias para que "@" apunte a "src"
    },
  },
});
