import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';
import { generateAndStoreQRCode } from '../utils/qrGenerator';

/**
 * Create a ticket purchase record with associated tickets
 * @param {Object} purchaseData - Purchase data including customer info
 * @param {string} eventId - Event ID
 * @param {number} quantity - Number of tickets
 * @returns {Promise<Object>} - Created purchase record and tickets
 */
export async function createTicketPurchase(purchaseData, eventId, quantity) {
  try {
    // Generate a unique purchase ID
    const purchaseId = uuidv4();
    
    // Get the event details
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();
    
    if (eventError) throw new Error('Event not found');
    
    // Calculate expiration time (24 hours after event)
    const eventDate = new Date(eventData.date);
    const expirationDate = new Date(eventDate.getTime() + 24 * 60 * 60 * 1000);
    
    // Create the purchase record
    const { data: purchase, error: purchaseError } = await supabase
      .from('ticket_purchases')
      .insert([
        {
          id: purchaseId,
          event_id: eventId,
          customer_name: purchaseData.fullName,
          customer_email: purchaseData.email,
          customer_phone: purchaseData.phoneNumber,
          ticket_quantity: quantity,
          total_amount: purchaseData.totalAmount,
          purchase_date: new Date().toISOString(),
          expiration_date: expirationDate.toISOString(),
          status: 'confirmed'
        }
      ])
      .select()
      .single();
    
    if (purchaseError) throw purchaseError;
    
    // Generate individual tickets with QR codes
    const ticketPromises = Array.from({ length: quantity }, async (_, i) => {
      const ticketId = uuidv4();
      const seatLabel = `SEAT${i+1}`;
      
      // Generate QR code for this ticket
      const qrCodeUrl = await generateAndStoreQRCode(eventId, ticketId, {
        purchaseId,
        customerName: purchaseData.fullName,
        seat: seatLabel
      });
      
      // Insert ticket record
      const { data: ticket, error: ticketError } = await supabase
        .from('tickets')
        .insert([
          {
            id: ticketId,
            purchase_id: purchaseId,
            event_id: eventId,
            seat_label: seatLabel,
            qr_code_url: qrCodeUrl,
            status: 'valid',
            checked_in: false
          }
        ])
        .select()
        .single();
      
      if (ticketError) throw ticketError;
      
      return ticket;
    });
    
    const tickets = await Promise.all(ticketPromises);
    
    return { purchase, tickets };
  } catch (error) {
    console.error('Error creating ticket purchase:', error);
    throw error;
  }
}

/**
 * Verify a ticket by its ID
 * @param {string} ticketId - Ticket ID to verify
 * @returns {Promise<Object>} - Ticket verification result
 */
export async function verifyTicket(ticketId) {
  try {
    // Get the ticket with purchase and event details
    const { data: ticket, error } = await supabase
      .from('tickets')
      .select(`
        *,
        ticket_purchases(*),
        events(*)
      `)
      .eq('id', ticketId)
      .single();
    
    if (error) throw error;
    
    if (!ticket) {
      return {
        valid: false,
        message: 'Ticket not found',
        ticket: null
      };
    }
    
    // Check if ticket is valid
    if (ticket.status !== 'valid') {
      return {
        valid: false,
        message: `Ticket is ${ticket.status}`,
        ticket
      };
    }
    
    // Check if ticket is already checked in
    if (ticket.checked_in) {
      return {
        valid: false,
        message: 'Ticket has already been used',
        ticket
      };
    }
    
    // Check if event date has passed
    const eventDate = new Date(ticket.events.date);
    const now = new Date();
    const oneDayAfter = new Date(eventDate.getTime() + 24 * 60 * 60 * 1000);
    
    if (now > oneDayAfter) {
      return {
        valid: false,
        message: 'Event has already passed',
        ticket
      };
    }
    
    // Mark ticket as checked in
    const { error: updateError } = await supabase
      .from('tickets')
      .update({ 
        checked_in: true,
        check_in_time: new Date().toISOString()
      })
      .eq('id', ticketId);
    
    if (updateError) throw updateError;
    
    return {
      valid: true,
      message: 'Ticket is valid',
      ticket: {
        ...ticket,
        checked_in: true,
        check_in_time: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error verifying ticket:', error);
    return {
      valid: false,
      message: 'Error verifying ticket',
      error: error.message
    };
  }
}

/**
 * Get tickets for a purchase
 * @param {string} purchaseId - Purchase ID
 * @returns {Promise<Array>} - Array of tickets
 */
export async function getTicketsForPurchase(purchaseId) {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('purchase_id', purchaseId);
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return [];
  }
}
