import { useEffect, useRef, useState } from 'react'

const SIZE = 120       // spotlight diameter
const TRAIL_SPEED = 0.15

export default function CursorEffect() {
  const [cursorVisible, setCursorVisible] = useState(false);
  const spotlightRef = useRef(null)
  const ghostRef = useRef(null)
  const requestRef = useRef(null)
  const overlayRef = useRef(null)
  const lastUpdateRef = useRef(0)
  const lastDimStateRef = useRef(false)
  const lastHoveredRef = useRef(null)
  const isMountedRef = useRef(false);

  useEffect(() => {
    // Set mounted flag
    isMountedRef.current = true;
    
    // Safety check for window to prevent SSR errors
    if (typeof window === 'undefined') return;
    
    // Detect mobile/touch devices more reliably
    const isTouchDevice = () => {
      return (
        ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0) ||
        window.matchMedia('(pointer: coarse)').matches
      );
    };

    // Don't initialize cursor effects on touch devices
    if (isTouchDevice()) {
      // Clean up any existing cursor elements to prevent artifacts
      try {
        const elements = document.querySelectorAll('.custom-cursor, .magnifier, .clone-layer');
        elements.forEach(el => {
          if (el && el.parentNode) {
            el.parentNode.removeChild(el);
          }
        });
      } catch (err) {
        console.log("Cleanup error:", err);
      }
      return;
    }

    const spotlight = spotlightRef.current
    const ghost = ghostRef.current
    const overlay = overlayRef.current
    if (!spotlight || !ghost || !overlay) return

    let targetX = window.innerWidth / 2
    let targetY = window.innerHeight / 2
    let currentX = targetX
    let currentY = targetY
    let ghostX = targetX
    let ghostY = targetY
    let visible = false
    let isDimmed = false
    let dimTimeout = null

    // Align cursor with mouse position
    spotlight.style.top = '0px'
    spotlight.style.left = '0px'
    ghost.style.top = '0px'
    ghost.style.left = '0px'

    // More efficient animation loop with no transforms
    const tick = () => {
      // Calculate positions
      currentX += (targetX - currentX) * TRAIL_SPEED
      currentY += (targetY - currentY) * TRAIL_SPEED
      ghostX += (currentX - ghostX) * 0.05
      ghostY += (currentY - ghostY) * 0.05

      // Update positions using top/left
      if (Math.abs(spotlight._lastX - currentX) > 0.5 || Math.abs(spotlight._lastY - currentY) > 0.5) {
        // Use absolute values to correctly position the element at mouse cursor
        spotlight.style.left = `${currentX - (SIZE / 2)}px`
        spotlight.style.top = `${currentY - (SIZE / 2)}px`
        ghost.style.left = `${ghostX - (SIZE / 2)}px`
        ghost.style.top = `${ghostY - (SIZE / 2)}px`
        
        // Store last positions
        spotlight._lastX = currentX
        spotlight._lastY = currentY
      }

      // Update overlay position less frequently (only when dimmed)
      if (isDimmed && Date.now() - lastUpdateRef.current > 50) {
        overlay.style.setProperty('--spotlight-x', `${currentX}px`)
        overlay.style.setProperty('--spotlight-y', `${currentY}px`)
        lastUpdateRef.current = Date.now()
      }

      requestRef.current = requestAnimationFrame(tick)
    }

    // Initialize last positions
    spotlight._lastX = currentX
    spotlight._lastY = currentY
    
    requestRef.current = requestAnimationFrame(tick)

    // Simplified nav link detection
    const checkForNavLink = (element) => {
      // Quick check for the element itself
      if (!element || !element.tagName) return false
      
      // Common nav link identifiers
      if (element.tagName === 'A' || 
          (element.classList && 
           (element.classList.contains('nav-link') || 
            element.classList.contains('floating-nav-item') || 
            element.classList.contains('mobile-nav-link')))) {
        return true
      }
      
      // Check parent only if needed (just one level up to save performance)
      const parent = element.parentElement
      if (parent && parent.tagName === 'A') return true
      
      return false
    }

    // Simplified dimming functions
    const applyDimming = () => {
      if (lastDimStateRef.current === true) return
      
      clearTimeout(dimTimeout)
      overlay.classList.add('active')
      isDimmed = true
      lastDimStateRef.current = true
    }

    const removeDimming = () => {
      if (lastDimStateRef.current === false) return
      
      clearTimeout(dimTimeout)
      dimTimeout = setTimeout(() => {
        overlay.classList.remove('active')
        isDimmed = false
        lastDimStateRef.current = false
      }, 100)
    }

    // Throttled mouse move handler
    let lastMoveTime = 0
    const throttleAmount = 16; // ms between allowed updates
    
    const onMove = (e) => {
      // Update target position immediately (feels responsive)
      targetX = e.clientX
      targetY = e.clientY
      
      // Show cursor elements if not visible
      if (!visible) {
        visible = true
        spotlight.style.opacity = '1'
        ghost.style.opacity = '0.25'
      }
      
      // Throttle the more expensive operations
      const now = Date.now()
      if (now - lastMoveTime < throttleAmount) return
      lastMoveTime = now
      
      // Get element under cursor
      const hovered = document.elementFromPoint(e.clientX, e.clientY)
      
      // Skip if same element as last time
      if (hovered === lastHoveredRef.current) return
      lastHoveredRef.current = hovered
      
      // Check if nav link and apply/remove dimming
      const isNavLink = checkForNavLink(hovered)
      
      if (isNavLink && !isDimmed) {
        applyDimming()
      } else if (!isNavLink && isDimmed) {
        removeDimming()
      }
    }

    const onLeave = () => {
      visible = false
      spotlight.style.opacity = '0'
      ghost.style.opacity = '0'
      removeDimming()
      lastHoveredRef.current = null
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(requestRef.current)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      clearTimeout(dimTimeout)
      overlay.classList.remove('active')
    }
  }, [])

  // Skip rendering on mobile devices
  if (typeof window !== 'undefined' && 
      (('ontouchstart' in window) || 
       (navigator.maxTouchPoints > 0) || 
       window.matchMedia('(pointer: coarse)').matches)) {
    return null;
  }

  return (
    <>
      {/* Ghost trail - absolute positioning */}
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

      {/* Spotlight - absolute positioning */}
      <div
        ref={spotlightRef}
        style={{
          position: 'fixed',
          width: `${SIZE}px`,
          height: `${SIZE}px`,
          borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.8)',
          backgroundColor: 'rgba(255,255,255,0.08)',
          pointerEvents: 'none',
          transition: 'opacity 220ms linear',
          opacity: 0,
          zIndex: 99998,
          boxShadow: '0 0 20px 5px rgba(255,255,255,0.15)',
        }}
      />

      {/* Dimming overlay with spotlight cutout */}
      <div 
        ref={overlayRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99996,
          pointerEvents: 'none',
          transition: 'opacity 0.25s ease',
          opacity: 0,
          '--spotlight-x': '50%',
          '--spotlight-y': '50%',
          '--spotlight-size': `${SIZE * 2}px`,
        }}
        className="dimming-overlay"
      />

      {/* CSS for the dimming effect */}
      <style jsx global>{`
        .dimming-overlay {
          background: radial-gradient(
            circle var(--spotlight-size) at var(--spotlight-x) var(--spotlight-y),
            transparent 0%,
            rgba(0, 0, 0, 0.6) 70%
          );
        }
        
        .dimming-overlay.active {
          opacity: 1;
        }
        
        /* Navigation elements stacking */
        .nav-link, 
        .floating-nav-item,
        .mobile-nav-link,
        a {
          position: relative;
          z-index: 99997;
        }
        
        /* Hide default cursor when our custom one is active */
        body:has(.dimming-overlay.active) {
          cursor: none;
        }
      `}</style>
    </>
  )
}
