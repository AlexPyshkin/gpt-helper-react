import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // host: 'localhost',
    // https: {
    //   key: fs.readFileSync('./docker/config/localhost-key.pem'),
    //   cert: fs.readFileSync('./docker/config/localhost.pem')
    // },
    proxy: {
      '/graphql': {
        target: 'http://localhost:9094',
        changeOrigin: true
      }
    }
  }
});
