import Layout from '../components/Layout'
import '../styles/globals.css'
import '../styles/home.css'
import '../styles/dates.css'
import CursorEffect from '../components/CursorEffect'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FollowButton from '../components/FollowButton'

export default function App({ Component, pageProps }) {
  const router = useRouter()
  const isHomePage = router.pathname === '/'

  return (
    <Layout>
      <CursorEffect />
      {!isHomePage && <Navbar />}
      
      <div id="page-content" className="page-wrapper">
        <Component {...pageProps} />
      </div>

      <FollowButton /> {/* Added to all pages */}
      {!isHomePage && <Footer />}
    </Layout>
  )
}
