import ckeditor5 from '@ckeditor/vite-plugin-ckeditor5';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import vitePluginImp from 'vite-plugin-imp';
import tsconfigPaths from 'vite-tsconfig-paths';
import { Colors } from './src/styles/colors';

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    vitePluginImp({
      optimize: true,
      libList: [
        {
          libName: 'antd',
          libDirectory: 'es',
          style: (name) => `antd/es/${name}/style`,
        },
      ],
    }),
    ckeditor5({ theme: require.resolve('@ckeditor/ckeditor5-theme-lark') }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          '@primary-color': Colors.AzulSerap,
          '@font-family': 'Roboto',
          '@font-size-base': '12px',
          '@btn-border-radius-base': '3px',
        },
      },
    },
  },
  optimizeDeps: {
    include: ['ckeditor5'],
  },
  build: {
    chunkSizeWarningLimit: 1600,
    outDir: 'build',
    commonjsOptions: {
      include: [/ckeditor5/, /node_modules/],
    },
  },
  server: {
    host: 'localhost',
    port: 3000,
  },
});
