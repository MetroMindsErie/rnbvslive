import { useState, useEffect, useRef } from 'react'

export default function Home() {
  const [loading, setLoading] = useState(true)
  const cursorRef = useRef(null)
  const backgroundRef = useRef(null)
  const canvasRef = useRef(null)
  const contentRef = useRef(null)
  const socialTagsRef = useRef(null) // Add new ref for social media tags

  useEffect(() => {
    setLoading(false)
    
    // Initialize cursor magnification effect
    const cursor = cursorRef.current
    const background = backgroundRef.current
    const canvas = canvasRef.current
    const content = contentRef.current
    const socialTags = socialTagsRef.current // Get the social tags element
    
    if (!cursor || !canvas || !content || !socialTags) return

    // Elements inside cursor
    // cursor structure: <div.custom-cursor><div.cursor-ring></div><div.cursor-dot></div></div>
    const ring = cursor.querySelector('.cursor-ring')
    const dot = cursor.querySelector('.cursor-dot')

    // Position state
    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let posX = mouseX
    let posY = mouseY

    // Timing controls
    let lastMoveTime = performance.now()
    let lastRippleTime = 0
    // initialize lastMoveTimeX/Y to avoid ReferenceError
    let lastMoveTimeX = mouseX
    let lastMoveTimeY = mouseY

    // Canvas setup
    const ctx = canvas.getContext('2d')
    let canvasW = window.innerWidth
    let canvasH = window.innerHeight
    canvas.width = canvasW
    canvas.height = canvasH

    // Simple, low-cost ripple storage
    let ripples = []

    const createRipple = (x, y, speed = 0.5) => {
      const now = performance.now()
      // throttle ripples to avoid overload
      if (now - lastRippleTime < 60) return
      lastRippleTime = now

      ripples.push({ x, y, r: 8 + Math.min(speed * 30, 72), a: 0.45 })
      if (ripples.length > 6) ripples.shift()
    }

    const drawRipples = () => {
      ctx.clearRect(0, 0, canvasW, canvasH)
      if (ripples.length) {
        // draw in one path per ripple (cheap)
        for (let i = 0; i < ripples.length; i++) {
          const p = ripples[i]
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(255,255,255,${Math.max(0, p.a)})`
          ctx.lineWidth = 1.2
          ctx.stroke()
          // evolve
          p.r += 4
          p.a -= 0.016
        }
        // remove faded
        ripples = ripples.filter(p => p.a > 0.02)
      }
    }

    // Resize handler for canvas
    const onResize = () => {
      canvasW = window.innerWidth
      canvasH = window.innerHeight
      canvas.width = canvasW
      canvas.height = canvasH
    }
    window.addEventListener('resize', onResize, { passive: true })

    // Interpolation animation loop
    let rafId = null
    const ease = 0.16
    const render = () => {
      // interpolate towards mouse
      posX += (mouseX - posX) * ease
      posY += (mouseY - posY) * ease

      // Use translate3d for GPU compositing
      const tx = Math.round(posX - 0.5 * cursor.offsetWidth)
      const ty = Math.round(posY - 0.5 * cursor.offsetHeight)
      cursor.style.transform = `translate3d(${tx}px, ${ty}px, 0)`

      // subtle follow lag for ring vs dot
      dot.style.transform = `translate3d(${Math.round(posX - mouseX)*0}px, ${Math.round(posY - mouseY)*0}px, 0) scale(1)`
      ring.style.transform = `translate3d(0,0,0)`

      // draw ripples (kept off main layout)
      drawRipples()

      rafId = requestAnimationFrame(render)
    }
    rafId = requestAnimationFrame(render)

    // Helper to check interactive target
    const isInteractiveEl = (el) => {
      if (!el) return false
      const interactiveTags = ['BUTTON','A','INPUT','TEXTAREA','SELECT']
      if (interactiveTags.includes(el.tagName)) return true
      if (el.classList && (el.classList.contains('logo-3d') || el.classList.contains('menu-button') || el.classList.contains('floating-nav'))) return true
      if (el.closest && el.closest('[data-cursor="interactive"]')) return true
      return false
    }

    // Mouse handlers
    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY

      const now = performance.now()
      const dt = Math.max(1, now - lastMoveTime)
      const dx = mouseX - (lastMoveTimeX ?? mouseX)
      const dy = mouseY - (lastMoveTimeY ?? mouseY)
      const speed = Math.sqrt(dx*dx + dy*dy) / dt

      // create ripple when moving quickly
      if (speed > 0.35) createRipple(mouseX, mouseY, speed)

      // social tags parallax (very subtle, throttled by requestAnimationFrame)
      if (socialTags) {
        const cx = window.innerWidth * 0.5
        const cy = window.innerHeight * 0.5
        const offsetX = (mouseX - cx) / cx * 10
        const offsetY = (mouseY - cy) / cy * 6
        socialTags.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(1.01)`
        socialTags.style.transition = 'transform 180ms linear'
      }

      // hover detection
      const hovered = document.elementFromPoint(mouseX, mouseY)
      if (isInteractiveEl(hovered)) {
        cursor.classList.add('is-hovering')
        ring.classList.add('is-hovering')
        dot.classList.add('is-hovering')
        // If hovering the floating nav, add specific class
        if (hovered.closest && hovered.closest('.floating-nav')) {
          document.querySelector('.floating-nav')?.classList.add('nav-magnified')
        } else {
          document.querySelector('.floating-nav')?.classList.remove('nav-magnified')
        }
      } else {
        cursor.classList.remove('is-hovering')
        ring.classList.remove('is-hovering')
        dot.classList.remove('is-hovering')
        document.querySelector('.floating-nav')?.classList.remove('nav-magnified')
      }

      // keep background static
      if (background) background.style.transform = 'none'

      lastMoveTimeX = mouseX
      lastMoveTimeY = mouseY
      lastMoveTime = now
    }

    const onDown = () => {
      cursor.classList.add('is-pressed')
      ring.classList.add('is-pressed')
      dot.classList.add('is-pressed')
    }
    const onUp = () => {
      cursor.classList.remove('is-pressed')
      ring.classList.remove('is-pressed')
      dot.classList.remove('is-pressed')
    }
    const onLeave = () => {
      cursor.classList.remove('is-hovering')
      ring.classList.remove('is-hovering')
      dot.classList.remove('is-hovering')
      document.querySelector('.floating-nav')?.classList.remove('nav-magnified')
      // reset social tags transform
      if (socialTags) socialTags.style.transform = 'translate(0,0) scale(1)'
    }

    // Named scroll handler so it can be removed
    const handleScroll = () => {
      if (background) background.style.transform = 'none'
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Attach events with passive where safe
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup', onUp)
    document.addEventListener('mouseleave', onLeave)

    // Hide on touch devices - keep accessibility
    const handleTouchStart = () => {
      cursor.style.display = 'none'
      canvas.style.display = 'none'
      document.removeEventListener('touchstart', handleTouchStart)
    }
    document.addEventListener('touchstart', handleTouchStart, { passive: true })

    // Cleanup
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('scroll', handleScroll, { passive: true })
    }
  }, [])

  return (
    <>
      {/* Custom Cursor */}
      <div ref={cursorRef} className="custom-cursor" aria-hidden="true">
        <div className="cursor-ring"></div>
        <div className="cursor-dot"></div>
      </div>

      {/* Canvas for ripple effect */}
      <canvas ref={canvasRef} className="ripple-canvas"></canvas>

      <div className="homepage-container">
        {/* Background - completely static */}
        <div 
          ref={backgroundRef}
          className="parallax-background"
          style={{
            backgroundImage: "url('/images/parallax-bg.jpg')",
            backgroundPosition: "center center",
            backgroundSize: "cover",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#000",
            transform: "none" // Explicitly set to none to ensure it's static
          }}
        />
        
        {/* Background Overlay */}
        <div className="background-overlay" />
        
        {/* Floating particles animation */}
        <div className="particles-container">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Content Layer with ref for grabbing effect */}
        <div className="content-layer" ref={contentRef}>
          {/* 3D Logo - Upper Left */}
          {/* <div className="logo-container">
            <img 
              src="/images/3D-Logo-White.gif" 
              alt="R&B Versus Live 3D Logo"
              className="logo-3d"
            />
          </div>   */}
                 
          {/* Main Content - Social Media Tags with cursor effect */}
          <div className="main-content">
            <div className="social-tags-container">
              <img 
                ref={socialTagsRef} // Add ref to the image
                src="/images/social-media-tags-tm-rnbv.png" 
                alt="R&B Versus Live Social Media"
                className="social-tags-image"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
