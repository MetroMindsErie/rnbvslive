import { supabase } from '../../../lib/supabase';
import { sendTicketConfirmationEmail, sendTicketConfirmationSMS } from '../../../lib/notifications';
import { createTicketPurchase } from '../../../lib/ticketService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { eventId, email, phone, fullName, quantity = 1 } = req.body;
  
  try {
    // 1. Get event details
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();
    
    if (eventError) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    // 2. Check if tickets are available
    if (event.tickets_remaining < quantity) {
      return res.status(400).json({ error: 'Not enough tickets available' });
    }
    
    // 3. Create the ticket purchase directly
    const purchaseData = {
      fullName,
      email,
      phoneNumber: phone,
      totalAmount: event.ticket_price * quantity
    };
    
    const { purchase, tickets } = await createTicketPurchase(purchaseData, eventId, quantity);
    
    // 4. Update the tickets_remaining count
    await supabase
      .from('events')
      .update({ tickets_remaining: event.tickets_remaining - quantity })
      .eq('id', eventId);
    
    // 5. Send confirmation notifications
    try {
      await sendTicketConfirmationEmail(email, { purchase, tickets, event });
      if (phone) {
        await sendTicketConfirmationSMS(phone, { purchase, event });
      }
    } catch (notificationError) {
      console.error('Error sending notifications:', notificationError);
      // Continue even if notifications fail
    }
    
    return res.status(200).json({ 
      success: true, 
      purchase,
      tickets,
      redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/tickets/confirmation?purchase_id=${purchase.id}`
    });
  } catch (error) {
    console.error('Error in ticket purchase:', error);
    return res.status(500).json({ error: error.message });
  }
}

