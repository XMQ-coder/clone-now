import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import pxToViewport from 'postcss-px-to-viewport'
// import autoprefixer from 'autoprefixer'

// https://vite.dev/config/


export default defineConfig({
  plugins: [vue(),],
  base: '/clone-now/',
  server: {
    host: true,
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    modules: {},
    postcss: {
      plugins: [
        pxToViewport({
          unitToConvert: 'px',
          viewportWidth: 375,
          unitPrecision: 5,
          propList: ['*'],
          viewportUnit: 'vw',
          fontViewportUnit: 'vw',
          selectorBlackList: [],
          minPixelValue: 0.5,
          mediaQuery: false,
          replace: true,
          exclude: undefined,
          include: undefined,
        }),
        // autoprefixer({
        //   overrideBrowserslist: ['> 1%', 'last 2 versions', 'not dead', 'IE 11']
        // })
      ],
    },
  },
})
