// Layout audit run through the Playwright MCP (browser_run_code). Checks every route at phone, tablet
// and desktop widths for horizontal overflow, clipped text and broken/cropped/tiny diagrams.
async (page) => {
  // Layout audit: for each route × viewport, report horizontal overflow, clipped text, and image problems.
  const base = 'http://localhost:5173/V_SEM_GUIDE/#'
  const subjects = ['se', 'os', 'cn', 'fds', 'bda', 'pdt']
  const tabs = ['learn', 'pyqs', 'numericals', 'revision', 'downloads']
  const routes = ['/', '/drrm', ...subjects.flatMap((s) => tabs.map((t) => `/s/${s}/${t}`))]
  const viewports = [[390, 844], [820, 1180], [1440, 900], [2000, 1000]]
  const report = []
  for (const [w, h] of viewports) {
    await page.setViewportSize({ width: w, height: h })
    for (const r of routes) {
      await page.goto(base + r)
      await page.waitForTimeout(r.includes('learn') || r.includes('numericals') ? 1800 : 900)
      // Open every PYQ answer on PYQ pages so long answers are checked too.
      if (r.endsWith('/pyqs')) {
        await page.evaluate(() => document.querySelectorAll('.pyq-actions .btn-ink').forEach((b) => b.click()))
        await page.waitForTimeout(600)
      }
      const res = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth
        const out = { pageOverflow: document.documentElement.scrollWidth - vw, offscreen: [], clipped: [], images: [] }
        const allowedScroll = (el) => el.closest('.table-wrap, .grid-scroll, .tabs, pre, .search-results, .outline, .glide-select__menu, .pill-nav, .header-nav, .hero-bg, .band-bg, .formula, .svg-wrap, .lightbox')
        for (const el of document.querySelectorAll('main *, .site-header *, .hero *, .band *, .site-footer *, section *')) {
          const rect = el.getBoundingClientRect()
          if (!rect.width || rect.width <= 2 || allowedScroll(el) || /sr-only|status-mark__sr/.test(String(el.className))) continue
          if (rect.right > vw + 1 && out.offscreen.length < 8) out.offscreen.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} right=${Math.round(rect.right)}`)
          const cs = getComputedStyle(el)
          if ((cs.overflowX === 'hidden' || cs.overflowX === 'clip' || cs.textOverflow === 'ellipsis') && el.scrollWidth > el.clientWidth + 2 && el.textContent.trim() && out.clipped.length < 8) {
            out.clipped.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} "${el.textContent.trim().slice(0, 40)}" ${el.scrollWidth}>${el.clientWidth}`)
          }
        }
        for (const img of document.querySelectorAll('figure.diagram img')) {
          const fig = img.closest('figure').getBoundingClientRect()
          const r = img.getBoundingClientRect()
          if (img.complete && img.naturalWidth === 0) out.images.push(`broken ${img.src.split('/').pop()}`)
          else if (r.right > fig.right + 1 || r.left < fig.left - 1) out.images.push(`cropped ${img.src.split('/').pop()} img ${Math.round(r.width)} fig ${Math.round(fig.width)}`)
          else if (img.naturalWidth && r.width > 0 && r.width < 200 && fig.width > 300) out.images.push(`tiny ${img.src.split('/').pop()} shown ${Math.round(r.width)}px`)
        }
        return out
      })
      const bad = res.pageOverflow > 0 || res.offscreen.length || res.clipped.length || res.images.length
      if (bad) report.push({ vp: `${w}`, route: r, ...res })
    }
  }
  return report.length ? report : 'ALL CLEAR'
}
