import { useEffect, useRef } from 'react'

const SIZE = 120       // magnifier diameter
const TRAIL_SPEED = 0.15
const ZOOM = 1.3       // magnification level

export default function CursorEffect() {
  const magnifierRef = useRef(null)
  const ghostRef = useRef(null)
  const requestRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return

    const magnifier = magnifierRef.current
    const ghost = ghostRef.current
    const inner = magnifier.querySelector('.magnifier-inner')
    if (!magnifier || !ghost || !inner) return

    let targetX = window.innerWidth / 2
    let targetY = window.innerHeight / 2
    let currentX = targetX
    let currentY = targetY
    let ghostX = targetX
    let ghostY = targetY
    let visible = false

    const tick = () => {
      currentX += (targetX - currentX) * TRAIL_SPEED
      currentY += (targetY - currentY) * TRAIL_SPEED
      ghostX += (currentX - ghostX) * 0.05
      ghostY += (currentY - ghostY) * 0.05

      magnifier.style.transform = `translate3d(${currentX - SIZE / 2}px, ${currentY - SIZE / 2}px, 0)`
      ghost.style.transform = `translate3d(${ghostX - SIZE / 2}px, ${ghostY - SIZE / 2}px, 0)`

      requestRef.current = requestAnimationFrame(tick)
    }

    requestRef.current = requestAnimationFrame(tick)

    const onMove = (e) => {
      targetX = e.clientX
      targetY = e.clientY

      if (!visible) {
        visible = true
        magnifier.style.opacity = '1'
        ghost.style.opacity = '0.25'
      }

      const hovered = document.elementFromPoint(e.clientX, e.clientY)
      if (!hovered) return

      const rect = hovered.getBoundingClientRect()
      const computedStyle = window.getComputedStyle(hovered)
      let bgImage = ''

      if (hovered.tagName === 'IMG') {
        bgImage = `url(${hovered.src})`
      } else if (computedStyle.backgroundImage && computedStyle.backgroundImage !== 'none') {
        bgImage = computedStyle.backgroundImage
      } else {
        // If no image, just sample page background
        bgImage = window.getComputedStyle(document.body).backgroundImage || 'none'
      }

      inner.style.backgroundImage = bgImage
      inner.style.backgroundSize = `${rect.width * ZOOM}px ${rect.height * ZOOM}px`

      const posX = ((e.clientX - rect.left) / rect.width) * 50
      const posY = ((e.clientY - rect.top) / rect.height) * 50
      inner.style.backgroundPosition = `${posX}% ${posY}%`
    }

    const onLeave = () => {
      visible = false
      magnifier.style.opacity = '0'
      ghost.style.opacity = '0'
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(requestRef.current)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <>
      {/* Ghost trail */}
      <div
        ref={ghostRef}
        style={{
          position: 'fixed',
          width: `${SIZE}px`,
          height: `${SIZE}px`,
          borderRadius: '50%',
          pointerEvents: 'none',
          transition: 'opacity 220ms linear',
          opacity: 0,
          zIndex: 99997,
          backgroundColor: 'rgba(255,255,255,0.05)',
        }}
      />

      {/* Magnifier */}
      <div
        ref={magnifierRef}
        style={{
          position: 'fixed',
          width: `${SIZE}px`,
          height: `${SIZE}px`,
          borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.8)',
          backgroundColor: 'rgba(0,0,0,0.05)',
          pointerEvents: 'none',
          transition: 'opacity 220ms linear',
          opacity: 0,
          zIndex: 99998,
          overflow: 'hidden',
        }}
      >
        <div
          className="magnifier-inner"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '50% 50%',
            backgroundSize: 'cover',
            willChange: 'background-position',
          }}
        />
      </div>
    </>
  )
}
