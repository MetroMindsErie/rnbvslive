import { v4 as uuidv4 } from 'uuid';
import Stripe from 'stripe';
import { supabase } from '../../../lib/supabaseClient';
import { generateTicketQR } from '../../../lib/qrcode';
import { sendTicketConfirmationEmail, sendTicketConfirmationSMS } from '../../../lib/notifications';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { eventId, email, phone, quantity = 1 } = req.body;
  
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
    
    // 3. Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Ticket for ${event.title}`,
              description: event.description,
              images: event.image_url ? [event.image_url] : [],
            },
            unit_amount: event.ticket_price,
          },
          quantity,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/tickets/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/events/${eventId}`,
      client_reference_id: eventId,
      customer_email: email,
      metadata: {
        eventId,
        email,
        phone,
        quantity
      }
    });
    
    return res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error in ticket purchase:', error);
    return res.status(500).json({ error: error.message });
  }
}
