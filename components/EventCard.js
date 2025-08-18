import { useRouter } from 'next/router';
import Image from 'next/image';
import { useState } from 'react'

export default function EventCard({ event }) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const handleTicketClick = (e) => {
    if (event.ticket_link) {
      e.preventDefault()
      window.open(event.ticket_link, '_blank', 'noopener,noreferrer')
    }
  }

  const getImageSrc = () => {
    if (imageError || !event.image) {
      return '/images/event-placeholder.jpg'
    }
    
    // Handle both full URLs and local paths
    if (event.image.startsWith('http')) {
      return event.image
    }
    
    return event.image.startsWith('/') ? event.image : `/media/${event.image}`
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const formatPrice = (cents) => {
    return `$${(cents / 100).toFixed(2)}`;
  };
  
  const handleClick = () => {
    router.push(`/events/${event.id}`);
  };
  
  const ticketsRemaining = event.tickets_remaining;
  const soldOutPercentage = 100 - Math.round((ticketsRemaining / event.total_tickets) * 100);

  return (
    <article className="event-card">
      <div className="event-card-inner" onClick={handleClick}>
        
        {/* Event Image */}
        <div className="event-image-container">
          <div className="event-image-wrapper">
            {imageLoading && (
              <div className="image-skeleton">
                <div className="skeleton-shimmer"></div>
              </div>
            )}
            
            <Image
              src={getImageSrc()}
              alt={event.title}
              fill
              className={`event-image ${imageLoading ? 'loading' : 'loaded'}`}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageError(true)
                setImageLoading(false)
              }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            <div className="event-image-overlay"></div>
          </div>

          {/* Date Badge */}
          <div className="event-date-badge">
            <div className="date-month">{dateFormatted.month}</div>
            <div className="date-day">{dateFormatted.day}</div>
            <div className="date-year">{dateFormatted.year}</div>
          </div>

          {/* Hover Overlay */}
          <div className="event-hover-overlay">
            <div className="hover-content">
              <span className="hover-icon">🎵</span>
              <span className="hover-text">View Details</span>
            </div>
          </div>
        </div>

        {/* Event Content */}
        <div className="event-content">
          
          {/* Event Info */}
          <div className="event-info">
            <div className="event-date-text">
              <span className="event-weekday">{dateFormatted.weekday}</span>
              <span className="event-time">8:00 PM</span>
            </div>
            
            <h3 className="event-title">{event.title}</h3>
            
            <div className="event-location">
              <span className="location-icon">📍</span>
              <span className="location-text">{event.location}</span>
            </div>

            {event.description && (
              <p className="event-description">
                {event.description.length > 120 
                  ? `${event.description.substring(0, 120)}...`
                  : event.description
                }
              </p>
            )}
          </div>

          {/* Event Actions */}
          <div className="event-actions">
            {event.ticket_link ? (
              <button 
                onClick={handleTicketClick}
                className="ticket-btn primary"
              >
                <span className="btn-text">Get Tickets</span>
                <span className="btn-icon">🎫</span>
              </button>
            ) : (
              <button className="ticket-btn disabled" disabled>
                <span className="btn-text">Coming Soon</span>
                <span className="btn-icon">⏰</span>
              </button>
            )}
            
            <Link href={`/events/${event.id}`} className="details-btn">
              <span>More Info</span>
              <span className="arrow">→</span>
            </Link>
          </div>

          {/* Event Tags */}
          <div className="event-tags">
            <span className="event-tag live">LIVE</span>
            <span className="event-tag battle">BATTLE</span>
            <span className="event-tag rnb">R&B</span>
          </div>
        </div>
      </div>

      {/* Card Glow Effect */}
      <div className="card-glow-effect"></div>
    </article>
  )
}
