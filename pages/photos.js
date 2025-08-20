import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase/client'
import Image from 'next/image'
import GalleryGrid from '../components/GalleryGrid'

export default function Photos() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  useEffect(() => {
    fetchPhotos()
  }, [])

  const fetchPhotos = async () => {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching photos:', error)
    } else {
      setPhotos(data || [])
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading-pulse text-center">
          <div className="preloader"></div>
          <p className="mt-4 text-gray-600">Loading photos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6 animate-fade-in">
            Event <span className="text-yellow-400">Photos</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Relive the magic through our exclusive event photography
          </p>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <GalleryGrid 
            photos={photos} 
            onPhotoClick={setSelectedPhoto}
          />
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <Image
              src={selectedPhoto.image_url}
              alt={selectedPhoto.title || 'Event photo'}
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button 
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
