import { asset, rawUrl } from '../config.js'

// PDFs from Material/, PYQs/ and the exam time-table are copied into the site at build time
// (scripts/copy-files.mjs → dist/files/<same path>) and served by a dev-server plugin while
// developing, so they open on the site itself instead of on GitHub.
export const isPdf = (path) => /\.pdf$/i.test(path)

// Same-origin URL of a file shipped with the site.
export const fileUrl = (path) => asset(`files/${path.split('/').map(encodeURIComponent).join('/')}`)

// In-site viewer route for a PDF; other files still download from the repo.
export const viewerPath = (path, title) => `/view?f=${encodeURIComponent(path)}${title ? `&t=${encodeURIComponent(title)}` : ''}`

// Where to fetch a file from: the copy on the site for PDFs, the repo for everything else.
export const downloadUrl = (path) => (isPdf(path) ? fileUrl(path) : rawUrl(path))

export const TIMETABLE = 'BE-B.Tech-V-Semester-Main-R22A-November-2026.pdf'
