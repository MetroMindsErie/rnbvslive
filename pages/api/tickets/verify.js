import { supabase } from '../../../lib/supabase';
import { verifyTicketQR } from '../../../lib/qrcode';
import { verifyTicket } from '../../../lib/ticketService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { qrData } = req.body;
    
    if (!qrData) {
      return res.status(400).json({ message: 'Missing QR data' });
    }
    
    // Extract ticket ID from QR data
    // Expected format: https://rnbvslive.com/tickets/verify?event=EVENT_ID&ticket=TICKET_ID
    const url = new URL(qrData);
    const ticketId = url.searchParams.get('ticket');
    
    if (!ticketId) {
      return res.status(400).json({ message: 'Invalid QR code format' });
    }
    
    // Verify the ticket
    const verificationResult = await verifyTicket(ticketId);
    
    return res.status(verificationResult.valid ? 200 : 400).json(verificationResult);
  } catch (error) {
    console.error('Error verifying ticket:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

