import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import vitePluginImp from 'vite-plugin-imp';
import { Colors } from './src/styles/colors';

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
  build: {
    chunkSizeWarningLimit: 1600,
    outDir: 'build',
  },
});
