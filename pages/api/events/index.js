import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });
        
      if (error) throw error;
      
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'POST') {
    // Only admin should be able to create events
    try {
      const { user, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      // You would need to check if user is admin here
      // For simplicity, we're not implementing the full admin check
      
      const eventData = req.body;
      
      // Ensure tickets_remaining is set to total_tickets initially
      eventData.tickets_remaining = eventData.total_tickets;
      
      const { data, error } = await supabase
        .from('events')
        .insert([eventData])
        .select();
        
      if (error) throw error;
      
      return res.status(201).json(data[0]);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
