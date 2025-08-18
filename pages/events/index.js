import { useState, useEffect } from 'react';
import Head from 'next/head';
import { supabase } from '../../lib/supabase'
import EventCard from '../../components/EventCard';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('event_date', { ascending: true });
          
        if (error) throw error;
        
        setEvents(data);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchEvents();
  }, []);
  
  // Filter for upcoming events
  const upcomingEvents = events.filter(event => new Date(event.event_date) > new Date());
  
  return (
    <>
      <Head>
        <title>Upcoming Events | RNB Versus Live</title>
        <meta name="description" content="View and purchase tickets for upcoming RNB Versus Live events." />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Upcoming Events</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading events...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <p>{error}</p>
          </div>
        ) : upcomingEvents.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-600">No upcoming events at this time. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
