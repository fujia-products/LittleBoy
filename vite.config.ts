import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import optimizer from 'vite-plugin-optimizer';

import { devPlugin, getReplacer } from './plugins/devPlugin';
import { buildPlugin } from './plugins/buildPlugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [optimizer(getReplacer()), devPlugin(), vue()],
  build: {
    rollupOptions: {
      plugins: [buildPlugin()],
    },
  },
});
