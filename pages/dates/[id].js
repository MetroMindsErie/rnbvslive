import { useRouter } from 'next/router'
import useSupabaseSWR from '../../lib/supabase/useSupabaseSWR'
import Head from 'next/head'
import Link from 'next/link'
import SocialShare from '../../components/SocialShare'

export default function EventDetail() {
    const router = useRouter()
    const { id } = router.query

    const { data: event, error, isLoading } = useSupabaseSWR(
        id ? ['events', id] : null,
        id
            ? {
                table: 'events',
                filter: { column: 'id', value: id },
                single: true
                // Remove select parameter to simplify
            }
            : {}
    )

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return {
            day: String(date.getDate()).padStart(2, '0'),
            month: String(date.getMonth() + 1).padStart(2, '0'),
            year: String(date.getFullYear()).slice(-2)
        }
    }

    const formatTime = (timeString) => {
        if (!timeString) return '9:00 PM'
        return timeString
    }

    const handleBuyTickets = () => {
        if (event) {
            localStorage.setItem('ticketPurchase', JSON.stringify({
                eventId: event.id,
                eventTitle: event.title,
                eventDate: event.date,
                eventTime: formatTime(event.time),
                eventVenue: event.venue || event.location,
                eventImageUrl: event.image_url
            }));
            router.push(`/checkout/${event.id}`);
        }
    }

    if (isLoading) {
        return (
            <div className="event-detail-loading">
                <div className="loading-text">Loading event...</div>
            </div>
        )
    }

    if (error || !event) {
        return (
            <div className="event-detail-error">
                <h1>Event Not Found</h1>
                <Link href="/dates" className="back-link">← Back to Dates</Link>
            </div>
        )
    }

    const dateFormatted = formatDate(event.date)

    return (
        <>
            <Head>
                <title>{event.title} - R&B Versus Live</title>
                <meta name="description" content={event.description || `Join us for ${event.title}`} />
            </Head>
            <div className="min-h-screen bg-[#1a1a1a] text-white w-full overflow-x-hidden">
                <div
                    className="event-detail-container"
                    data-event-date={`${dateFormatted.day}.${dateFormatted.month}`}
                >
                    {/* Left side - Event Image */}
                    <div className="event-image-section">
                        <div className="event-image-container">
                            <img
                                src={event.image_url || '/images/default-event.jpg'}
                                alt={event.title}
                                className="event-detail-image"
                                onError={(e) => {
                                    e.target.src = '/images/default-event.jpg'
                                }}
                            />
                        </div>
                    </div>

                    {/* Right side - Event Details */}
                    <div className="event-content-section">
                        <div className="event-header">
                            <h1 className="event-main-title">{event.title}</h1>
                        </div>

                        <div
                            className="event-description-text"
                            dangerouslySetInnerHTML={{ __html: event.description }}
                        />

                        <div className="event-details-grid">
                            <div className="detail-row">
                                <span className="detail-label">Date</span>
                                <span className="detail-value">{dateFormatted.day}.{dateFormatted.month}.{dateFormatted.year}</span>
                            </div>

                            <div className="detail-row">
                                <span className="detail-label">Time</span>
                                <span className="detail-value">{formatTime(event.time)}</span>
                            </div>

                            <div className="detail-row">
                                <span className="detail-label">Venue</span>
                                <span className="detail-value">{event.venue || event.location}</span>
                            </div>

                            <div className="detail-row">
                                <span className="detail-label">Address</span>
                                <span className="detail-value">{event.address || event.location}</span>
                            </div>
                        </div>

                        <div className="event-actions">
                            <button 
                                className="buy-tickets-btn"
                                onClick={handleBuyTickets}
                            >
                                Buy Tickets
                            </button>
                        </div>

                        <SocialShare
                            title={`${event.title} - R&B Versus Live`}
                            description={event.description || `Join us for ${event.title} at ${event.location}`}
                            className="event-social-share"
                            size="md"
                            variant="default"
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
