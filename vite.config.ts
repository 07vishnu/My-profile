
import { defineConfig } from 'vite';

declare var process: { env: { [key: string]: string | undefined } };

export default defineConfig({
  // Since our files are in the root, we don't need a complex root config,
  // but we must ensure process.env is handled.
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
