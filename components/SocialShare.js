import { useState } from 'react'

export default function SocialShare({ 
  url = '',
  title = '',
  description = '',
  className = '',
  size = 'md',
  variant = 'default'
}) {
  const [copiedToClipboard, setCopiedToClipboard] = useState(false)

  // Use current page URL if none provided
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = encodeURIComponent(description)

  const socialLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&via=rnbversuslive`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
    instagram: 'https://www.instagram.com/rnbversuslive', // Instagram doesn't support URL sharing, so link to profile
    tiktok: 'https://www.tiktok.com/@rnbversuslive', // TikTok also doesn't support direct sharing via URL
  }

  const handleShare = (platform) => {
    if (platform === 'copy') {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopiedToClipboard(true)
        setTimeout(() => setCopiedToClipboard(false), 2000)
      })
      return
    }

    if (platform === 'instagram' || platform === 'tiktok') {
      // Instagram and TikTok don't support direct sharing, so just open profile
      window.open(socialLinks[platform], '_blank', 'noopener,noreferrer')
      return
    }

    // Open share URL in popup window
    const width = 600
    const height = 400
    const left = (window.innerWidth - width) / 2
    const top = (window.innerHeight - height) / 2

    window.open(
      socialLinks[platform],
      'social-share',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    )
  }

  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'social-share-sm'
      case 'lg': return 'social-share-lg'
      default: return 'social-share-md'
    }
  }

  const getVariantClass = () => {
    switch (variant) {
      case 'minimal': return 'social-share-minimal'
      case 'filled': return 'social-share-filled'
      default: return 'social-share-default'
    }
  }

  return (
    <div className={`social-share-container ${getSizeClass()} ${getVariantClass()} ${className}`}>
      {/* Facebook */}
      <button
        onClick={() => handleShare('facebook')}
        className="social-btn social-btn-facebook"
        aria-label="Share on Facebook"
        title="Share on Facebook"
      >
        <svg viewBox="0 0 24 24" className="social-icon">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </button>

      {/* X (formerly Twitter) */}
      <button
        onClick={() => handleShare('twitter')}
        className="social-btn social-btn-twitter"
        aria-label="Share on X"
        title="Share on X"
      >
        <svg viewBox="0 0 24 24" className="social-icon">
          <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
        </svg>
      </button>

      {/* LinkedIn */}
      <button
        onClick={() => handleShare('linkedin')}
        className="social-btn social-btn-linkedin"
        aria-label="Share on LinkedIn"
        title="Share on LinkedIn"
      >
        <svg viewBox="0 0 24 24" className="social-icon">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      </button>

      {/* Instagram - Updated for better visual */}
      <button
        onClick={() => handleShare('instagram')}
        className="social-btn social-btn-instagram"
        aria-label="Follow on Instagram"
        title="Follow on Instagram"
      >
        <svg viewBox="0 0 24 24" className="social-icon">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      </button>

      {/* TikTok - New */}
      <button
        onClick={() => handleShare('tiktok')}
        className="social-btn social-btn-tiktok"
        aria-label="Follow on TikTok"
        title="Follow on TikTok"
      >
        <svg viewBox="0 0 24 24" className="social-icon">
          <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
        </svg>
      </button>

      {/* Copy Link */}
      <button
        onClick={() => handleShare('copy')}
        className={`social-btn social-btn-copy ${copiedToClipboard ? 'copied' : ''}`}
        aria-label="Copy link"
        title={copiedToClipboard ? 'Copied!' : 'Copy link'}
      >
        <svg viewBox="0 0 24 24" className="social-icon">
          {copiedToClipboard ? (
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          ) : (
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
          )}
        </svg>
      </button>
    </div>
  )
}
