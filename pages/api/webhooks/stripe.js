import { buffer } from 'micro';
import Stripe from 'stripe';
import { supabase } from '../../../lib/supabase';
import { generateTicketQR } from '../../../lib/qrcode';
import { sendTicketConfirmationEmail, sendTicketConfirmationSMS } from '../../../lib/notifications';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    try {
      // Extract details from the session
      const { eventId, email, phone, quantity } = session.metadata;
      const orderId = session.payment_intent;
      
      // Get the user if they're logged in
      let userId = null;
      
      if (session.customer) {
        // Try to find user by email
        const { data: userData } = await supabase
          .from('users')
          .select('id')
          .eq('email', email)
          .single();
          
        if (userData) {
          userId = userData.id;
        }
      }
      
      // Get event details
      const { data: event } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();
      
      // Create tickets (one for each quantity)
      const ticketPromises = [];
      
      for (let i = 0; i < parseInt(quantity); i++) {
        // Call the RPC function to purchase a ticket
        const { data: ticketId, error } = await supabase.rpc(
          'purchase_ticket',
          {
            p_event_id: eventId,
            p_user_id: userId,
            p_order_id: orderId,
            p_buyer_email: email,
            p_buyer_phone: phone
          }
        );
        
        if (error) throw error;
        
        // Generate QR code for this ticket
        const qrCodeUrl = await generateTicketQR(ticketId, eventId);
        
        // Get the ticket details
        const { data: ticket } = await supabase
          .from('tickets')
          .select('*')
          .eq('id', ticketId)
          .single();
        
        // Send confirmation
        await sendTicketConfirmationEmail(ticket, event, qrCodeUrl);
        if (phone) {
          await sendTicketConfirmationSMS(ticket, event);
        }
        
        ticketPromises.push(ticketId);
      }
      
      await Promise.all(ticketPromises);
      
      res.status(200).json({ received: true });
    } catch (error) {
      console.error('Error processing successful payment:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(200).json({ received: true });
  }
}
