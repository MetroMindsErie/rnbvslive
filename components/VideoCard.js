import { useState } from 'react'

export default function VideoCard({ video, className = '', style = {} }) {
  const [isPlaying, setIsPlaying] = useState(false)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div 
      className={`bg-white rounded-xl shadow-lg overflow-hidden card-hover ${className}`}
      style={style}
    >
      <div className="relative h-48">
        {video.thumbnail_url ? (
          <img 
            src={video.thumbnail_url} 
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
            <span className="text-white text-4xl">🎬</span>
          </div>
        )}
        
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <button 
              onClick={() => setIsPlaying(true)}
              className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all duration-200 transform hover:scale-110"
            >
              <span className="text-2xl ml-1">▶️</span>
            </button>
          </div>
        )}
        
        {video.created_at && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
            <span className="text-sm font-semibold text-gray-800">
              {formatDate(video.created_at)}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{video.title}</h3>
        {video.description && (
          <p className="text-gray-600 mb-4">{video.description}</p>
        )}
        
        {isPlaying && video.embed_url && (
          <div className="mb-4">
            <iframe 
              src={video.embed_url}
              className="w-full h-48 rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
        
        {!isPlaying && video.embed_url && (
          <button 
            onClick={() => setIsPlaying(true)}
            className="w-full btn-primary"
          >
            Watch Video
          </button>
        )}
      </div>
    </div>
  )
}
