import { useRouter } from 'next/router'
import useSupabaseSWR from '../../lib/supabase/useSupabaseSWR'
import Head from 'next/head'
import { useState, useRef, useEffect } from 'react'
import BackgroundImage from '../../components/BackgroundImage'
import Link from 'next/link'
import Image from 'next/image'

// Custom hook to safely use Supabase SWR only when ID is valid
function useMashupById(id) {
  const router = useRouter()
  const isReady = router.isReady

  // Only fetch when we have a valid ID
  const shouldFetch = isReady && typeof id === 'string' && id && id !== 'undefined'

  // Always call useSupabaseSWR, but with null key when we shouldn't fetch
  return useSupabaseSWR(
    shouldFetch ? ['mashups', id] : null,
    shouldFetch ? {
      table: 'mashups',
      match: { id },
    } : null
  )
}

// --- Custom Media Player Component ---
function MashupMediaPlayer({ playlist, currentIndex, onChangeTrack }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [times, setTimes] = useState({})
  const [isScrollable, setIsScrollable] = useState(false)
  const audioRef = useRef(null)
  const tracklistRef = useRef(null)
  const track = playlist[currentIndex]

  // Check if tracklist is scrollable
  useEffect(() => {
    if (tracklistRef.current) {
      const checkIfScrollable = () => {
        const el = tracklistRef.current;
        setIsScrollable(el.scrollHeight > el.clientHeight);
      };

      checkIfScrollable();
      // Also check after window resize
      window.addEventListener('resize', checkIfScrollable);

      return () => window.removeEventListener('resize', checkIfScrollable);
    }
  }, [playlist])

  // helper to format seconds
  const fmt = (s) => {
    if (!s && s !== 0) return '00:00'
    const sec = Math.floor(s || 0)
    const m = Math.floor(sec / 60).toString().padStart(2, '0')
    const r = (sec % 60).toString().padStart(2, '0')
    return `${m}:${r}`
  }

  // Play/pause logic (keeps behavior for toggling current audio)
  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(() => { })
    }
    setIsPlaying(!isPlaying)
  }

  // Play a specific track immediately (per-row play button) — toggle when same track
  const playTrack = (idx) => {
    if (!audioRef.current) return
    const t = playlist[idx]
    if (!t || !t.audio_url) return

    // If clicking the currently playing track -> toggle pause/play
    if (idx === currentIndex) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        if (audioRef.current.src !== t.audio_url) {
          audioRef.current.src = t.audio_url
          audioRef.current.currentTime = times[idx]?.currentTime || 0
        }
        audioRef.current.play().catch(() => { })
        setIsPlaying(true)
      }
      return
    }

    // Different track: update index and start playback
    onChangeTrack(idx)
    // set src then play (audio element's src prop will reflect track after render; ensure immediate set)
    audioRef.current.src = t.audio_url
    audioRef.current.currentTime = 0
    audioRef.current.play().catch(() => { })
    setIsPlaying(true)
    setProgress(0)
  }

  // Progress bar logic - update times for active track
  const handleTimeUpdate = () => {
    if (!audioRef.current) return
    const ct = audioRef.current.currentTime || 0
    const d = audioRef.current.duration || 0
    setTimes(prev => ({ ...prev, [currentIndex]: { currentTime: ct, duration: d } }))
    if (d > 0) setProgress(ct / d)
  }

  // Per-row seek: only seek when row is currentIndex (to avoid loading/delay complexity)
  const handleRowSeek = (idx, e) => {
    if (!audioRef.current) return
    const rect = e.target.getBoundingClientRect()
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    if (idx === currentIndex) {
      const dur = (times[idx] && times[idx].duration) || audioRef.current.duration || 0
      audioRef.current.currentTime = percent * dur
    } else {
      // If not current, start track at 0 (no seeking) — this keeps behavior predictable
      playTrack(idx)
    }
  }

  // Track change (select only, pause)
  const handleTrackChange = (idx) => {
    onChangeTrack(idx)
    if (audioRef.current) {
      audioRef.current.pause()
    }
    setIsPlaying(false)
    setProgress(0)
  }

  return (
    <div className="media-player-container">
      <audio
        ref={audioRef}
        src={track?.audio_url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <div className="player-ui">
        <div
          ref={tracklistRef}
          className={`tracklist ${isScrollable ? 'scrollable' : ''}`}
        >
          {playlist.map((t, idx) => {
            const tt = times[idx] || { currentTime: 0, duration: 0 }
            const pct = tt.duration ? (tt.currentTime / tt.duration) : 0
            return (
              <div
                key={t.id ?? idx}
                className={`track-row ${idx === currentIndex ? 'active' : ''}`}
              >
                {/* Play button per row */}
                <button
                  className="track-row-play-btn"
                  onClick={() => playTrack(idx)}
                  aria-label={idx === currentIndex && isPlaying ? 'Pause track' : `Play ${t.title}`}
                  type="button"
                >
                  {idx === currentIndex && isPlaying ? '⏸' : '▶'}
                </button>

                {/* Text area selects (pauses) the track */}
                <div
                  className="track-info"
                  onClick={() => handleTrackChange(idx)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleTrackChange(idx) }}
                >
                  <div className="track-title">{t.title}</div>
                  <div className="track-artist">{t.artist || t.subtitle}</div>

                  {/* Per-row progress bar */}
                  <div
                    className="row-progress"
                    onClick={(e) => handleRowSeek(idx, e)}
                    role="presentation"
                  >
                    <div
                      className="row-progress-inner"
                      style={{ width: `${pct * 100}%` }}
                    />
                  </div>

                  {/* Per-row time display */}
                  <div className="row-time">
                    {fmt(tt.currentTime)} / {fmt(tt.duration)}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Removed global play/time UI - per-row controls are used */}
        <div className="player-controls">
          {/* left intentionally empty: per-row progress shows status */}
        </div>
      </div>
    </div>
  )
}

// --- Main Mashup Detail Page ---
export default function MashupDetail() {
  const router = useRouter()
  const { id } = router.query
  const [currentIndex, setCurrentIndex] = useState(0)

  // Use our safe custom hook for the current mashup
  const { data: mashupArr, error, isLoading } = useMashupById(id)

  // Get the first mashup if array, or null
  const mashup = Array.isArray(mashupArr) ? mashupArr[0] : mashupArr

  // Example playlist (replace with real data if available)
  const playlist = mashup?.tracks ?? [
    {
      id: 'rnb-v-hiphop-1',
      title: 'RNB V HipHop 1',
      artist: 'We are R&B Versus LIVE!',
      audio_url: mashup?.audio_url ?? '',
    },
    {
      id: 'rnb-v-hiphop-2',
      title: 'RNB V HipHop 2',
      artist: 'We are R&B Versus LIVE!',
      audio_url: mashup?.audio_url ?? '',
    },
    {
      id: 'rnb-v-hiphop-3',
      title: 'RNB V HipHop 3',
      artist: 'Notorious B.I.G MashUp',
      audio_url: mashup?.audio_url ?? '',
    },
  ]

  // Set up smooth scrolling when component mounts or ID changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Enable smooth scrolling behavior
      document.documentElement.style.scrollBehavior = 'smooth'

      // When navigating between mashups, scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' })

      return () => {
        // Clean up
        document.documentElement.style.scrollBehavior = ''
      }
    }
  }, [id]) // Re-run when mashup ID changes

  // Show loading until ready
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="loading-pulse text-center">
          <div className="preloader" />
          <p className="mt-4 text-gray-300">Loading mashup...</p>
        </div>
      </div>
    )
  }

  // Show error if no mashup found
  if (error || !mashup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-red-500">Mashup not found.</div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{mashup.title} | R&B Vs Hip-Hop</title>
        <meta name="description" content={mashup.description || mashup.title} />
        {/* Add preconnect for Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>

      <div className="mashup-detail-bg">
        {/* BackgroundImage component - pass thumbnail as key / fallback */}
        <BackgroundImage
          imageKey={mashup?.thumbnail_url}
          fallbackUrl={mashup?.thumbnail_url}
          opacity={0.7}
          fixed
        />

        {/* Dark overlay for better contrast */}
        <div className="mashup-detail-overlay" />

        {/* Main content layout */}
        <div className="mashup-detail-content">
          {/* Album art */}
          <div className="mashup-album-art">
            {mashup?.thumbnail_url ? (
              <Image
                src={mashup.thumbnail_url}
                alt={mashup.title || 'Album art'}
                width={400}
                height={400}
                className="album-art-img"
              />
            ) : (
              <div className="album-art-img placeholder" />
            )}
          </div>

          {/* Content section */}
          <div className="mashup-main-info">
            {/* Title */}
            <h1 className="mashup-title animate-fade-in">{mashup.title || 'R&B Vs Hip-Hop'}</h1>

            {/* Social media links (simple text links to avoid heavy SVG markup) */}
            <div className="mashup-social-links">
              {mashup.instagram_url && (
                <a href={mashup.instagram_url} target="_blank" rel="noopener noreferrer" className="social-link instagram-link">
                  View on Instagram
                </a>
              )}
              {mashup.youtube_url && (
                <a href={mashup.youtube_url} target="_blank" rel="noopener noreferrer" className="social-link youtube-link">
                  Check out on YouTube
                </a>
              )}
              {mashup.x_url && (
                <a href={mashup.x_url} target="_blank" rel="noopener noreferrer" className="social-link x-link">
                  View on X
                </a>
              )}
              {mashup.tiktok_url && (
                <a href={mashup.tiktok_url} target="_blank" rel="noopener noreferrer" className="social-link tiktok-link">
                  TikTok
                </a>
              )}
              {mashup.spotify_url && (
                <a href={mashup.spotify_url} target="_blank" rel="noopener noreferrer" className="social-link spotify-link">
                  Spotify
                </a>
              )}
            </div>

            {/* Media player section */}
            <div className="mashup-player-section">
              <MashupMediaPlayer
                playlist={playlist}
                currentIndex={currentIndex}
                onChangeTrack={setCurrentIndex}
              />
            </div>
          </div>
        </div>

        <div className="mashup-footer-space" />
      </div>
    </>
  )
}