import QRCode from 'qrcode';
import { supabase } from './supabaseClient';

export async function generateTicketQR(ticketId, eventId) {
  try {
    // Create a unique verification string
    const verificationString = `${ticketId}_${eventId}_${Date.now()}`;
    
    // Generate QR code as data URL
    const qrDataUrl = await QRCode.toDataURL(verificationString);
    
    // Convert data URL to blob
    const base64Data = qrDataUrl.split(',')[1];
    const blob = Buffer.from(base64Data, 'base64');
    
    // Upload to Supabase Storage
    const filePath = `ticket-qr/${ticketId}.png`;
    const { data, error } = await supabase.storage
      .from('tickets')
      .upload(filePath, blob, {
        contentType: 'image/png',
        upsert: true
      });
    
    if (error) throw error;
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('tickets')
      .getPublicUrl(filePath);
    
    // Update ticket with QR code URL
    const { error: updateError } = await supabase
      .from('tickets')
      .update({ qr_code_url: urlData.publicUrl })
      .eq('id', ticketId);
    
    if (updateError) throw updateError;
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}

export async function verifyTicketQR(qrData) {
  try {
    // Extract ticket ID from QR data
    const ticketId = qrData.split('_')[0];
    
    // Get ticket info
    const { data: ticket, error } = await supabase
      .from('tickets')
      .select('*, events(*)')
      .eq('id', ticketId)
      .single();
    
    if (error) throw error;
    
    // Check if ticket is valid
    if (ticket.status !== 'valid') {
      return {
        valid: false,
        message: `Ticket is ${ticket.status}`,
        ticket: null
      };
    }
    
    return {
      valid: true,
      message: 'Ticket is valid',
      ticket
    };
  } catch (error) {
    console.error('Error verifying QR code:', error);
    return {
      valid: false,
      message: 'Invalid QR code',
      ticket: null
    };
  }
}
