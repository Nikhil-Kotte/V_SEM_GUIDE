# V SEM External Guide: design contract

Direction: **The desk in exam week.** The guide looks like the things a student has on the desk:
answer booklets, ruled paper, a blue ballpoint, the examiner's red pen, a yellow highlighter,
sticky notes, tape and rubber stamps. Every colour still has exactly one job, so a student can tell
what matters at a glance.

Looks come first, with three limits that never bend: text stays AA in both themes, everything
works from the keyboard, and `prefers-reduced-motion` turns the motion off.

## Colour (tokens live in `src/styles/tokens.css`)

| Role | Token | Light | Dark | Used for |
|---|---|---|---|---|
| Desk | `--bg` | `#F4F5F1` | `#171A22` | page ground (with grain and faint ruled lines) |
| Sheet | `--surface` | `#FFFFFF` | `#1E222C` | paper: cards, panels, inputs |
| Sheet 2 | `--surface-2` | `#ECEEE7` | `#272C38` | table heads, hover, idle cells, footer strip |
| Ink | `--text` | `#1A1E29` | `#E9EBF1` | body text |
| Ink soft | `--text-soft` / `--text-faint` | `#454B5A` / `#5C6271` | `#B9BECB` / `#9298A8` | secondary text (all AA) |
| Ballpoint | `--accent` | `#2340A6` | `#9DB1FF` | links, active tab, primary buttons, focus, handwritten labels |
| Red pen | `--hot` | `#B8322A` | `#FF8F80` | repeat counts, "most asked", stamps, warnings, page faults |
| Highlighter | `--highlight` | `#FFF0A3` | `#4A4220` | "In one line", search matches |
| Tick | `--ok` | `#276F44` | `#6FCB93` | done, hits, practised, safe |
| Margin rule | `--margin` | `#E7A39C` | `#5A3A3A` | the booklet margin on topic sheets |
| Sticky notes | `--sticky-yellow/green/blue/violet/rose/coral` | pastel | dimmed | callouts, to-do list, side notes |

Subjects keep their own pen colour (`--blue`, `--coral`, `--green`, `--gold`, `--violet`, `--rose`,
each with a `-tint`). They colour the subject's folder tab, booklet cover, cover art and page banner,
passed down as `--pen` / `--pen-tint`. Legacy names (`--ink`, `--cream`, `--coral-deep`, `--mint`,
`--yellow-tint`...) are kept as aliases because content files and the SVG diagrams reference them.

Gradients are allowed only as material: paper grain, ruled or graph lines, the sheen on a booklet
cover, hatched chart bars. No glow, no glass. Blur is used once, behind the search card.

## Type

- **Atkinson Hyperlegible Next** for all reading text and headings, **Atkinson Hyperlegible Mono**
  for code, reference strings and frame grids. It separates 0/O and 1/l/I, which matters for numericals.
- **Kalam** (`--font-hand`) is the handwriting. It is only for annotations: margin notes, unit and
  topic numbers, sticky-note titles, chart titles, section labels inside a topic. Never body text.
- Body 17px / 1.6, measure capped by `--measure`. Headings weight 800, tracking -0.02em.
- Numbers in tables, charts and sims use `tabular-nums`.
- Uppercase appears only on rubber stamps.

## Space, shape, depth

- Spacing: 4px base, `--sp-1`..`--sp-9` = 4, 8, 12, 16, 24, 32, 48, 64, 96.
- Paper has near-square corners: `--radius-paper` 4px. Controls keep `--radius-sm` 8px; `--pill`
  is for chips only.
- Paper casts a shadow: `--shadow-paper` at rest, `--shadow-lift` when picked up (hover).
  Dialogs use `--shadow-2`.
- Things on a desk are never perfectly straight: sheets and notes sit at 0.4 to 3 degrees and
  straighten on hover.

## Desk objects (`src/components/ink`, `src/styles/paper.css`)

| Object | Where |
|---|---|
| `.sheet` (+ `--ruled`, `--grid`, `--punched`), `.torn-b` | cards, the question paper, charts, the to-do list |
| `Tape`, `PaperClip`, `Staple` | holding sheets, diagrams and covers down |
| `Stamp` | "Most asked", "Done", "Coming soon" |
| `StickyNote` / `.callout` | tip (green), analogy (violet), exam (ruled index card), warn (red-pen box) |
| `Ring` | progress, everywhere |
| Pen strokes in `Ink.jsx` | `Underline`, `Circle` (the tally), `Arrow`, `Tick`, `Loop`, `Bracket`... |
| `#rough` filter (mounted by `Layout`) | wobbles stamps, pen boxes and cover art so they look hand-made |

Illustrations live in `src/components/art`: one pen-sketch cover per subject (`covers.jsx`), the
hero desk (`HeroDesk.jsx`) and margin doodles (`doodles.jsx`). They take their colour from
`currentColor` and `--art-tint`, so they follow the theme.

## Charts (`src/components/viz`)

Drawn in ink, built from the data already loaded, each one a way to navigate:
the unit heat map and "Do these next" list on Home, unit bars on a subject banner, topic frequency
bars and the paper dot line on PYQs. Red means asked often, green means done. Every chart has text
labels and an `aria-label` that says the same thing as the picture.

## Motion: "pen and paper"

- Strokes **draw** themselves on first view (`useDrawOn`: `pathLength` + dash offset).
- Paper **arrives**: sheets slide in with a small rotation, booklets are dealt, stamps thump.
  Springy easing (`--ease-spring`) for things that land; `--ease-out` for the rest.
- Booklet covers tilt toward the pointer (`lib/useTilt.js`).
- Durations: `--dur-1` 120ms feedback to `--dur-6` 1100ms for a long stroke.
- The home hero has a WebGL backdrop (`HeroInk.jsx`, ogl, lazy chunk): ink contour lines in pen
  blue with one red contour, highlighter under the pointer. It needs WebGL2, pauses off screen and
  in hidden tabs, and is skipped for reduced motion or data saver (`useFancyMotion`).
- Theme changes spread from the button as an ink circle (View Transitions, where supported).
- `prefers-reduced-motion`: nothing is hidden waiting for an animation, strokes are drawn already,
  tilts and parallax are off, the shader does not load.

## Signature detail

The **red-pen circle** around a PYQ's repeat count (`Tally`). It draws itself, and it carries the
most useful fact on the site: how many papers asked this question.

## Icons

`@hugeicons/react` + `@hugeicons/core-free-icons` only, stroke 1.8, sized in em. No emoji.

## Styles layout (`src/styles`, imported in order by `global.css`)

`tokens` → `base` → `paper` → `content` → `shell` → `home` → `subject` → `pyq` → `layout` → `sims` →
`desk` → `viz` → `print`. `content/subject/pyq/layout/sims` hold structure; `desk.css` holds the desk
look for those pages; `print.css` strips decoration for paper.
