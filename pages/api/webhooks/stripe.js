import { supabase } from '../../../lib/supabase';
import { generateTicketQR } from '../../../lib/qrcode';
import { sendTicketConfirmationEmail, sendTicketConfirmationSMS } from '../../../lib/notifications';
import { createTicketPurchase } from '../../../lib/ticketService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { eventId, email, phone, fullName, quantity, orderId, userId } = req.body;

  if (!eventId || !email || !quantity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Get event details
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();
    
    if (eventError) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    // Check if tickets are available
    if (event.tickets_remaining < quantity) {
      return res.status(400).json({ error: 'Not enough tickets available' });
    }
    
    // Create the ticket purchase
    const purchaseData = {
      fullName,
      email,
      phoneNumber: phone,
      totalAmount: event.ticket_price * quantity,
      orderId
    };
    
    const { purchase, tickets } = await createTicketPurchase(purchaseData, eventId, quantity);
    
    // Update the tickets_remaining count
    await supabase
      .from('events')
      .update({ tickets_remaining: event.tickets_remaining - quantity })
      .eq('id', eventId);
    
    // Associate tickets with user if provided
    if (userId) {
      await supabase
        .from('ticket_purchases')
        .update({ user_id: userId })
        .eq('id', purchase.id);
    }
    
    // Send confirmations
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
      tickets
    });
  } catch (error) {
    console.error('Error processing ticket creation:', error);
    return res.status(500).json({ error: error.message });
  }
}
      