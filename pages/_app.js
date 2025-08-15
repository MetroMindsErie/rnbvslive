import Layout from '../components/Layout'
import '../styles/globals.css'
import '../styles/home.css'
import '../styles/dates.css'
import CursorEffect from '../components/CursorEffect'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'

export default function App({ Component, pageProps }) {
  const router = useRouter()

  return (
    <Layout>
      <CursorEffect />
      <Navbar />
      
      <div id="page-content" className="page-wrapper">
        <Component {...pageProps} />
      </div>
    </Layout>
  )
}
