import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import type { UserConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    // HTTPS configuration (commented out for HTTP)
    // https: {
    //   key: fs.readFileSync('./docker/config/localhost-key.pem'),
    //   cert: fs.readFileSync('./docker/config/localhost.pem')
    // },
    proxy: {
      '/graphql': {
        target: 'http://localhost:9094',
        changeOrigin: true,
        secure: false
      },
      '/transcribe': {
        target: 'http://localhost:9099',
        changeOrigin: true,
        secure: false,
      }
    }
  }
} as UserConfig);
