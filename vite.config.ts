import {defineConfig} from 'vite'
import createVuePlugin from '@vitejs/plugin-vue';
import dynamicImport from 'vite-plugin-dynamic-import';
// import pluginResolve from 'vite-plugin-resolve';
import topLevelAwait from 'vite-plugin-top-level-await';
// @ts-ignore
const path = require('path');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    createVuePlugin(),
    dynamicImport(),
    // pluginResolve({}),
    topLevelAwait({
      // The export name of top-level await promise for each chunk module
      promiseExportName: '__tla',
      // The function to generate import names of top-level await promise in each chunk module
      promiseImportName: (i: any) => `__tla_${i}`
    })
  ],
  base: '/',
  resolve: {
    alias: [
      {
        // this is required for the SCSS modules
        // eslint-disable-next-line prefer-named-capture-group
        find: /^~(.*)$/,
        replacement: '$1'
      },
      {
        find: '@',
        replacement: path.join(__dirname, 'src')
      }
    ]
  },
  server: {
    port: 8080
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "./src/styles/variables.scss";'
      }
    }
  },
  build: {
    target: 'modules',
    chunkSizeWarningLimit: 600,
    cssCodeSplit: true
  }
})
