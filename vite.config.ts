import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import type { UserConfig } from 'vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file from docker directory
  const env = loadEnv(mode, path.resolve(__dirname, 'docker'), '');
  
  return {
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
    },
    // Make env variables available to the client
    define: {
      'import.meta.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify(env.VITE_GOOGLE_CLIENT_ID)
    }
  } as UserConfig;
});
