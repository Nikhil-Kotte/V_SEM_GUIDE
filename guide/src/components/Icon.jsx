import { HugeiconsIcon } from '@hugeicons/react'

// One icon system: hugeicons, stroke 1.8, sized in em so it follows the text next to it.
export default function Icon({ icon, size = '1.15em', label, className = 'icon', ...rest }) {
  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      strokeWidth={1.8}
      className={className}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      {...rest}
    />
  )
}
