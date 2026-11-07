// Copy chosen screenshots out of the lab records into public/lab/<subject>/<name>.webp.
//
//   node scripts/extract-lab-images.mjs
//
// The records' file names are swapped: SE_LAB.pdf holds the CN record and CN_LAB.pdf the SE record.
// `pick` names come from `pdfimages -p -png`: i-<page>-<image number>.png.
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const here = dirname(fileURLToPath(import.meta.url))
const LAB = join(here, '../../Lab')
const PUBLIC = join(here, '../public/lab')

const SETS = {
  cn: {
    pdf: 'SE_LAB.pdf',
    pick: {
      'i-001-001': 'ifconfig', 'i-002-003': 'ping', 'i-003-008': 'nslookup', 'i-004-010': 'netstat',
      'i-005-016': 'arp', 'i-008-024': 'uname',
      'i-009-027': 'p2p', 'i-010-031': 'p2p-pdu', 'i-011-033': 'bus', 'i-012-037': 'star', 'i-013-041': 'ring',
      'i-014-045': 'mesh', 'i-016-050': 'hybrid',
      'i-025-069': 'static-2router', 'i-026-074': 'static-2router-pdu', 'i-027-077': 'static-4router',
      'i-035-105': 'vlan-pdu-same', 'i-035-106': 'vlan-pdu-diff', 'i-035-107': 'vlan-ping',
      'i-040-118': 'ns3-star-netanim', 'i-046-135': 'ns3-saw-netanim', 'i-053-156': 'ns3-gbn-netanim',
      'i-056-167': 'rip-topology', 'i-059-181': 'ospf-route', 'i-060-183': 'rip-ping',
      'i-061-185': 'ws-tcp', 'i-062-188': 'ws-udp',
    },
  },
  se: {
    pdf: 'CN_LAB.pdf',
    pick: {
      'i-010-003': 'dfd-notation', 'i-011-004': 'marag-dfd0', 'i-012-005': 'marag-dfd1', 'i-013-006': 'marag-dfd2',
      'i-015-008': 'marag-usecase', 'i-024-035': 'marag-class', 'i-026-050': 'marag-activity',
      'i-032-071': 'marag-sequence', 'i-038-088': 'marag-state', 'i-045-102': 'marag-component',
      'i-049-116': 'marag-deployment', 'i-052-122': 'reverse-shape', 'i-053-125': 'reverse-employee',
    },
  },
}

for (const [subject, { pdf, pick }] of Object.entries(SETS)) {
  const tmp = mkdtempSync(join(tmpdir(), 'labimg-'))
  execFileSync('pdfimages', ['-p', '-png', join(LAB, pdf), join(tmp, 'i')])
  const out = join(PUBLIC, subject)
  mkdirSync(out, { recursive: true })
  for (const [src, name] of Object.entries(pick)) {
    const file = join(out, `${name}.webp`)
    const img = sharp(join(tmp, `${src}.png`)).flatten({ background: '#ffffff' })
    const { width } = await img.metadata()
    // Small screenshots are upscaled a little so text stays readable when shown full width.
    const target = width < 700 ? Math.round(width * 1.6) : Math.min(width, 1800)
    await img.resize({ width: target, kernel: 'lanczos3' }).webp({ quality: 90 }).toFile(file)
    console.log(`ok ${subject}/${name}.webp ${(statSync(file).size / 1024).toFixed(0)} KB`)
  }
  rmSync(tmp, { recursive: true, force: true })
}
