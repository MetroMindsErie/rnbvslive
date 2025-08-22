import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import useSupabaseSWR from '../../lib/supabase/useSupabaseSWR'

export default function TicketConfirmationPage() {
  const router = useRouter();
  const { session_id } = router.query;

  // Fetch tickets for this session_id (order_id)
  const { data: tickets = [], error: ticketsError, isLoading } = useSupabaseSWR(
    session_id ? ['tickets', session_id] : null,
    session_id
      ? {
          table: 'tickets',
          filter: { column: 'order_id', value: session_id }
          // Remove select parameter to troubleshoot
        }
      : {}
  );

  // Get event from first ticket if available
  const event = tickets.length > 0 ? tickets[0].events : null;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <p className="text-gray-500">Loading your ticket information...</p>
      </div>
    );
  }

  if (ticketsError || !tickets.length || !event) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
          <p className="font-bold">Ticket Information Unavailable</p>
          <p className="mt-2">{ticketsError?.message || 'Your ticket information could not be displayed.'}</p>
          <p className="mt-2">Don't worry! If your payment was successful, you should receive an email with your ticket details.</p>
        </div>
        <div className="mt-6 text-center">
          <Link href="/events">
            <a className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800">
              Browse More Events
            </a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Ticket Confirmation | RNB Versus Live</title>
        <meta name="description" content="Your ticket purchase has been confirmed!" />
      </Head>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg border border-gray-300">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2">Thank You!</h1>
            <p className="text-gray-600">Your ticket purchase has been confirmed.</p>
          </div>
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Event Details</h2>
            <div className="flex flex-col md:flex-row items-start md:items-center mb-4">
              {event.image_url && (
                <div className="w-full md:w-24 h-24 relative mb-4 md:mb-0 md:mr-4">
                  <Image 
                    src={event.image_url}
                    alt={event.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded"
                  />
                </div>
              )}
              <div>
                <h3 className="font-bold text-lg">{event.title}</h3>
                <p className="text-gray-600">{formatDate(event.event_date)}</p>
                <p className="text-gray-600">{event.venue}</p>
              </div>
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Your Tickets ({tickets.length})</h2>
            <p className="mb-4">An email has been sent to <strong>{tickets[0].buyer_email}</strong> with your ticket details and QR codes for check-in.</p>
            <div className="space-y-4">
              {tickets.map((ticket, index) => (
                <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
                  <p className="font-medium">Ticket #{index + 1}</p>
                  <p className="text-sm text-gray-600">Ticket ID: {ticket.id}</p>
                  {ticket.qr_code_url && (
                    <div className="mt-2 flex justify-center">
                      <div className="w-32 h-32 relative">
                        <Image 
                          src={ticket.qr_code_url}
                          alt="Ticket QR Code"
                          layout="fill"
                          objectFit="contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="text-center">
            <Link href="/events">
              <a className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800">
                Browse More Events
              </a>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}