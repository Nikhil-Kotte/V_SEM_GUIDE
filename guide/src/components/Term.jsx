import WarmTooltip from './bits/WarmTooltip.jsx'

// Glossary chip: hover, focus or long-press to see the definition (WarmTooltip from React Bits).
export default function Term({ term, def }) {
  return (
    <WarmTooltip content={def} side="top" size="md" surfaceColor="var(--highlight)" inkColor="var(--text)" radius={10} delay={250}>
      <button type="button" className="term">{term}</button>
    </WarmTooltip>
  )
}
