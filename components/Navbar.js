import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

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

  return (
    <nav className="rnb-navbar">
      <div className="nav-container">
        {/* Top Right Content (Nav Links and Actions) */}
        <div className="top-right-content">
          {/* Main Navigation Links */}
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

          {/* Right Side Actions */}
          <div className="nav-actions">
            <Link href="/cart" className="cart-icon-button">
              <svg className="shopping-bag-icon" viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M7 22c-.55 0-1.02-.2-1.41-.59-.39-.39-.59-.86-.59-1.41s.2-1.02.59-1.41c.39-.39.86-.59 1.41-.59s1.02.2 1.41.59c.39.39.59.86.59 1.41s-.2 1.02-.59 1.41C8.02 21.8 7.55 22 7 22zm10 0c-.55 0-1.02-.2-1.41-.59-.39-.39-.59-.86-.59-1.41s.2-1.02.59-1.41c.39-.39.86-.59 1.41-.59s1.02.2 1.41.59c.39.39.59.86.59 1.41s-.2 1.02-.59 1.41c-.39.39-.86.59-1.41.59zM7 17c-.83 0-1.53-.3-2.09-.88-.56-.58-.82-1.28-.76-2.12L5.09 9.5 3.9 6H2V4h3l1.35 4H20.11l-1.39 7c-.08.42-.28.77-.59 1.04-.31.27-.68.41-1.12.41H7z"/>
              </svg>
              {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
            </Link>

            <button 
              className="menu-button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="menu-icon-text">Menu</span>
            </button>
          </div>
        </div>

        {/* Bottom Left Logo */}
        <div className="bottom-left-content">
          <Link href="/" className="navbar-logo-link">
            <img 
              src="/images/3D-Logo-White.gif" 
              alt="R&B Versus Live 3D Logo"
              className="navbar-logo"
            />
          </Link>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMenuOpen && (
          <div className="mobile-menu">
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
        )}
      </div>
    </nav>
  )
}
