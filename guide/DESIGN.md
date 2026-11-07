# V-SEM Mid-2 guide: design contract

Direction: **Answer booklet.** The guide borrows from the things a student already has on the desk
during exam week: ruled booklet paper, a blue ballpoint, the examiner's red pen and a yellow
highlighter. Every colour has exactly one job, so a student can tell what matters at a glance.

Readability and speed come first. This is a reading and practice tool used on cheap phones the
night before an exam.

## Colour (tokens live in `src/styles/global.css`)

| Role | Token | Light | Dark | Used for |
|---|---|---|---|---|
| Paper | `--bg` | `#F4F5F1` | `#171A22` | page ground |
| Sheet | `--surface` | `#FFFFFF` | `#1E222C` | cards, panels, inputs |
| Sheet 2 | `--surface-2` | `#ECEEE7` | `#272C38` | table heads, hover, idle cells |
| Ink | `--text` | `#1A1E29` | `#E9EBF1` | body text |
| Ink soft | `--text-soft` / `--text-faint` | `#454B5A` / `#5C6271` | `#B9BECB` / `#9298A8` | secondary text (all AA) |
| Ballpoint | `--accent` | `#2340A6` | `#9DB1FF` | links, active tab, primary buttons, focus |
| Red pen | `--hot` | `#B8322A` | `#FF8F80` | repeat counts, "most asked", page faults. Nothing else. |
| Highlighter | `--highlight` | `#FFF0A3` | `#4A4220` | "In one line", search matches |
| Tick | `--ok` | `#276F44` | `#6FCB93` | done, hits, practised, safe |
| Margin rule | `--margin` | `#E7A39C` | `#5A3A3A` | the 1px booklet margin on topic cards |

Subjects keep their own pen colour (`--blue`, `--coral`, `--green`, `--gold`, `--violet`, `--rose`,
each with a `-tint`). They are only used for the subject badge. Legacy names (`--ink`, `--cream`,
`--coral-deep`, `--mint`, `--yellow-tint`...) are kept as aliases because content files and the SVG
diagrams reference them. Every text/background pair is AA (4.5:1) in both themes.

No gradients, no glow, no blur except the sticky header over scrolling content.

## Type

One family, chosen for legibility: **Atkinson Hyperlegible Next** (text and headings) and
**Atkinson Hyperlegible Mono** (code, reference strings, frame grids). It separates 0/O and 1/l/I,
which matters for numericals.

- Body 17px / 1.6, measure capped at 68ch (`--measure`).
- Headings weight 800, tracking -0.02em, scale 1.25 (`--fs-*`).
- Numbers in tables and sims use `tabular-nums`.
- No all-caps eyebrows, no "01 /" section numbers, no arrow glyphs glued to labels.

## Space, shape, depth

- Spacing: 4px base, `--sp-1`..`--sp-9` = 4, 8, 12, 16, 24, 32, 48, 64, 96.
- Radius: `--radius` 14px (cards), `--radius-sm` 8px (controls, callouts), `--pill` for chips only.
- Elevation is declared once: cards use a hairline border; popovers and dialogs use `--shadow-2`.

## Motion: "pen stroke"

Decisive, no overshoot. Only `transform` and `opacity` animate.

- `--ease-out` (quart) for everything entering; `--ease-in-out` for things that move across.
- `--dur-1` 120ms feedback, `--dur-2` 180ms hovers, `--dur-3` 280ms tab switches, `--dur-4` 450ms
  sim steps, hero only up to 700ms.
- Signature moments: the hero highlighter sweep, the sliding ballpoint underline on tabs, and sim
  state changes (frames, disk head, Banker's Available vector).
- `prefers-reduced-motion`: entrances become instant, tab switches crossfade only, sims jump
  straight to the new state.

## Signature detail

The **red-pen circle** around a PYQ's repeat count (`.tally`). It is the one decorative mark on the
site, and it carries the most useful fact: how many papers asked this question.

## Icons

`@hugeicons/react` + `@hugeicons/core-free-icons` only, stroke 1.8, sized in em. No emoji.
