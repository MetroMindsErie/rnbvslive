import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

// Local chevrons to avoid requiring @heroicons/react
const ChevronLeftIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true" {...props}>
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
  </svg>
)
const ChevronRightIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true" {...props}>
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
  </svg>
)

// Enhanced swipe hand icon for mobile demo
const SwipeHandIcon = () => (
  <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 8v8a5 5 0 01-5 5H8a5 5 0 01-5-5v-8a5 5 0 015-5h8a5 5 0 015 5z" stroke="none" fill="rgba(255,255,255,0.1)" />
    <path d="M11 14l-1.5-1.5M9.5 12.5L11 11M13 8v6M15 8v8M17 10v6M19 12v4M7 12v4M9 14v2" />
  </svg>
)

// Mouse cursor icon for desktop demo
const MouseCursorIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 2L17 12L12 13.5L16.5 18L14 20.5L9.5 15.5L7 22L7 2Z" fill="white" stroke="white"/>
  </svg>
)

export default function CasketViewerSection({ items = [], onSelect = () => {} }) {
  const [mashups, setMashups] = useState(items || [])
  const [currentIndex, setCurrentIndex] = useState(0)
  const viewerRef = useRef(null)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [cursorVisible, setCursorVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showSwipeDemo, setShowSwipeDemo] = useState(true)
  const [showDesktopDemo, setShowDesktopDemo] = useState(true)

  useEffect(() => {
    setMashups(items || [])
    setCurrentIndex(0)
  }, [items])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY })
      setCursorVisible(true)
    }
    
    const handleMouseLeave = () => {
      setCursorVisible(false)
    }
    
    if (viewerRef.current) {
      viewerRef.current.addEventListener('mousemove', handleMouseMove)
      viewerRef.current.addEventListener('mouseleave', handleMouseLeave)
    }
    
    return () => {
      if (viewerRef.current) {
        viewerRef.current.removeEventListener('mousemove', handleMouseMove)
        viewerRef.current.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [viewerRef])

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // Check on mount
    checkMobile()
    
    // Add listener for window resize
    window.addEventListener('resize', checkMobile)
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Hide swipe demo after a timeout
  useEffect(() => {
    if (isMobile && showSwipeDemo) {
      const timer = setTimeout(() => {
        setShowSwipeDemo(false)
      }, 7000) // Increase from 5000 to 7000ms
      return () => clearTimeout(timer)
    }
  }, [isMobile, showSwipeDemo])

  // Hide desktop demo after a timeout
  useEffect(() => {
    if (!isMobile && showDesktopDemo) {
      const timer = setTimeout(() => {
        setShowDesktopDemo(false)
      }, 8000) // Increase from 6000 to 8000ms
      return () => clearTimeout(timer)
    }
  }, [isMobile, showDesktopDemo])

  const prevMashup = () => {
    setCurrentIndex((idx) => (idx - 1 + mashups.length) % Math.max(1, mashups.length))
  }

  const nextMashup = () => {
    setCurrentIndex((idx) => (idx + 1) % Math.max(1, mashups.length))
  }

  const handleMashupClick = (mashup, index) => {
    setCurrentIndex(index)
    onSelect(mashup)
  }

  const handleSwipe = (event, info) => {
    if (info.offset.x < -60) nextMashup()
    if (info.offset.x > 60) prevMashup()
    
    // Hide demo when user interacts
    setShowSwipeDemo(false)
    setShowDesktopDemo(false)
  }

  if (!mashups || mashups.length === 0) return null

  return (
    <section 
      ref={viewerRef}
      className="py-24 md:py-32 relative overflow-hidden"
      style={{ cursor: 'none' }}
    >
      {cursorVisible && (
        <motion.div 
          className="fixed w-4 h-4 rounded-full bg-white z-50 pointer-events-none mix-blend-difference"
          initial={{ scale: 0 }}
          animate={{ 
            scale: 1,
            x: cursorPosition.x - 8, 
            y: cursorPosition.y - 8
          }}
          transition={{ duration: 0.1 }}
        />
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Desktop click-and-drag demonstration - positioned outside viewer */}
        {!isMobile && showDesktopDemo && (
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[200] pointer-events-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="bg-black/15 backdrop-blur-md rounded-xl p-4 flex items-center gap-4 shadow-2xl">
              <div className="relative">
                <motion.div
                  initial={{ x: 0, scale: 1 }}
                  animate={{
                    x: [-25, 25, -25],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    repeat: 3,
                    duration: 1.8,
                    times: [0, 0.5, 1],
                    ease: "easeInOut"
                  }}
                  className="relative"
                >
                  <div className="relative">
                    <MouseCursorIcon />
                    <motion.div
                      animate={{ 
                        scale: [1, 1.8, 1],
                        opacity: [0.4, 1, 0.4]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.2
                      }}
                      className="absolute -top-1 -right-1 w-8 h-8 rounded-full border-2 border-white/30"
                      style={{ filter: "blur(1px)" }}
                    />
                  </div>
                </motion.div>
              </div>
              <motion.div
                animate={{ 
                  y: [0, -3, 0],
                  opacity: [0.9, 1, 0.9]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.5
                }}
              >
                <p className="text-white/90 font-medium text-sm uppercase tracking-wider font-['Inter','system-ui',sans-serif]">Click and drag</p>
                <p className="text-white/70 text-xs mt-1 font-['Inter','system-ui',sans-serif]">← Navigate through mashups →</p>
              </motion.div>
            </div>
          </motion.div>
        )}
        
        {/* Enhanced mobile swipe demonstration - positioned outside viewer */}
        {isMobile && showSwipeDemo && (
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[200] pointer-events-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <motion.div 
              className="bg-black/15 backdrop-blur-md rounded-xl p-4 flex items-center gap-4 shadow-2xl"
              animate={{
                boxShadow: ['0 0 20px rgba(255,255,255,0)', '0 0 20px rgba(255,255,255,0.1)', '0 0 20px rgba(255,255,255,0)']
              }}
              transition={{
                repeat: Infinity,
                duration: 2
              }}
            >
              <div className="relative p-2">
                <motion.div
                  initial={{ x: 0 }}
                  animate={{ 
                    x: [-45, 45, -45],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    repeatType: "loop", 
                    duration: 2,
                    ease: "easeInOut"
                  }}
                  className="relative"
                >
                  <SwipeHandIcon />
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: [0, 0.6, 0],
                      scale: [0.8, 1.5, 0.8]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      repeatType: "loop"
                    }}
                    className="absolute inset-0 bg-white/10 rounded-full"
                    style={{
                      filter: "blur(8px)"
                    }}
                  />
                </motion.div>
              </div>
              <motion.div
                animate={{ 
                  y: [0, -3, 0]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.5
                }}
              >
                <p className="text-white/90 font-medium text-sm uppercase tracking-wider font-['Inter','system-ui',sans-serif]">Swipe to browse</p>
                <p className="text-white/70 text-xs mt-1 font-['Inter','system-ui',sans-serif]">← Slide your finger →</p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* 3D CD Casket Viewer */}
        <motion.div 
          className="relative h-64 md:h-96 flex items-center justify-center"
          style={{ perspective: '2000px' }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.05}
          dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
          onDragEnd={handleSwipe}
          onDragStart={() => {
            setShowSwipeDemo(false);
            setShowDesktopDemo(false);
          }}
          onClick={() => {
            setShowSwipeDemo(false);
            setShowDesktopDemo(false);
          }}
        >
          {mashups.map((mashup, index) => {
            const offset = index - currentIndex
            let position = offset
            if (position > mashups.length / 2) position = position - mashups.length
            if (position < -mashups.length / 2) position = position + mashups.length
            const absPosition = Math.abs(position)
            const isCenter = position === 0
            const finalX = position * (isMobile ? 120 : 200)
            const finalZ = isCenter ? 200 : 80 - (absPosition * 20)
            const finalY = isCenter ? 0 : absPosition * 10
            const finalRotateY = isCenter ? 0 : position * 15
            const finalRotateX = isCenter ? 0 : 5
            const finalScale = isCenter ? (isMobile ? 1.1 : 1.3) : 1 - (absPosition * 0.15)
            const finalOpacity = absPosition <= 2 ? 1 - (absPosition * 0.2) : 0

            return (
              <motion.div
                key={mashup.id}
                className="absolute cursor-pointer group"
                style={{ 
                  transformStyle: 'preserve-3d',
                  zIndex: isCenter ? 100 : 50 - absPosition
                }}
                initial={{ 
                  y: 400, 
                  opacity: 0, 
                  rotateX: 90,
                  scale: 0.3
                }}
                animate={{
                  x: finalX,
                  y: finalY,
                  z: finalZ,
                  rotateY: finalRotateY,
                  rotateX: finalRotateX,
                  opacity: finalOpacity,
                  scale: finalScale
                }}
                transition={{ 
                  duration: 0.4,
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 200,
                  damping: 25
                }}
                onClick={() => handleMashupClick(mashup, index)}
                whileHover={{ scale: isCenter ? (isMobile ? 1.15 : 1.35) : finalScale * 1.05 }}
              >
                {/* CD Case */}
                <div 
                  className="w-48 h-60 md:w-64 md:h-80 relative rounded-2xl overflow-hidden shadow-2xl group-hover:shadow-3xl transition-all duration-300"
                  style={{
                    border: isCenter ? '3px solid rgba(255,255,255,0.9)' : '1px solid rgba(107, 114, 128, 0.3)',
                    boxShadow: isCenter
                      ? '0 40px 80px rgba(0,0,0,0.8), 0 0 60px rgba(255,255,255,0.6)'
                      : `0 ${Math.max(finalZ/4, 5)}px ${Math.max(finalZ * 0.6, 20)}px rgba(0,0,0,0.4)`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black">
                    {mashup.images && mashup.images.length > 0 && mashup.images[0]?.image_url ? (
                      <img
                        src={mashup.images[0].image_url}
                        alt={mashup.images[0].alt_text || `${mashup.name}`}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-800">
                        <div className="text-center">
                          <span className="text-6xl mb-4 block">💿</span>
                          <p className="text-sm font-mono">{mashup.name}</p>
                          <p className="text-xs mt-1 opacity-75">Image Loading...</p>
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all" />
                  </div>

                  <div 
                    className="absolute top-0 left-0 right-0 h-2 bg-white/30"
                  />

                  <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                    <div className="text-center">
                      <h3 className="text-white font-bold text-xl mb-2 font-mono tracking-wider group-hover:text-gray-200 transition-colors">
                        {mashup.name}
                      </h3>
                      <p className="text-gray-300 text-sm font-mono">R&B Mashup</p>
                      {/* Removed the "Swipe to browse" text here */}
                    </div>

                    {isCenter && (
                      <div
                        className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-white/70 group-hover:scale-110 transition-transform"
                        style={{ 
                          boxShadow: '0 0 40px rgba(255,255,255,0.6)'
                        }}
                      />
                    )}
                  </div>

                  {isCenter && (
                    <div
                      className="absolute inset-0 rounded-2xl pointer-events-none group-hover:opacity-80 transition-opacity"
                      style={{
                        boxShadow: '0 0 80px rgba(255,255,255,0.6) inset'
                      }}
                    />
                  )}
                </div>
              </motion.div>
            )
          })}

          {/* Navigation Controls - Only visible on desktop */}
          {!isMobile && (
            <>
              <motion.button
                onClick={prevMashup}
                className="absolute left-4 md:left-20 top-1/2 transform -translate-y-1/2 z-50 p-3 md:p-4 bg-black/80 backdrop-blur-sm rounded-full text-white border border-gray-600/50 hover:bg-black/90 hover:border-white/50 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <ChevronLeftIcon className="w-5 h-5 md:w-6 md:h-6" />
              </motion.button>

              <motion.button
                onClick={nextMashup}
                className="absolute right-4 md:right-20 top-1/2 transform -translate-y-1/2 z-50 p-3 md:p-4 bg-black/80 backdrop-blur-sm rounded-full text-white border border-gray-600/50 hover:bg-black/90 hover:border-white/50 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <ChevronRightIcon className="w-5 h-5 md:w-6 md:h-6" />
              </motion.button>
            </>
          )}
        </motion.div>
        
        {/* Page indicator */}
        <div className="flex justify-center mt-6 space-x-2">
          <span className="text-white/70 font-mono text-sm">
            {currentIndex + 1} / {mashups.length}
          </span>
        </div>
      </div>
    </section>
  )
}