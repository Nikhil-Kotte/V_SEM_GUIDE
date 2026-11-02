// Pulls figures out of the course material into public/diagrams/<subject>/<id>.webp
// and writes src/content/diagrams.json.
//
//   node scripts/extract-diagrams.mjs                 extract everything in the manifest
//   node scripts/extract-diagrams.mjs --sheet os      contact sheet of a subject's diagrams (for checking them)
//   node scripts/extract-diagrams.mjs --slide "<pptx>" 70   list the images on one slide
//   node scripts/extract-diagrams.mjs --page "<pdf>" 72     render one PDF page to look at
//
// pptx/docx media are resolved through the slide's .rels file (slide numbers follow presentation order),
// never by guessing from image numbers. EMF/WMF are skipped — those topics get hand-drawn SVGs instead.
import { mkdirSync, readFileSync, writeFileSync, existsSync, rmSync, readdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { join, extname } from 'node:path'
import { tmpdir } from 'node:os'
import AdmZip from 'adm-zip'
import sharp from 'sharp'

const here = (p) => fileURLToPath(new URL(p, import.meta.url))
const ROOT = here('../../')
const PUBLIC = here('../public/diagrams/')
const OUT_JSON = here('../src/content/diagrams.json')
const MANIFEST = here('./diagrams.manifest.json')
const TMP = join(tmpdir(), 'mid2-diagrams')
const HIRES = here('./.hires/')
const RASTER = new Set(['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tif', '.tiff', '.webp'])

const zips = {}
const zip = (src) => (zips[src] ||= new AdmZip(join(ROOT, src)))

// Slide N (1-based, presentation order) -> its image media paths, in order of appearance.
function slideImages(src, n) {
  const z = zip(src)
  const pres = z.readAsText('ppt/presentation.xml')
  const presRels = z.readAsText('ppt/_rels/presentation.xml.rels')
  const ids = [...pres.matchAll(/<p:sldId [^>]*r:id="([^"]+)"/g)].map((m) => m[1])
  const rid = ids[n - 1]
  if (!rid) throw new Error(`${src}: no slide ${n} (has ${ids.length})`)
  const target = presRels.match(new RegExp(`Id="${rid}"[^>]*Target="([^"]+)"`))?.[1] ||
    presRels.match(new RegExp(`Target="([^"]+)"[^>]*Id="${rid}"`))?.[1]
  const slidePath = 'ppt/' + target.replace(/^\/?ppt\//, '')
  const slideXml = z.readAsText(slidePath)
  const relsPath = slidePath.replace(/slides\/(slide\d+\.xml)$/, 'slides/_rels/$1.rels')
  const rels = z.readAsText(relsPath)
  const relMap = Object.fromEntries([...rels.matchAll(/<Relationship ([^>]+)\/>/g)].map((m) => {
    const id = m[1].match(/Id="([^"]+)"/)[1]
    const t = m[1].match(/Target="([^"]+)"/)[1]
    return [id, t]
  }))
  const embeds = [...slideXml.matchAll(/r:embed="([^"]+)"/g)].map((m) => m[1])
  return embeds.map((id) => 'ppt/' + relMap[id].replace(/^\.\.\//, '')).filter(Boolean)
}

// Readability first: small slide images are upscaled with Lanczos (sharper than the browser's
// own scaling when they're shown large), big ones are capped, and quality is kept high.
async function toWebp(buffer, outFile) {
  const img = sharp(buffer, { animated: false }).flatten({ background: '#ffffff' })
  const { width } = await img.metadata()
  const target = width < 900 ? Math.min(Math.round(width * 1.8), 1300) : Math.min(width, 1800)
  const info = await img.resize({ width: target, kernel: 'lanczos3' }).sharpen({ sigma: 0.6 })
    .webp({ quality: 92, smartSubsample: true }).toFile(outFile)
  return { w: info.width, h: info.height }
}

// index: nth extracted image, or "WxH" to pick the image with exactly those pixel dimensions
// (some PDFs store each figure several times with soft masks, so indexes are unreliable).
async function pdfImage(src, page, index) {
  rmSync(TMP, { recursive: true, force: true })
  mkdirSync(TMP, { recursive: true })
  execFileSync('pdfimages', ['-f', String(page), '-l', String(page), '-png', join(ROOT, src), join(TMP, 'img')])
  const files = readdirSync(TMP).filter((f) => f.endsWith('.png')).sort()
  if (typeof index === 'string') {
    // A figure may appear as [blank placeholder, real RGB image, grey soft mask]: take the biggest
    // RGB file of that size, and if a grey mask of the same size exists, use it as the alpha channel.
    const [w, h] = index.split('x').map(Number)
    const same = []
    for (const f of files) {
      const buf = readFileSync(join(TMP, f))
      const meta = await sharp(buf).metadata()
      if (meta.width === w && meta.height === h) same.push({ buf, channels: meta.channels })
    }
    const color = same.filter((x) => x.channels >= 3).sort((a, b) => b.buf.length - a.buf.length)[0]
    const mask = same.find((x) => x.channels < 3)
    if (color && mask) {
      // In these PDFs the drawing lives in the soft mask (ink = 0) and the colour layer is just a fill,
      // so the inverted mask on its own is the clean black-on-white figure.
      return sharp(mask.buf).extractChannel(0).negate().png().toBuffer()
    }
    if (color || mask) return (color || mask).buf
    throw new Error(`${src} p${page}: no ${index} image`)
  }
  if (!files[index]) throw new Error(`${src} p${page}: no image #${index} (found ${files.length})`)
  return readFileSync(join(TMP, files[index]))
}

function pdfPage(src, page, crop, dpi = 150) {
  rmSync(TMP, { recursive: true, force: true })
  mkdirSync(TMP, { recursive: true })
  const args = ['-r', String(dpi), '-f', String(page), '-l', String(page), '-png']
  if (crop) args.push('-x', String(crop.x), '-y', String(crop.y), '-W', String(crop.w), '-H', String(crop.h))
  args.push(join(ROOT, src), join(TMP, 'page'))
  execFileSync('pdftoppm', args)
  const f = readdirSync(TMP).find((x) => x.endsWith('.png'))
  return readFileSync(join(TMP, f))
}

async function extractOne(d) {
  let buffer
  if (d.slide) {
    const imgs = slideImages(d.src, d.slide)
    const media = imgs[d.pick || 0]
    if (!media) throw new Error(`${d.id}: slide ${d.slide} has ${imgs.length} images`)
    if (!RASTER.has(extname(media).toLowerCase())) throw new Error(`${d.id}: ${media} is not a raster image (EMF/WMF) — draw an SVG instead`)
    buffer = zip(d.src).readFile(media)
  } else if (d.media) {
    buffer = zip(d.src).readFile(d.media)
    if (!buffer) throw new Error(`${d.id}: ${d.media} not found in ${d.src}`)
  } else if (d.page && existsSync(join(HIRES, `${d.id}.png`))) {
    // High-resolution page render from scripts/pdf_hires.py (crisp text, correct colours).
    buffer = readFileSync(join(HIRES, `${d.id}.png`))
  } else if (d.page && d.pdfimage != null) {
    buffer = await pdfImage(d.src, d.page, d.pdfimage)
  } else if (d.page) {
    buffer = pdfPage(d.src, d.page, d.crop, d.dpi)
  } else throw new Error(`${d.id}: no slide/media/page`)
  if (d.trim) buffer = await sharp(buffer).trim().toBuffer()
  mkdirSync(join(PUBLIC, d.subject), { recursive: true })
  const size = await toWebp(buffer, join(PUBLIC, d.subject, `${d.id}.webp`))
  return { file: `diagrams/${d.subject}/${d.id}.webp`, caption: d.caption, alt: d.alt, credit: d.credit, syllabusId: d.syllabusId, verified: !!d.verified, ...size }
}

async function contactSheet(subject) {
  const out = JSON.parse(readFileSync(OUT_JSON, 'utf8'))
  const all = Object.entries(out).filter(([, d]) => d.file.includes(`/${subject}/`))
  for (let p = 0; p * 12 < all.length; p++) await sheetPage(subject, all.slice(p * 12, p * 12 + 12), p + 1, p * 12)
}

async function sheetPage(subject, list, page, offset) {
  const cell = 420
  const cols = 3
  const tiles = await Promise.all(list.map(async ([id, d], j) => {
    const i = j
    const n = offset + j
    const img = await sharp(join(here('../public/'), d.file)).resize(cell - 20, cell - 60, { fit: 'inside', background: '#fff' }).toBuffer()
    const label = Buffer.from(`<svg width="${cell}" height="40"><rect width="100%" height="100%" fill="#182d2a"/><text x="10" y="26" font-size="17" font-family="Arial" fill="#faf7ee">${n + 1}. ${id}</text></svg>`)
    return [{ input: label, left: (i % cols) * cell, top: Math.floor(i / cols) * cell }, { input: img, left: (i % cols) * cell + 10, top: Math.floor(i / cols) * cell + 48 }]
  }))
  const rows = Math.ceil(list.length / cols)
  const file = join(process.env.SHEET_DIR || TMP, `sheet-${subject}-${page}.png`)
  await sharp({ create: { width: cols * cell, height: rows * cell, channels: 3, background: '#ffffff' } }).composite(tiles.flat()).png().toFile(file)
  console.log(file)
}

const args = process.argv.slice(2)
if (args[0] === '--sheet') {
  await contactSheet(args[1])
} else if (args[0] === '--slide') {
  console.log(slideImages(args[1], Number(args[2])))
} else if (args[0] === '--page') {
  const file = join(process.env.SHEET_DIR || TMP, `page-${Number(args[2])}.png`)
  writeFileSync(file, await sharp(pdfPage(args[1], Number(args[2]), null, 70)).png().toBuffer())
  console.log(file)
} else {
  const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'))
  const only = args.length ? new Set(args) : null
  const out = existsSync(OUT_JSON) ? JSON.parse(readFileSync(OUT_JSON, 'utf8')) : {}
  for (const d of manifest) {
    if (only && !only.has(d.subject) && !only.has(d.id)) continue
    try {
      out[d.id] = await extractOne(d)
      console.log('ok  ', d.id, `${out[d.id].w}x${out[d.id].h}`)
    } catch (e) {
      console.error('FAIL', d.id, e.message)
      delete out[d.id]
    }
  }
  // Drop entries no longer in the manifest.
  const ids = new Set(manifest.map((d) => d.id))
  for (const id of Object.keys(out)) if (!ids.has(id)) delete out[id]
  writeFileSync(OUT_JSON, JSON.stringify(out, null, 1))
}
