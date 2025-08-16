import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import CursorEffect with no SSR to avoid hydration issues
const CursorEffect = dynamic(() => import('../components/CursorEffect'), {
  ssr: false
})

export default function Home({ isMobile }) {
  const [loading, setLoading] = useState(true)
  const backgroundRef = useRef(null)
  const contentRef = useRef(null)
  const socialTagsRef = useRef(null)

  useEffect(() => {
    // Set loading state after mount to avoid hydration mismatch
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);
    
    // Safe background handling with error check
    try {
      if (backgroundRef.current) {
        backgroundRef.current.style.transform = 'none';
      }
    } catch (err) {
      console.error("Background ref error:", err);
    }
    
    return () => clearTimeout(timer);
  }, []);

  // Safe render to prevent hydration issues and mobile errors
  return (
    <>
      {/* Only render cursor effect for desktop */}
      {!isMobile && <CursorEffect />}

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
        
        {/* Floating particles animation - reduce count on mobile */}
        <div className="particles-container">
          {[...Array(isMobile ? 10 : 20)].map((_, i) => (
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
          {/* Main Content - Social Media Tags with cursor effect */}
          <div className="main-content">
            <div className="social-tags-container">
              <img 
                ref={socialTagsRef}
                src="/images/social-media-tags-tm-rnbv.png" 
                alt="R&B Versus Live Social Media"
                className="social-tags-image"
                loading="eager"
                width="800"
                height="600"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Add getInitialProps to handle server-side mobile detection
Home.getInitialProps = async (ctx) => {
  let isMobile = false;
  
  // Check user agent on server-side
  if (ctx.req) {
    const userAgent = ctx.req.headers['user-agent'] || '';
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  }
  
  return { isMobile };
}

