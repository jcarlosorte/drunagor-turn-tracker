import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/drunagor-turn-tracker/', // importante para que funcione bien el enrutamiento relativo en local
})
