import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, name, eventTitle, eventDate, tickets } = req.body;

    if (!email || !name || !eventTitle || !eventDate || !tickets) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Configure email transporter
        // Note: In production, use environment variables for these credentials
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.example.com',
            port: process.env.EMAIL_PORT || 587,
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER || 'your-email@example.com',
                pass: process.env.EMAIL_PASSWORD || 'your-password'
            }
        });

        // Format event date
        const formattedDate = new Date(eventDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Create HTML email content
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #e91e63; margin-bottom: 5px;">Your Tickets Are Confirmed!</h1>
                    <p style="font-size: 18px; margin-top: 0;">${eventTitle}</p>
                </div>
                
                <div style="background-color: #f7f7f7; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                    <h2 style="margin-top: 0; color: #333;">Event Details</h2>
                    <p><strong>Date:</strong> ${formattedDate}</p>
                    <p><strong>Venue:</strong> ${eventTitle} Venue</p>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <h2 style="margin-bottom: 15px;">Your Tickets</h2>
                    ${tickets.map((ticket, index) => `
                        <div style="margin-bottom: 20px; background-color: #f7f7f7; padding: 15px; border-radius: 5px;">
                            <div style="display: flex; align-items: center;">
                                <div style="margin-right: 15px; background-color: white; padding: 10px; border-radius: 5px;">
                                    <img src="${ticket.qr_code_url}" alt="Ticket QR Code" style="width: 150px; height: 150px;" />
                                </div>
                                <div>
                                    <p style="font-weight: bold; margin-bottom: 5px;">Ticket #${index + 1}</p>
                                    <p style="margin: 5px 0;">${ticket.seat_label}</p>
                                    <p style="font-family: monospace; font-size: 12px; margin: 5px 0; color: #666;">${ticket.id}</p>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div style="background-color: #f7f7f7; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                    <h3 style="margin-top: 0; color: #333;">Important Information</h3>
                    <p>Please present the QR code at the venue entrance for admission.</p>
                    <p>Each QR code is valid for one person only and will be scanned upon entry.</p>
                </div>
                
                <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #777; font-size: 14px;">
                    <p>Thank you for your purchase, ${name}!</p>
                    <p>If you have any questions, please contact our support team.</p>
                    <p>&copy; ${new Date().getFullYear()} R&B Versus Live. All rights reserved.</p>
                </div>
            </div>
        `;

        // Send email
        await transporter.sendMail({
            from: process.env.EMAIL_FROM || '"R&B Versus Live" <tickets@rnbversuslive.com>',
            to: email,
            subject: `Your Tickets for ${eventTitle}`,
            html: htmlContent,
            attachments: tickets.map((ticket, index) => ({
                filename: `ticket-${index+1}.png`,
                path: ticket.qr_code_url,
                cid: `ticket-${index+1}`
            }))
        });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
}
