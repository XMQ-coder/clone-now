import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import pxToViewport from 'postcss-px-to-viewport'
// import autoprefixer from 'autoprefixer'

// https://vite.dev/config/
function linkParserPlugin() {
  return {
    name: 'link-parser',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/parse')) return next()
        try {
          const u = new URL(req.url, 'http://localhost')
          const target = u.searchParams.get('url')
          if (!target) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'missing url' }))
            return
          }
          const resp = await fetch(target, { redirect: 'follow' })
          const finalUrl = resp.url
          const html = await resp.text()
          let images = []
          let videos = []
          if (finalUrl.includes('douyin.com')) {
            const m =
              finalUrl.match(/video\/(\d+)/) ||
              finalUrl.match(/item\/(\d+)/) ||
              html.match(/aweme_id[\"']?:[\"']?(\d+)/) ||
              html.match(/itemId[\"']?:[\"']?(\d+)/)
            const awemeId = m && m[1]
            if (awemeId) {
              const apiResp = await fetch(`https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids=${awemeId}`)
              if (apiResp.ok) {
                const data = await apiResp.json()
                const item = data?.item_list?.[0]
                const urlList = item?.video?.play_addr?.url_list || []
                videos = Array.isArray(urlList) ? urlList : []
                const imgInfos = item?.images || item?.image_infos || []
                images = Array.isArray(imgInfos)
                  ? imgInfos
                    .map((i) => (Array.isArray(i?.url_list) ? i.url_list[0] : i?.url))
                    .filter(Boolean)
                  : []
              }
            }
          } else if (finalUrl.includes('xiaohongshu.com')) {
            const noteIdMatch = finalUrl.match(/explore\/([0-9a-zA-Z]+)/)
            const noteId = noteIdMatch && noteIdMatch[1]
            if (noteId) {
              const apiResp = await fetch(`https://www.xiaohongshu.com/fe_api/burdock/weixin/v2/page_data/notes/${noteId}`)
              if (apiResp.ok) {
                const json = await apiResp.json()
                const note = json?.data?.note
                const imgs = note?.imageList || note?.images || note?.image_list || []
                images = Array.isArray(imgs)
                  ? imgs
                    .map((img) => img?.url || img?.url_default || img?.url_size_large || img?.original || img?.src)
                    .filter(Boolean)
                  : []
                const video = note?.video || note?.videoInfo || note?.video_info
                const sources =
                  (video?.media && Array.isArray(video.media) ? video.media.map((m) => m?.url).filter(Boolean) : []) ||
                  [video?.url, video?.playUrl, video?.h264?.url, video?.h265?.url].filter(Boolean)
                videos = sources
              }
            }
          }
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ finalUrl, images, videos }))
        } catch (e) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'parse_failed' }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [vue(), linkParserPlugin()],
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
