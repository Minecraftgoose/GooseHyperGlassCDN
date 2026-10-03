// Build for static hosting: bundle the CDN file, then sync it into docs/.
// 静态托管构建：先 esbuild 打包，再把产物同步到 docs/（Pages 的发布目录）。
//
// 用法 / Usage:
//   npm install && npm run build:site
//
// 这是 Cloudflare Pages / GitHub Pages 构建命令要跑的入口；
// 单独只想要根目录的 liquid-glass.js 时，跑 `npm run build` 即可。
import { spawnSync } from 'node:child_process'
import { copyFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const bundle = path.join(__dirname, 'liquid-glass.js')
const target = path.join(__dirname, 'docs', 'liquid-glass.js')

const result = spawnSync(process.execPath, [path.join(__dirname, 'build.mjs')], {
  stdio: 'inherit',
  cwd: __dirname,
})
if (result.status !== 0) {
  console.error('build.mjs failed')
  process.exit(result.status ?? 1)
}

copyFileSync(bundle, target)
console.log(`synced docs/liquid-glass.js (${(statSync(target).size / 1024).toFixed(1)}kb)`)
