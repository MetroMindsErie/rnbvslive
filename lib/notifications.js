import sgMail from '@sendgrid/mail';
import twilio from 'twilio';

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Initialize Twilio
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendTicketConfirmationEmail(ticket, event, qrCodeUrl) {
  const msg = {
    to: ticket.buyer_email,
    from: 'tickets@rnbversuslive.net',
    subject: `Your Ticket for ${event.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #000; background-color: #fff; padding: 20px; border: 1px solid #000;">
        <h1 style="text-align: center; text-transform: uppercase;">RNB VERSUS LIVE</h1>
        <h2 style="text-align: center;">Ticket Confirmation</h2>
        <p>Thank you for purchasing a ticket to ${event.title}!</p>
        <div style="margin: 20px 0; padding: 15px; border: 1px solid #000; background-color: #f8f8f8;">
          <p><strong>Event:</strong> ${event.title}</p>
          <p><strong>Date:</strong> ${new Date(event.event_date).toLocaleString()}</p>
          <p><strong>Venue:</strong> ${event.venue}</p>
          <p><strong>Ticket ID:</strong> ${ticket.id}</p>
          <p><strong>Order ID:</strong> ${ticket.order_id}</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <p><strong>Your Ticket QR Code</strong></p>
          <img src="${qrCodeUrl}" alt="Ticket QR Code" style="max-width: 200px; height: auto;"/>
          <p style="font-size: 12px; margin-top: 10px;">Present this QR code at the venue for entry</p>
        </div>
        <p style="text-align: center; margin-top: 30px; font-size: 12px;">
          This ticket is non-transferable and valid for one-time entry only.
        </p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent to ${ticket.buyer_email}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export async function sendTicketConfirmationSMS(ticket, event) {
  if (!ticket.buyer_phone) return false;

  try {
    const message = await twilioClient.messages.create({
      body: `RNB VERSUS LIVE: Your ticket for ${event.title} is confirmed! Event date: ${new Date(event.event_date).toLocaleString()}. Check your email for the QR code. Order ID: ${ticket.order_id}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: ticket.buyer_phone
    });
    
    console.log(`SMS sent with SID: ${message.sid}`);
    return true;
  } catch (error) {
    console.error('Error sending SMS:', error);
    return false;
  }
}
