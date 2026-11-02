# V Sem Mid-2 Study Guide

An interactive, plain-language study guide for the V Semester (CSE) Mid-2 exams:
Software Engineering, Operating Systems, Computer Networks, Fundamentals of Data Science,
Big Data Analytics and Principles of Design Thinking. DRRM is marked "coming soon".

**Live site:** https://nikhil-kotte.github.io/V_SEM_GUIDE/

Each subject has five tabs:

- **Learn** — every Mid-2 syllabus topic explained simply, with diagrams from the course notes and exam tips
- **PYQs** — past questions ranked by how many papers asked them, then by how recently; model answers for the most important ones
- **Numericals** — interactive tools (page replacement, disk scheduling, Banker's, COCOMO, function points, cyclomatic complexity, CIDR, TCP congestion window, regression metrics, k-means)
- **Quick revision** — every topic in one line
- **Downloads** — the original material and question papers from this repo

## Repo layout

| Path | What |
|---|---|
| `Material/` | Course slides, notes and textbooks per subject |
| `PYQs/` | Past papers by year, plus compiled unit-wise banks |
| `guide/` | The website (Vite + React) |

## Working on the guide

```bash
cd guide
npm install
npm run dev            # local site at http://localhost:5173/V_SEM_GUIDE/
npm test               # simulator unit tests
npm run check          # content gate: syllabus ids, paper refs, sources, diagrams
npm run build
```

- Syllabus allowlist: `guide/src/content/syllabus.js` (only these topics are in scope).
- Past papers registry: `guide/src/content/papers.js`. PYQs per subject: `guide/src/content/<subject>/pyqs.js` (repeat counts are computed from the papers listed, never typed in).
- Notes and model answers: `guide/src/content/<subject>/topics.js` and `answers.js`.
- Diagrams: add an entry to `guide/scripts/diagrams.manifest.json`, run `npm run diagrams`, look at it, then set `"verified": true`.
- After adding files to `Material/` or `PYQs/`, run `npm run materials`. After pushing, `npm run check-downloads` verifies every download link.

Pushing to `main` deploys the site with GitHub Actions (`.github/workflows/pages.yml`).
