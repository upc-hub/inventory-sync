import { defineConfig, loadEnv } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Fix: Cast process to any to resolve TS error 'Property cwd does not exist on type Process'
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    define: {
      // This ensures process.env.API_KEY works in your existing code
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})