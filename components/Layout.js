import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

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
      <Navbar isMobile={isMobile} />
      <main className="min-h-screen">
        {children}
      </main>
      {!isHomePage && <Footer />}
    </>
  )
}
