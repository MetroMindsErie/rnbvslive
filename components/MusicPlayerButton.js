import { useMusicPlayer } from '../contexts/MusicPlayerContext'

export default function MusicPlayerButton() {
  const { isPlaying, togglePlay, currentTrack } = useMusicPlayer()

  return (
    <button
      className="ml-2 rounded-full bg-gray-800 hover:bg-gray-700 p-2 transition-colors duration-150 flex items-center justify-center focus:outline-none"
      onClick={togglePlay}
      aria-label={isPlaying ? "Pause music" : "Play music"}
      type="button"
    >
      {isPlaying ? (
        // Pause icon
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/>
          <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/>
        </svg>
      ) : (
        // Play icon
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <polygon points="6,4 20,12 6,20" fill="currentColor"/>
        </svg>
      )}
      {/* Optionally show waveform or track info */}
      {/* <span className="ml-2 text-xs text-white">{currentTrack?.title}</span> */}
    </button>
  )
}
