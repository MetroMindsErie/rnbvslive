import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase/client'

/**
 * Reusable background image component that fetches images from Supabase storage
 * Auto-detects current page from router when no page is specified
 */
export default function BackgroundImage({ 
  className = '',
  page = '',
  imageKey = '',
  bucket = 'pages',
  fallbackUrl = '',
  position = 'center',
  size = 'cover',
  fixed = false,
  overlay = '',
  opacity = 1,
  debug = false
}) {
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const router = useRouter()

  // Auto-detect current page if not specified
  const currentPage = page || extractPageFromPath(router.pathname)
  // Auto-generate image key if not provided
  const currentImageKey = imageKey || `${currentPage}.png`

  // Function to extract page name from router path
  function extractPageFromPath(path) {
    // Remove leading slash and get first segment of path
    const pathSegments = path.replace(/^\//, '').split('/')
    const pageName = pathSegments[0] || 'home'
    return pageName
  }

  // Determine fallback URL
  const defaultFallback = `https://etncdmskptoylmvnsmkq.supabase.co/storage/v1/object/public/${bucket}/${currentPage}/${currentImageKey}`

  useEffect(() => {
    const fetchBackgroundImage = async () => {
      try {
        setLoading(true)
        setError(false)

        // Always log for debugging purposes
        console.log(`[BackgroundImage] Fetching: ${currentPage}/${currentImageKey} from ${bucket}`);

        // Try to fetch from Supabase storage
        const { data, error } = await supabase
          .storage
          .from(bucket)
          .getPublicUrl(`${currentPage}/${currentImageKey}`)

        if (error) {
          console.error('[BackgroundImage] Error fetching:', error)
          setError(true)
          const fallbackImageUrl = fallbackUrl || defaultFallback;
          console.log('[BackgroundImage] Using fallback URL:', fallbackImageUrl);
          setImageUrl(fallbackImageUrl)
        } else if (data && data.publicUrl) {
          console.log('[BackgroundImage] Successfully loaded:', data.publicUrl)
          setImageUrl(data.publicUrl)
        } else {
          console.error('[BackgroundImage] No data returned')
          setError(true)
          const fallbackImageUrl = fallbackUrl || defaultFallback;
          console.log('[BackgroundImage] Using fallback URL:', fallbackImageUrl);
          setImageUrl(fallbackImageUrl)
        }
      } catch (err) {
        console.error('[BackgroundImage] Unexpected error:', err)
        setError(true)
        setImageUrl(fallbackUrl || defaultFallback)
      } finally {
        setLoading(false)
      }
    }

    // Use provided direct URL or fetch from Supabase
    if (fallbackUrl && !currentPage && !currentImageKey) {
      setImageUrl(fallbackUrl)
      setLoading(false)
    } else {
      fetchBackgroundImage()
    }
  }, [currentPage, currentImageKey, bucket, fallbackUrl, defaultFallback, debug])

  // Base styling with opacity control
  const backgroundStyles = {
    backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
    backgroundSize: size,
    backgroundPosition: position,
    backgroundAttachment: fixed ? 'fixed' : 'scroll',
    backgroundRepeat: 'no-repeat',
    opacity: opacity,
    transition: 'opacity 0.5s ease-in-out'
  }

  // Loading state
  if (loading) {
    return <div className={`${className} bg-black/50`}></div>
  }

  return (
    <div className={`relative ${className}`}>
      <div 
        className="absolute inset-0 w-full h-full"
        style={backgroundStyles}
      />
      
      {/* Optional overlay */}
      {overlay && (
        <div 
          className="absolute inset-0 w-full h-full" 
          style={{ backgroundColor: overlay }}
        />
      )}
      
      {/* Error state indicator (visible only in development or when debug is true) */}
      {(error && (process.env.NODE_ENV === 'development' || debug)) && (
        <div className="absolute bottom-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-70">
          Error loading image: {currentPage}/{currentImageKey}
        </div>
      )}
    </div>
  )
}
