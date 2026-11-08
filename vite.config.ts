import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Where the PHP dev server lives (`php -S localhost:8000 -t php-api`).
  const phpTarget = env.PHP_API_TARGET || 'http://localhost:8000';

  return {
    plugins: [react()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    server: {
      // Proxying /api in dev means the browser sees a same-origin request,
      // so no CORS preflight is needed locally. In production the PHP API
      // must answer OPTIONS requests itself (see php-api/index.php).
      proxy: {
        '/api': { target: phpTarget, changeOrigin: true },
      },
    },
  };
});

