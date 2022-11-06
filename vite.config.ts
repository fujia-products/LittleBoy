import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import optimizer from 'vite-plugin-optimizer';

import { devPlugin, getReplacer } from './plugins/devPlugin';
import { buildPlugin } from './plugins/buildPlugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [optimizer(getReplacer()), devPlugin(), vue()],
  build: {
    /**
     * NOTE: if any file size is small enough, it'll be transferred to base64 string format,
     * and embedded to style file so that can reduce number of requests.
     *
     * To set the assetsInlineLimit property of value is 0 which can disabled the behavior.
     */
    assetsInlineLimit: 0,
    rollupOptions: {
      plugins: [buildPlugin()],
    },
  },
});
