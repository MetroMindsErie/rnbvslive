import { useRef, useState, useEffect } from 'react'
import useSupabaseSWR from '../lib/supabase/useSupabaseSWR'
import Head from 'next/head'
import Link from 'next/link'

export default function Dates() {
  const [hoveredEvent, setHoveredEvent] = useState(null)
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 })
  const observerRef = useRef(null)
  const cursorRef = useRef(null)
  const imageRef = useRef(null)
  const [windowWidth, setWindowWidth] = useState(0);

  // Fetch events using SWR
  const { data: events = [], error, isLoading } = useSupabaseSWR(
    'events',
    {
      table: 'events',
      order: { column: 'date', ascending: true }
    }
  )

  useEffect(() => {
    setupScrollAnimations()
    setupMagnetoEffect()
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
      window.removeEventListener('resize', handleResize);
    }
  }, [])

  const setupScrollAnimations = () => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in')
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )
  }

  const setupMagnetoEffect = () => {
    const cursor = cursorRef.current
    if (!cursor) return

    let mouseX = 0
    let mouseY = 0
    let cursorX = 0
    let cursorY = 0

    const animateCursor = () => {
      const speed = 0.15
      cursorX += (mouseX - cursorX) * speed
      cursorY += (mouseY - cursorY) * speed
      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`
      requestAnimationFrame(animateCursor)
    }

    const handleMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      const hoveredElement = document.elementFromPoint(e.clientX, e.clientY)
      const magnetoElement = hoveredElement?.closest('.magneto-wrapper')
      if (magnetoElement) {
        cursor.classList.add('cursor-magnify')
        const rect = magnetoElement.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const deltaX = (e.clientX - centerX) * 0.3
        const deltaY = (e.clientY - centerY) * 0.3
        magnetoElement.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.05)`
        magnetoElement.classList.add('magneto-active')
      } else {
        cursor.classList.remove('cursor-magnify')
        document.querySelectorAll('.magneto-wrapper').forEach(el => {
          el.style.transform = 'translate(0px, 0px) scale(1)'
          el.classList.remove('magneto-active')
        })
      }
    }

    const handleMouseLeave = () => {
      cursor.classList.remove('cursor-magnify')
      document.querySelectorAll('.magneto-wrapper').forEach(el => {
        el.style.transform = 'translate(0px, 0px) scale(1)'
        el.classList.remove('magneto-active')
      })
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    animateCursor()

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }

  const handleEventHover = (event, mouseEvent) => {
    setHoveredEvent(event)
    updateImagePosition(mouseEvent)
  }

  const handleEventLeave = () => {
    setHoveredEvent(null)
  }

  const updateImagePosition = (mouseEvent) => {
    if (mouseEvent) {
      setImagePosition({
        x: mouseEvent.clientX,
        y: mouseEvent.clientY
      })
    }
  }

  const handleMouseMove = (event, mouseEvent) => {
    if (hoveredEvent && hoveredEvent.id === event.id) {
      updateImagePosition(mouseEvent)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return {
      day: String(date.getDate()).padStart(2, '0'),
      month: String(date.getMonth() + 1).padStart(2, '0'),
      year: String(date.getFullYear()).slice(-2)
    }
  }

  const isMobile = windowWidth <= 768;
  const topPadding = isMobile ? '140px' : '110px';

  return (
    <>
      <Head>
        <title>Dates - R&B Versus Live</title>
        <meta name="description" content="Upcoming R&B Versus Live events and dates" />
      </Head>

      {/* Custom Cursor */}
      <div ref={cursorRef} className="custom-cursor">
        <div className="cursor-inner"></div>
      </div>

      {/* Event Image Popup */}
      {hoveredEvent && (
        <div 
          ref={imageRef}
          className="event-image-popup"
          style={{
            left: imagePosition.x + 20,
            top: imagePosition.y - 150,
          }}
        >
          <div className="image-container">
            <img 
              src={hoveredEvent.image_url || '/images/default-event.jpg'} 
              alt={hoveredEvent.title}
              onError={(e) => {
                e.target.src = '/images/default-event.jpg'
              }}
            />
            <div className="image-overlay">
              <span className="image-title">{hoveredEvent.title}</span>
            </div>
          </div>
        </div>
      )}

      <div className="dates-page-layout" style={{ paddingTop: topPadding }}>
        {/* Background */}
        <div className="dates-background"></div>
        
        {/* Main Content */}
        <div className="dates-main-content">
          {isLoading && (
            <div className="dates-loading">
              <div className="loading-text">Loading events...</div>
            </div>
          )}

          {error && (
            <div className="dates-error">
              <p>{error.message || error}</p>
            </div>
          )}

          {!isLoading && !error && (
            <div className="events-list">
              {events.map((event, index) => {
                const dateFormatted = formatDate(event.date)
                return (
                  <Link 
                    href={`/dates/${event.id}`} 
                    key={event.id}
                    className="event-item-link"
                  >
                    <div
                      className="event-item magneto-wrapper"
                      ref={(el) => {
                        if (el && observerRef.current) {
                          observerRef.current.observe(el)
                        }
                      }}
                      style={{ animationDelay: `${index * 0.1}s` }}
                      onMouseEnter={(e) => handleEventHover(event, e)}
                      onMouseLeave={handleEventLeave}
                      onMouseMove={(e) => handleMouseMove(event, e)}
                    >
                      <div className="event-date">
                        <span className="date-text">
                          {dateFormatted.day}.{dateFormatted.month}.{dateFormatted.year}
                        </span>
                      </div>
                      
                      <div className="event-location">
                        <span className="location-text">{event.location}</span>
                      </div>
                      
                      <div className="event-details">
                        <h2 className="event-title">{event.title}</h2>
                      </div>
                    </div>
                  </Link>
                )
              })}
              
              {events.length === 0 && !isLoading && (
                <div className="no-events">
                  <p>No upcoming events at the moment.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}