import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

export default function TicketConfirmationPage() {
  const router = useRouter();
  const { session_id } = router.query;
  
  const [tickets, setTickets] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchTicketDetails() {
      if (!session_id) return;
      
      try {
        setLoading(true);
        
        // Query tickets by the Stripe order ID (which is stored in the order_id column)
        const { data: ticketsData, error: ticketsError } = await supabase
          .from('tickets')
          .select('*, events(*)')
          .eq('order_id', session_id);
          
        if (ticketsError) throw ticketsError;
        
        if (ticketsData && ticketsData.length > 0) {
          setTickets(ticketsData);
          setEvent(ticketsData[0].events);
        } else {
          throw new Error('No tickets found for this purchase');
        }
      } catch (err) {
        console.error('Error fetching ticket details:', err);
        setError('Failed to load ticket details. Please check your email for confirmation or contact support.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchTicketDetails();
  }, [session_id]);
  
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
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <p className="text-gray-500">Loading your ticket information...</p>
      </div>
    );
  }
  
  if (error || !tickets.length || !event) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
          <p className="font-bold">Ticket Information Unavailable</p>
          <p className="mt-2">{error || 'Your ticket information could not be displayed.'}</p>
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
            
            {/* If you want to display the QR codes here as well */}
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
