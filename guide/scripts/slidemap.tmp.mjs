import AdmZip from 'adm-zip'
const [src, from, to] = process.argv.slice(2)
const z = new AdmZip(src)
const pres = z.readAsText('ppt/presentation.xml'), pr = z.readAsText('ppt/_rels/presentation.xml.rels')
const ids = [...pres.matchAll(/<p:sldId [^>]*r:id="([^"]+)"/g)].map(m => m[1])
for (let n = +from; n <= Math.min(+to, ids.length); n++) {
  const t = pr.match(new RegExp(`Id="${ids[n-1]}"[^>]*Target="([^"]+)"`))?.[1] || pr.match(new RegExp(`Target="([^"]+)"[^>]*Id="${ids[n-1]}"`))?.[1]
  const sp = 'ppt/' + t.replace(/^\/?ppt\//, '')
  const x = z.readAsText(sp), rels = z.readAsText(sp.replace(/slides\/(slide\d+\.xml)$/, 'slides/_rels/$1.rels'))
  const map = Object.fromEntries([...rels.matchAll(/<Relationship ([^>]+)\/>/g)].map(m => [m[1].match(/Id="([^"]+)"/)[1], m[1].match(/Target="([^"]+)"/)[1]]))
  const imgs = [...x.matchAll(/r:embed="([^"]+)"/g)].map(m => map[m[1]].split('/').pop())
  const title = (x.match(/<a:t>([^<]{3,60})<\/a:t>/) || [])[1] || ''
  if (imgs.length) console.log(n, imgs.join(','), '|', title)
}
