import { useState } from 'react'

export default function MashupCard({ mashup, className = '', style = {} }) {
  const [isPlaying, setIsPlaying] = useState(false)

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'youtube':
        return '📺'
      case 'instagram':
        return '📷'
      case 'x':
        return '🐦'
      default:
        return '🎵'
    }
  }

  const handlePlay = () => {
    setIsPlaying(true)
  }

  return (
    <div 
      className={`bg-white rounded-xl shadow-lg overflow-hidden card-hover ${className}`}
      style={style}
    >
      <div className="relative h-48 bg-gray-200">
        {mashup.thumbnail_url ? (
          <img 
            src={mashup.thumbnail_url} 
            alt={mashup.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
            <span className="text-white text-4xl">🎵</span>
          </div>
        )}
        
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
          <span className="text-lg">{getPlatformIcon(mashup.platform)}</span>
        </div>
        
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <button 
              onClick={handlePlay}
              className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all duration-200 transform hover:scale-110"
            >
              <span className="text-2xl ml-1">▶️</span>
            </button>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{mashup.title}</h3>
        <p className="text-gray-600 mb-4">{mashup.description}</p>
        
        {isPlaying && mashup.embed_url && (
          <div className="mb-4">
            <iframe 
              src={mashup.embed_url}
              className="w-full h-48 rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-purple-600 font-semibold">
            {mashup.platform?.toUpperCase()}
          </span>
          {mashup.embed_url && !isPlaying && (
            <button 
              onClick={handlePlay}
              className="text-purple-600 hover:text-purple-800 font-semibold"
            >
              Watch Now →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
