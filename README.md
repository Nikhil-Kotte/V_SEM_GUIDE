# V SEM EXTERNAL GUIDE

An interactive, plain-language study guide for the V Semester (CSE) external exams, covering all five units of:
Software Engineering, Operating Systems, Computer Networks, Fundamentals of Data Science,
Big Data Analytics and Principles of Design Thinking. DRRM is marked "coming soon".

**Live site:** https://nikhil-kotte.github.io/V_SEM_GUIDE/

Each subject has five tabs:

- **Learn**: every syllabus topic with notes, diagrams, exam tips and links to YouTube lectures. Computer Networks has one set of detailed notes per topic (formal definitions, full explanations, worked examples and diagrams); the other subjects still have a simple-words section followed by detailed notes
- **PYQs** — questions from this semester's class tests (mid-terms) first, then past questions ranked by how many papers asked them, then by how recently; model answers for the most important ones; and every question paper (past papers, mid-term papers, unit-wise banks) to read on the site
- **2-mark bank** (Computer Networks) — about 15 short questions per unit with full-mark answers, class-test questions first
- **Numericals** — interactive tools (page replacement, disk scheduling, Banker's, COCOMO, function points, cyclomatic complexity, CIDR, TCP congestion window, regression metrics, k-means)
- **Quick revision** — every topic in one line
- **Downloads** — the original material and question papers from this repo. PDFs open in the site's own viewer; slides and Word files open on GitHub

## Repo layout

| Path | What |
|---|---|
| `Material/` | Course slides, notes and textbooks per subject |
| `PYQs/` | Past papers by year, mid-term papers (`<SUBJECT> MIDS.pdf`) and compiled unit-wise banks |
| `BE-B.Tech-V-Semester-Main-R22A-November-2026.pdf` | The exam time-table; the dates are in `guide/src/content/subjects.js` |
| `guide/` | The website (Vite + React) |

## Working on the guide

```bash
cd guide
npm install
npm run dev            # local site at http://localhost:5173/V_SEM_GUIDE/
npm test               # simulator unit tests
npm run check          # content gate: syllabus ids, paper refs, sources, diagrams
npm run build          # also copies every PDF into dist/files for the in-site viewer
```

- Syllabus allowlist: `guide/src/content/syllabus.js` (only these topics are in scope).
- Past papers registry: `guide/src/content/papers.js`. Class tests are papers with relation `'mid'` (e.g. `cn-ct1`, `cn-ct2`); any question asked in one ranks first. CN class-test questions: `cn/pyqs-mid.js`, answers `cn/answers-mid.js`; 2-mark bank: `cn/bank-2m.js` (a bank answer also becomes the model answer of the PYQ it links to with `from`). PYQs per subject: `guide/src/content/<subject>/pyqs.js` (repeat counts are computed from the papers listed, never typed in).
- Notes and model answers: `guide/src/content/<subject>/topics*.js` and `answers-*.js`; for Computer Networks, `cn/notes-u1.js` … `notes-u5.js` (one detailed set per topic, with `{ def }` definition cards and hand-drawn diagrams from `guide/src/components/svg/cn.jsx`). Simple words, for the other subjects: `simple.js` (written by hand; each has a summary, a picture, points, an analogy and an example).
- PDF viewer: `#/view?f=<path>` shows any PDF from `Material/`, `PYQs/` or the time-table. `scripts/copy-files.mjs` puts them in the build, the dev server serves them directly, and PDF.js 4.10.38 is loaded from jsDelivr the first time a PDF is opened.
- Videos: `node scripts/find-videos.mjs <subject>` fills `<subject>/videos.js` from real YouTube search results (relevance first; a topic with no good match gets none). Remove a bad pick with `node scripts/prune-videos.mjs <subject> <topic id>`. Sudhakar Atchala's lectures take priority: `node scripts/find-videos.mjs <subject> --prefer "Sudhakar Atchala"` switches every topic he covers to his videos only, and leaves the others as they are.
- Diagrams: add an entry to `guide/scripts/diagrams.manifest.json`, run `npm run diagrams`, look at it, then set `"verified": true`.
- After adding files to `Material/` or `PYQs/`, run `npm run materials`. After pushing, `npm run check-downloads` verifies every download link.

Pushing to `main` deploys the site with GitHub Actions (`.github/workflows/pages.yml`).
