import { useRouter } from 'next/router'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children }) {
  const router = useRouter()
  const isHomePage = router.pathname === '/'

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      {!isHomePage && <Footer />}
    </>
  )
}

