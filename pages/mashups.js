import { useRouter } from 'next/router'
import useSupabaseSWR from '../lib/supabase/useSupabaseSWR'
import CasketViewerSection from '../CasketViewerSection'
import BackgroundImage from '../components/BackgroundImage'
import Head from 'next/head'
import { useState } from 'react'

export default function Mashups() {
  const router = useRouter()
  const { data: mashups = [], error, isLoading } = useSupabaseSWR(
    'mashups',
    {
      table: 'mashups',
      order: { column: 'created_at', ascending: false }
    }
  )
  const [bgLoaded, setBgLoaded] = useState(false)

  // Build viewer items (color + image metadata)
  const palette = [
    '#06b6d4','#8b5cf6','#f97316','#ef4444','#06b6a4','#f59e0b'
  ]
  const glows = [
    'rgba(6,182,212,0.5)','rgba(139,92,246,0.45)','rgba(249,115,22,0.45)',
    'rgba(239,68,68,0.45)','rgba(6,182,164,0.45)','rgba(245,158,11,0.45)'
  ]
  const viewerItems = mashups.map((m, i) => ({
    id: m.id,
    name: m.title,
    images: m.thumbnail_url ? [{ image_url: m.thumbnail_url, alt_text: m.title }] : [],
    color: palette[i % palette.length],
    glow: glows[i % glows.length],
    variantColor: m.platform || 'mashup'
  }))

  // Function to handle background image load
  const handleBgLoad = (success) => {
    setBgLoaded(success);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading-pulse text-center">
          <div className="preloader"></div>
          <p className="mt-4 text-gray-600">Loading mashups...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">Error loading mashups.</div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>R&B Mashups | RNBVS</title>
        <meta name="description" content="Explore our collection of R&B mashups" />
      </Head>
      
      <div className="mashups-page">
        {/* Background Image with explicit styling and debugging */}
        <div className="mashups-background">
          <BackgroundImage 
            className="bg-image"
            page="mashups"
            imageKey="The-Love-RNBV.png"
            opacity={1}
            debug={true}
            fixed={true}
            fallbackUrl="https://etncdmskptoylmvnsmkq.supabase.co/storage/v1/object/public/pages/mashups/The-Love-RNBV.png"
            onLoad={() => handleBgLoad(true)}
            onError={() => handleBgLoad(false)}
          />
        </div>
        
        {/* Content container with z-index to sit above background */}
        <div className="mashups-content">
          <div className="casket-viewer-container">
            <CasketViewerSection 
              items={viewerItems}
              onSelect={(item) => {
                router.push(`/mashups/${item.id}`)
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}