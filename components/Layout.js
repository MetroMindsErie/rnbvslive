import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import Link from 'next/link'

export default function Layout({ children }) {
  const router = useRouter()
  const isHomePage = router.pathname === '/'
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <>
      {/* Mobile spinning logo - only show on mobile when menu is closed */}
      {isMobile && (
        <div className="mobile-spinning-logo">
          <Link href="/">
            <img 
              src="/images/3D-Logo-White.gif" 
              alt="R&B Versus Live 3D Logo"
              className="spinning-logo-image"
            />
          </Link>
        </div>
      )}
      
      {/* Desktop large logo - only show on desktop */}
      {!isMobile && (
        <div className="desktop-large-logo">
          <Link href="/">
            <img 
              src="/images/3D-Logo-White.gif" 
              alt="R&B Versus Live 3D Logo"
              className="large-logo-image"
            />
          </Link>
        </div>
      )}
      
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      {!isHomePage && <Footer />}
    </>
  )
}

