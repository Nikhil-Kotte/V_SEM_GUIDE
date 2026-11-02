// Downloads link straight to the files in the GitHub repo, so the site never duplicates 280 MB of PDFs.
export const REPO = 'https://github.com/Nikhil-Kotte/V_SEM_GUIDE'
export const REPO_RAW = `${REPO}/raw/main/`
export const REPO_BLOB = `${REPO}/blob/main/`

// Encode each path segment separately — filenames contain spaces, double spaces and parentheses.
const encodePath = (path) => path.split('/').map(encodeURIComponent).join('/')

export const rawUrl = (path) => REPO_RAW + encodePath(path)
export const viewUrl = (path) => REPO_BLOB + encodePath(path)

// Files under /public, resolved against the Vite base path.
export const asset = (path) => import.meta.env.BASE_URL + path.replace(/^\//, '')
