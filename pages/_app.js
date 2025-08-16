import Layout from '../components/Layout'
import '../styles/globals.css'
import '../styles/home.css'
import '../styles/dates.css'
import CursorEffect from '../components/CursorEffect'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FollowButton from '../components/FollowButton'
import { useState, useEffect } from 'react'

// Simple error boundary component
function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    window.onerror = (msg, src, lineNo, colNo, error) => {
      console.error("Caught window error:", error);
      setHasError(true);
      return true; // Prevents default error handling
    };
    
    return () => {
      window.onerror = null;
    };
  }, []);
  
  if (hasError) {
    return (
      <div className="error-fallback">
        <h1>Something went wrong</h1>
        <p>Please try refreshing the page or contact support if the issue persists.</p>
        <button onClick={() => window.location.reload()}>
          Refresh Page
        </button>
      </div>
    );
  }
  
  return children;
}

export default function App({ Component, pageProps }) {
  const router = useRouter()
  const isHomePage = router.pathname === '/'
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    // Detect if we're on mobile
    const checkMobile = () => {
      return (
        typeof window !== 'undefined' && (
          ('ontouchstart' in window) ||
          (navigator.maxTouchPoints > 0) ||
          window.matchMedia('(pointer: coarse)').matches
        )
      );
    };
    
    setIsMobile(checkMobile());
    
    // Add classes to body for mobile vs desktop styling
    if (checkMobile()) {
      document.body.classList.add('is-mobile-device');
    } else {
      document.body.classList.add('is-desktop-device');
    }
    
    return () => {
      document.body.classList.remove('is-mobile-device', 'is-desktop-device');
    };
  }, []);
  
  return (
    <Layout>
      <ErrorBoundary>
        <CursorEffect />
        {!isHomePage && <Navbar />}
        
        <div id="page-content" className="page-wrapper">
          <Component {...pageProps} isMobile={isMobile} />
        </div>

        <FollowButton /> {/* Added to all pages */}
        {!isHomePage && <Footer />}
      </ErrorBoundary>
    </Layout>
  )
}
