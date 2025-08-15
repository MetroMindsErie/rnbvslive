import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import VideoCard from '../components/VideoCard'

export default function Videos() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching videos:', error)
    } else {
      setVideos(data || [])
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading-pulse text-center">
          <div className="preloader"></div>
          <p className="mt-4 text-gray-600">Loading videos...</p>
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
            Event <span className="text-yellow-400">Videos</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Watch highlights from our epic R&B battles and performances
          </p>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video, index) => (
              <VideoCard 
                key={video.id} 
                video={video}
                className="card-entrance"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))}
          </div>
          
          {videos.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-xl">No videos available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
