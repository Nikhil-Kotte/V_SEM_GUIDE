import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)))

// While developing, serve PDFs from Material/, PYQs/ and the repo root at /V_SEM_GUIDE/files/…,
// the same URLs scripts/copy-files.mjs creates in the build. Supports Range requests so PDF.js
// can stream large files.
function repoFiles() {
  return {
    name: 'repo-files',
    configureServer(server) {
      server.middlewares.use('/V_SEM_GUIDE/files/', (req, res, next) => {
        const rel = decodeURIComponent((req.url || '').split('?')[0]).replace(/^\/+/, '')
        const file = resolve(ROOT, rel)
        if (!file.startsWith(ROOT + sep) || !/\.pdf$/i.test(file) || !existsSync(file)) return next()
        const size = statSync(file).size
        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Accept-Ranges', 'bytes')
        const range = /bytes=(\d*)-(\d*)/.exec(req.headers.range || '')
        if (range) {
          const start = range[1] ? Number(range[1]) : 0
          const end = range[2] ? Math.min(Number(range[2]), size - 1) : size - 1
          res.statusCode = 206
          res.setHeader('Content-Range', `bytes ${start}-${end}/${size}`)
          res.setHeader('Content-Length', end - start + 1)
          createReadStream(file, { start, end }).pipe(res)
          return
        }
        res.setHeader('Content-Length', size)
        createReadStream(file).pipe(res)
      })
    },
  }
}

// Served from https://nikhil-kotte.github.io/V_SEM_GUIDE/ — every asset URL must respect this base.
export default defineConfig({
  base: '/V_SEM_GUIDE/',
  plugins: [react(), repoFiles()],
  // vmThreads: on Node 22.23.5 the default worker pool fails to load vitest itself ("reading 'config'").
  test: { environment: 'node', pool: 'vmThreads' },
})
