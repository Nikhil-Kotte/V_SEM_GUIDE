// Small margin doodles. Decorative only.
const D = ({ children, className = '', viewBox = '0 0 32 32' }) => (
  <svg className={`doodle ink ${className}`} viewBox={viewBox} aria-hidden="true" focusable="false">{children}</svg>
)

export const Star = (p) => <D {...p}><path d="M16 3l3.600 8.600 9.400.8-7.200 6 2.400 9.200L16 22.600 7.800 27.600l2.400-9.200-7.200-6 9.400-.8z" /></D>
export const Spark = (p) => <D {...p}><path d="M16 3v8M16 21v8M3 16h8M21 16h8M7 7l5 5M20 20l5 5M25 7l-5 5M12 20l-5 5" /></D>
export const Bulb = (p) => <D {...p}><path d="M16 4c6 0 9.500 4.200 9.500 9 0 3.400-1.800 5.400-3.400 7.400-1 1.200-1.300 2.400-1.300 3.600h-9.600c0-1.200-.3-2.400-1.300-3.600-1.600-2-3.400-4-3.400-7.400 0-4.800 3.500-9 9.500-9zM12 27h8M13.500 30h5" /></D>
export const Pin = (p) => <D {...p}><path d="M16 29V17M9 6h14l-2 6 4 5H7l4-5z" /></D>
export const Swirl = (p) => <D {...p}><path d="M16 16c2-2 5 0 4 3s-6 3-8 0-1-9 4-10 11 3 11 8-5 11-12 10" /></D>
export const Exclaim = (p) => <D {...p}><path d="M16 4c1 6 .6 12-.4 17M15.500 26.500v.6" strokeWidth="3" /></D>

// "imp!" as a student writes it in the margin.
export function Imp({ className = '', children = 'imp!' }) {
  return <span className={`hand imp ${className}`} aria-hidden="true">{children}</span>
}

// The same doodle should sit beside the same heading every time, so pick by index.
const SET = [Star, Spark, Bulb, Swirl, Pin]
export function DoodleFor({ i = 0, ...p }) {
  const C = SET[i % SET.length]
  return <C {...p} />
}
