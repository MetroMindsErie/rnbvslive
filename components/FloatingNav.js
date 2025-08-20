// This file is no longer needed - functionality moved to Navbar.js
import { supabase } from '../lib/supabase/client'

export default function FloatingNav() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const navRef = useRef(null)

  const handleNewsletterSignup = async (e) => {
    e.preventDefault()
    if (!email) return

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email, subscribed_at: new Date().toISOString() }])

      if (error && error.code !== '23505') {
        throw error
      }

      setIsSubscribed(true)
      setEmail('')
    } catch (error) {
      console.error('Newsletter signup error:', error)
    }
  }

  return (
    <nav ref={navRef} className="floating-nav">
      <div className="nav-content">
        <h1 className="nav-title">R&B VERSUS LIVE</h1>
        <p className="nav-subtitle">Experience the Ultimate Battle</p>
        
        <div className="newsletter-section">
          <form onSubmit={handleNewsletterSignup} className="newsletter-form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email for exclusive access"
              className="email-input"
              required
            />
            <button type="submit" className="submit-button">
              Get 10% Off Tickets!
            </button>
          </form>
          
          {isSubscribed && (
            <p className="success-message">
              🎉 Thanks for subscribing! Check your email for exclusive offers.
            </p>
          )}
        </div>
        
        <div className="feature-badges">
          <div className="badge">
            <span className="badge-dot green"></span>
            Live Events
          </div>
          <div className="badge">
            <span className="badge-dot yellow"></span>
            Exclusive Content
          </div>
          <div className="badge">
            <span className="badge-dot purple"></span>
            VIP Access
          </div>
        </div>
      </div>
    </nav>
  )
}
