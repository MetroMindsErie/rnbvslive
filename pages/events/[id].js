import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { supabase } from '../../lib/supabase/client'
import TicketPurchaseForm from '../../components/TicketPurchaseForm';

export default function EventDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchEventDetails() {
      if (!id) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        setEvent(data);
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError('Failed to load event details. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchEventDetails();
  }, [id]);
  
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
        <p className="text-gray-500">Loading event details...</p>
      </div>
    );
  }
  
  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <p>{error || 'Event not found'}</p>
          <button
            className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            onClick={() => router.push('/events')}
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>{event.title} | RNB Versus Live</title>
        <meta name="description" content={event.description} />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <button
          className="mb-6 inline-flex items-center text-gray-600 hover:text-black"
          onClick={() => router.push('/events')}
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
          </svg>
          Back to Events
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative w-full h-64 md:h-96 mb-6">
              {event.image_url ? (
                <Image 
                  src={event.image_url}
                  alt={event.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
            </div>
            
            <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
            
            <div className="mb-6">
              <div className="flex items-start mb-2">
                <svg className="w-5 h-5 text-gray-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formatDate(event.event_date)}</span>
              </div>
              
              <div className="flex items-start mb-2">
                <svg className="w-5 h-5 text-gray-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{event.venue}</span>
              </div>
            </div>
            
            <div className="prose max-w-none">
              <h2 className="text-xl font-bold mb-2">About This Event</h2>
              <p className="whitespace-pre-line">{event.description}</p>
            </div>
          </div>
          
          <div>
            <TicketPurchaseForm event={event} />
          </div>
        </div>
      </div>
    </>
  );
}
