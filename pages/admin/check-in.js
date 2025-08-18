import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabase';
import QRScanner from '../../components/QRScanner';

export default function CheckInPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [checkedInCount, setCheckedInCount] = useState(0);
  const [totalTickets, setTotalTickets] = useState(0);
  
  // Auth check
  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login?redirect=/admin/check-in');
        return;
      }
      
      setUser(user);
      
      // Here you would normally check if the user is an admin
      // For simplicity, we're allowing any authenticated user
      
      setLoading(false);
    }
    
    checkAuth();
  }, [router]);
  
  // Fetch events
  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });
        
      if (!error && data) {
        setEvents(data);
        
        // Auto-select the first event if none is selected
        if (data.length > 0 && !selectedEvent) {
          setSelectedEvent(data[0].id);
        }
      }
    }
    
    if (user) {
      fetchEvents();
    }
  }, [user, selectedEvent]);
  
  // Fetch check-in stats when event is selected
  useEffect(() => {
    async function fetchCheckInStats() {
      if (!selectedEvent) return;
      
      const { data: ticketsData, error: ticketsError } = await supabase
        .from('tickets')
        .select('status')
        .eq('event_id', selectedEvent);
        
      if (!ticketsError && ticketsData) {
        const checkedIn = ticketsData.filter(t => t.status === 'used').length;
        setCheckedInCount(checkedIn);
        setTotalTickets(ticketsData.length);
      }
    }
    
    if (selectedEvent) {
      fetchCheckInStats();
    }
  }, [selectedEvent]);
  
  const handleEventChange = (e) => {
    setSelectedEvent(e.target.value);
  };
  
  const handleScanSuccess = (data) => {
    // Update the check-in count
    setCheckedInCount(prev => prev + 1);
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>Ticket Check-In | RNB Versus Live</title>
        <meta name="description" content="Admin ticket check-in tool" />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Ticket Check-In</h1>
          
          <div className="mb-8">
            <label htmlFor="event" className="block text-sm font-medium text-gray-700 mb-1">
              Select Event
            </label>
            <select
              id="event"
              value={selectedEvent}
              onChange={handleEventChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              {events.map(event => (
                <option key={event.id} value={event.id}>
                  {event.title} - {new Date(event.event_date).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
          
          {selectedEvent && (
            <>
              <div className="bg-white p-4 rounded-lg border border-gray-300 mb-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-100 rounded">
                    <p className="text-gray-600 text-sm">Checked In</p>
                    <p className="text-3xl font-bold">{checkedInCount}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-100 rounded">
                    <p className="text-gray-600 text-sm">Total Tickets</p>
                    <p className="text-3xl font-bold">{totalTickets}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-300">
                <h2 className="text-xl font-bold mb-4 text-center">Scan Ticket QR Code</h2>
                <QRScanner onScanSuccess={handleScanSuccess} />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
