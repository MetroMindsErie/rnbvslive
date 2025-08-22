import { createContext, useContext, useRef, useState, useEffect, useCallback } from 'react'

// Mock playlist (replace with Supabase fetch later)
const PLAYLIST = [
  {
    title: "RNBV-34-min-mashup",
    url: "https://etncdmskptoylmvnsmkq.supabase.co/storage/v1/object/public/mashups/media/RNBV-34-min-mashup.mp3"
  },
  // Add more tracks as needed
]

const MusicPlayerContext = createContext()

export function MusicPlayerProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const audioRef = useRef(null)

  const currentTrack = PLAYLIST[currentTrackIndex] || null

  // Play/pause logic
  const togglePlay = useCallback(() => {
    if (!currentTrack) return
    setIsPlaying((prev) => !prev)
  }, [currentTrack])

  // Handle play/pause effect
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          setIsPlaying(false)
        })
      }
    } else {
      audio.pause()
    }
  }, [isPlaying, currentTrack])

  // When track changes, auto-play if already playing
  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false))
    }
  }, [currentTrackIndex])

  // Loop to next track on end
  const handleEnded = () => {
    if (PLAYLIST.length > 1) {
      setCurrentTrackIndex((i) => (i + 1) % PLAYLIST.length)
    } else {
      audioRef.current.currentTime = 0
      setIsPlaying(false)
    }
  }

  // Prevent autoplay on mount (browser restrictions)
  useEffect(() => {
    setIsPlaying(false)
  }, [])

  return (
    <MusicPlayerContext.Provider value={{
      isPlaying,
      togglePlay,
      currentTrack,
      currentTrackIndex,
      setCurrentTrackIndex,
      playlist: PLAYLIST
    }}>
      {/* Hidden audio element, persists globally */}
      <audio
        ref={audioRef}
        src={currentTrack?.url}
        onEnded={handleEnded}
        preload="auto"
        style={{ display: 'none' }}
        loop={PLAYLIST.length === 1}
      />
      {children}
    </MusicPlayerContext.Provider>
  )
}

export function useMusicPlayer() {
  return useContext(MusicPlayerContext)
}
