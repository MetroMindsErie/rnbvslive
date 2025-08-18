import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

export default function Navbar({ isMobile }) {
  const [cartCount, setCartCount] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  // Close menu when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMenuOpen(false)
    }
    
    router.events.on('routeChangeComplete', handleRouteChange)
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router])

  useEffect(() => {
    fetchCartCount()

    // Listen for cart updates
    const handleCartUpdate = () => {
      fetchCartCount()
    }

    window.addEventListener('cartUpdated', handleCartUpdate)

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
    }
  }, [])

  const fetchCartCount = async () => {
    const sessionId = getSessionId()
    const { data } = await supabase
      .from('cart_items')
      .select('quantity')
      .eq('session_id', sessionId)

    const count = data?.reduce((sum, item) => sum + item.quantity, 0) || 0
    setCartCount(count)
  }

  const getSessionId = () => {
    if (typeof window === 'undefined') return null
    let sessionId = localStorage.getItem('session_id')
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('session_id', sessionId)
    }
    return sessionId
  }

  const navItems = [
    { href: '/dates', label: 'Dates' },
    { href: '/mashups', label: 'Mashups' },
    { href: '/rnb-versus-live', label: 'R&B Versus LIVE' },
    { href: '/photos', label: 'Photos' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
    { href: '/products', label: 'All Products' }
  ]

  const isActiveRoute = (href) => {
    if (href === '/' && router.pathname === '/') return true
    if (href !== '/' && router.pathname.startsWith(href)) return true
    return false
  }

  // Add debugging to check isMobile value
  useEffect(() => {
    console.log('isMobile value:', isMobile);
  }, [isMobile]);
  
  // Force mobile mode for small screens regardless of prop
  const [forceMobile, setForceMobile] = useState(false);
  
  useEffect(() => {
    // Check if screen is mobile size and force mobile mode
    const checkMobile = () => {
      const isMobileScreen = window.innerWidth <= 768;
      setForceMobile(isMobileScreen);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Use either the prop or forced mobile state
  const isActuallyMobile = isMobile || forceMobile;

  // Add spacer div for mobile view that will push content down
  const mobileSpacerStyle = {
    height: '60px',  // Creates space below navbar on mobile
    display: isActuallyMobile ? 'block' : 'none',
    width: '100%'
  };

  return (
    <>
      <nav className="rnb-navbar">
        <div className="nav-container-simplified">
          {/* Logo - always leftmost element */}
          <Link href="/" className={isActuallyMobile ? "mobile-logo-container" : "desktop-logo-container"}>
            <img 
              src="/images/3D-Logo-White.gif" 
              alt="R&B Versus Live 3D Logo"
              className={isActuallyMobile ? "mobile-logo-image" : "desktop-logo-image"}
            />
          </Link>
          
          {/* Main Navigation Content */}
          <div className="nav-content">
            {/* Main Navigation Links - only show on desktop */}
            {!isActuallyMobile && (
              <div className="nav-links">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-link ${isActiveRoute(item.href) ? 'active' : ''}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

            {/* Right Side Actions - use isActuallyMobile */}
            <div className="nav-actions">
              {/* Cart icon */}
              <Link href="/cart" className="cart-icon-button">
                <svg className="shopping-bag-icon" viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M7 22c-.55 0-1.02-.2-1.41-.59-.39-.39-.59-.86-.59-1.41s.2-1.02.59-1.41c.39-.39.86-.59 1.41-.59s1.02.2 1.41.59c.39.39.59.86.59 1.41s-.2 1.02-.59 1.41C8.02 21.8 7.55 22 7 22zm10 0c-.55 0-1.02-.2-1.41-.59-.39-.39-.59-.86-.59-1.41s.2-1.02.59-1.41c.39-.39.86-.59 1.41-.59s1.02.2 1.41.59c.39.39.59.86.59 1.41s-.2 1.02-.59 1.41c-.39.39-.86.59-1.41.59zM7 17c-.83 0-1.53-.3-2.09-.88-.56-.58-.82-1.28-.76-2.12L5.09 9.5 3.9 6H2V4h3l1.35 4H20.11l-1.39 7c-.08.42-.28.77-.59 1.04-.31.27-.68.41-1.12.41H7z"/>
                </svg>
                {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
              </Link>

              {/* Hamburger Menu Button - use isActuallyMobile instead of isMobile */}
              {isActuallyMobile && (
                <button 
                  className={`menu-button ${isMenuOpen ? 'menu-open' : ''}`}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label="Toggle menu"
                  aria-expanded={isMenuOpen}
                >
                  <div className="hamburger">
                    <span className={isMenuOpen ? 'open' : ''}></span>
                    <span className={isMenuOpen ? 'open' : ''}></span>
                    <span className={isMenuOpen ? 'open' : ''}></span>
                  </div>
                  <span className="menu-icon-text">{isMenuOpen ? 'Close' : 'Menu'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu Overlay */}
          <div className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`}>
            <div className="mobile-menu-container">
              {/* 3D Logo for mobile navigation */}
              <div className="mobile-menu-logo">
                <Link href="/" onClick={() => setIsMenuOpen(false)}>
                  <img 
                    src="/images/3D-Logo-White.gif" 
                    alt="R&B Versus Live 3D Logo"
                    className="mobile-3d-logo"
                  />
                </Link>
              </div>
              
              <div className="mobile-nav-links">
                {navItems.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`mobile-nav-link ${isActiveRoute(item.href) ? 'active' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              
              <div className="mobile-nav-footer">
                <Link href="/cart" className="mobile-cart-link" onClick={() => setIsMenuOpen(false)}>
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M7 22c-.55 0-1.02-.2-1.41-.59-.39-.39-.59-.86-.59-1.41s.2-1.02.59-1.41c.39-.39.86-.59 1.41-.59s1.02.2 1.41.59c.39.39.59.86.59 1.41s-.2 1.02-.59 1.41C8.02 21.8 7.55 22 7 22zm10 0c-.55 0-1.02-.2-1.41-.59-.39-.39-.59-.86-.59-1.41s.2-1.02.59-1.41c.39-.39.86-.59 1.41-.59s1.02.2 1.41.59c.39.39.59.86.59 1.41s-.2 1.02-.59 1.41c-.39.39-.86.59-1.41.59zM7 17c-.83 0-1.53-.3-2.09-.88-.56-.58-.82-1.28-.76-2.12L5.09 9.5 3.9 6H2V4h3l1.35 4H20.11l-1.39 7c-.08.42-.28.77-.59 1.04-.31.27-.68.41-1.12.41H7z"/>
                  </svg>
                  Cart {cartCount > 0 && <span className="mobile-cart-count">{cartCount}</span>}
                </Link>
                
                <div className="mobile-social-links">
                  <a href="https://instagram.com/rnbversus" target="_blank" rel="noopener noreferrer" className="social-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a href="https://twitter.com/rnbversus" target="_blank" rel="noopener noreferrer" className="social-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Mobile spacer div - will push content down on mobile */}
      <div style={mobileSpacerStyle}></div>
    </>
  )
}