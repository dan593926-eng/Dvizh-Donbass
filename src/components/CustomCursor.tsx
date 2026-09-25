import { useEffect, useState } from 'react'

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(pointer:fine)')
    const update = () => setEnabled(media.matches)
    update()
    media.addEventListener('change', update)
    if (!media.matches) return () => media.removeEventListener('change', update)

    let raf = 0
    let target = { x: -100, y: -100 }
    const move = (event: MouseEvent) => {
      target = { x: event.clientX, y: event.clientY }
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setPosition(target))
    }
    const check = (event: Event) => {
      const targetElement = event.target as HTMLElement | null
      setHovering(Boolean(targetElement?.closest('a,button,[data-cursor="hover"]')))
    }

    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('mouseover', check, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', check)
      media.removeEventListener('change', update)
    }
  }, [])

  if (!enabled) return null

  return (
    <div
      aria-hidden="true"
      className={`custom-cursor ${hovering ? 'is-hovering' : ''}`}
      style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
    >
      <span />
    </div>
  )
}
