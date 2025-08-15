import { useState, useEffect, useRef } from 'react'
import CursorEffect from '../components/CursorEffect'

export default function Home() {
  const [loading, setLoading] = useState(true)
  const backgroundRef = useRef(null)
  const contentRef = useRef(null)
  const socialTagsRef = useRef(null)

  useEffect(() => {
    // keep loading toggle simple; heavy cursor / screengrab logic removed
    setLoading(false)

    // Ensure background remains static (no screengrab transform)
    if (backgroundRef.current) {
      backgroundRef.current.style.transform = 'none'
    }
  }, [])

  return (
    <>
      {/* Magnifier replaces previous custom cursor + canvas */}
      <CursorEffect />

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
            transform: "none"
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
                ref={socialTagsRef}
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

