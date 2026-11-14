import { YoutubeIcon } from '@hugeicons/core-free-icons'
import Icon from './Icon.jsx'

// Links to YouTube lectures on a topic (content/<subject>/videos.js). Plain links, no embedded
// player, so the page stays light and nothing loads from YouTube until a student clicks.
export default function VideoLinks({ videos, title = 'Watch it explained' }) {
  if (!videos?.length) return null
  return (
    <section className="videos" aria-label={title}>
      <h4 className="notes-label">{title}</h4>
      <ul>
        {videos.map((v) => (
          <li key={v.id}>
            <a href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener noreferrer">
              <Icon icon={YoutubeIcon} className="icon videos__icon" />
              <span className="videos__title">{v.title}</span>
              <span className="videos__meta">{v.channel}{v.length ? `, ${v.length}` : ''}<span className="sr-only"> (opens YouTube in a new tab)</span></span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
