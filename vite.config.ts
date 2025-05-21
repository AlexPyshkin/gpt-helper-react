import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
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
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        }
      }
    }
  }
} as UserConfig);
