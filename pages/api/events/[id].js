import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  const { id } = req.query;
  
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ error: 'Event not found' });
        }
        throw error;
      }
      
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'PUT') {
    // Only admin should be able to update events
    try {
      const { user, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      // You would need to check if user is admin here
      
      const { data, error } = await supabase
        .from('events')
        .update(req.body)
        .eq('id', id)
        .select();
        
      if (error) throw error;
      
      return res.status(200).json(data[0]);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'DELETE') {
    // Only admin should be able to delete events
    try {
      const { user, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      // You would need to check if user is admin here
      
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
