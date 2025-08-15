import { useEffect, useRef } from 'react'

export default function CursorEffect() {
  const cursorRef = useRef(null)
  const canvasRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    // Initialize cursor magnification effect
    const cursor = cursorRef.current
    const canvas = canvasRef.current
    const content = document.getElementById('page-content')
    
    if (!cursor || !canvas || !content) return

    let mouseX = 0
    let mouseY = 0
    let cursorX = 0
    let cursorY = 0
    let lastX = 0
    let lastY = 0
    let lastMoveTime = Date.now()

    // Set up canvas for ripple effect
    const ctx = canvas.getContext('2d')
    let canvasWidth = window.innerWidth
    let canvasHeight = window.innerHeight
    canvas.width = canvasWidth
    canvas.height = canvasHeight

    // Arrays to store ripple data
    let ripples = []
    
    // Create a ripple
    const createRipple = (x, y, size = 50, strength = 0.5) => {
      ripples.push({
        x,
        y,
        size,
        strength,
        alpha: 1,
        expanding: true
      })
      
      // Limit number of active ripples - reduced from 20 to 5
      if (ripples.length > 5) {
        ripples.shift()
      }
    }
    
    // Draw ripples on canvas
    const drawRipples = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvasWidth, canvasHeight)
      
      // Draw each ripple
      ripples.forEach((ripple, index) => {
        // Skip drawing if alpha is too low
        if (ripple.alpha <= 0) {
          ripples.splice(index, 1)
          return
        }
        
        // Draw ripple
        ctx.beginPath()
        ctx.arc(ripple.x, ripple.y, ripple.size, 0, Math.PI * 2, false)
        ctx.strokeStyle = `rgba(255, 255, 255, ${ripple.alpha})`
        ctx.lineWidth = 2
        ctx.stroke()
        
        // Update ripple size and opacity
        if (ripple.expanding) {
          ripple.size += 5
          ripple.alpha -= 0.02
        }
      })
      
      // Request next frame
      requestAnimationFrame(drawRipples)
    }
    
    // Start animation loop
    drawRipples()
    
    // Handle window resize
    const handleResize = () => {
      canvasWidth = window.innerWidth
      canvasHeight = window.innerHeight
      canvas.width = canvasWidth
      canvas.height = canvasHeight
    }
    
    window.addEventListener('resize', handleResize)

    // Smooth cursor following
    const animateCursor = () => {
      const speed = 0.15
      cursorX += (mouseX - cursorX) * speed
      cursorY += (mouseY - cursorY) * speed
      
      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`
      requestAnimationFrame(animateCursor)
    }

    // Calculate movement speed
    const getMovementSpeed = (x1, y1, x2, y2, elapsedMs) => {
      const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
      return distance / Math.max(elapsedMs, 10) // Prevent division by zero
    }

    // Mouse move handler
    const handleMouseMove = (e) => {
      const now = Date.now()
      const elapsedMs = now - lastMoveTime
      
      mouseX = e.clientX
      mouseY = e.clientY
      
      // Calculate movement speed
      const speed = getMovementSpeed(lastX, lastY, mouseX, mouseY, elapsedMs)
      
      // Create ripple effect based on movement speed - increased threshold from 0.2 to 0.4
      if (speed > 0.2) {
        const rippleSize = Math.min(40 + speed * 30, 150)
        const rippleStrength = Math.min(0.2 + speed * 0.1, 0.7)
        createRipple(mouseX, mouseY, rippleSize, rippleStrength)
      }
      
      // Enhanced screen grabbing effect - more pronounced movement
      if (content) {
        const moveX = (mouseX - window.innerWidth / 2) / 15
        const moveY = (mouseY - window.innerHeight / 2) / 15
        content.style.transform = `translate(${moveX}px, ${moveY}px)`
      }
      
      // Background parallax effect for any parallax backgrounds on the page
      // Further reduced movement range from 0.05 to 0.03 to prevent revealing white background
      const backgrounds = document.querySelectorAll('.parallax-background')
      backgrounds.forEach(background => {
        const xPos = (e.clientX / window.innerWidth) * 100
        const yPos = (e.clientY / window.innerHeight) * 100
        background.style.transform = `translate(-${xPos * 0.03}px, -${yPos * 0.03}px) scale(1.2)`  // Increased scale from 1.1 to 1.2
      })
      
      // Check if hovering over interactive elements
      const hoveredElement = document.elementFromPoint(e.clientX, e.clientY)
      const isInteractive = hoveredElement && (
        hoveredElement.tagName === 'BUTTON' ||
        hoveredElement.tagName === 'A' ||
        hoveredElement.tagName === 'INPUT' ||
        hoveredElement.classList.contains('logo-3d') ||
        hoveredElement.classList.contains('floating-nav') ||
        hoveredElement.closest('.floating-nav')
      )
      
      if (isInteractive) {
        cursor.classList.add('cursor-magnify')
        const nav = document.querySelector('.floating-nav')
        if (hoveredElement.closest('.floating-nav') || hoveredElement.classList.contains('floating-nav')) {
          nav?.classList.add('nav-magnified')
        }
      } else {
        cursor.classList.remove('cursor-magnify')
        const nav = document.querySelector('.floating-nav')
        nav?.classList.remove('nav-magnified')
      }
      
      // Update last position and time for next calculation
      lastX = mouseX
      lastY = mouseY
      lastMoveTime = now
    }

    // Mouse leave handler to remove magnify effect
    const handleMouseLeave = () => {
      cursor.classList.remove('cursor-magnify')
      const nav = document.querySelector('.floating-nav')
      nav?.classList.remove('nav-magnified')
    }

    // Initialize events
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    animateCursor()

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <>
      {/* Custom Cursor */}
      <div ref={cursorRef} className="custom-cursor">
        <div className="cursor-inner"></div>
      </div>

      {/* Canvas for ripple effect */}
      <canvas ref={canvasRef} className="ripple-canvas"></canvas>
    </>
  )
}
