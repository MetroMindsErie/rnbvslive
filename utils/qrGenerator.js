import QRCode from 'qrcode';
import { supabase } from '../lib/supabase/client';

/**
 * Generate a QR code for a ticket and store it in Supabase
 * @param {string} eventId - The event ID
 * @param {string} ticketId - The ticket ID
 * @param {Object} ticketData - The ticket data
 * @returns {Promise<string>} - The URL of the stored QR code
 */
export async function generateAndStoreQRCode(eventId, ticketId, ticketData) {
  try {
    // Create the verification URL
    const verificationUrl = getTicketUrl(eventId, ticketId);
    
    // Generate QR code as data URL
    const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
      width: 300,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff',
      }
    });
    
    // Define storage path for the QR code
    const bucketName = 'tickets';
    const filePath = `qr-codes/event-${eventId}-${ticketId}.png`;
    
    // Convert data URL to blob
    const base64Data = qrDataUrl.split(',')[1];
    const blob = Buffer.from(base64Data, 'base64');
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, blob, {
        contentType: 'image/png',
        upsert: true
      });
    
    if (error) {
      console.error('QR code upload error:', error);
      // Fallback to a public API QR code URL if storage fails
      return getPublicQRUrl(verificationUrl);
    }
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
    
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('QR code generation error:', error);
    // Fallback to a public API QR code URL
    return getPublicQRUrl(ticketId);
  }
}

/**
 * Get a verification URL for a ticket
 * @param {string} eventId - The event ID
 * @param {string} ticketId - The ticket ID
 * @returns {string} - The verification URL
 */
export function getTicketUrl(eventId, ticketId) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://rnbvslive.com';
  return `${baseUrl}/tickets/verify?event=${eventId}&ticket=${ticketId}`;
}

/**
 * Get a public QR code URL using an API (fallback method)
 * @param {string} data - The data to encode in the QR code
 * @param {number} size - The size of the QR code
 * @returns {string} - The QR code URL
 */
export function getPublicQRUrl(data, size = 300) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;
}

/**
 * Get the stored QR code path for a ticket
 * @param {string} eventId - The event ID
 * @param {string} ticketId - The ticket ID
 * @returns {string} - The QR code path
 */
export function getQRCodePath(eventId, ticketId) {
  try {
    const { data } = supabase.storage
      .from('tickets')
      .getPublicUrl(`qr-codes/event-${eventId}-${ticketId}.png`);
    
    return data.publicUrl;
  } catch (error) {
    console.error('Error getting QR code path:', error);
    // Fallback to public API
    return getPublicQRUrl(getTicketUrl(eventId, ticketId));
  }
}
