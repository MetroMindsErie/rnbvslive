import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabase/client';
import { createTicketPurchase } from '../../lib/ticketService';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { getPublicQRUrl } from '../../utils/qrGenerator';
import { v4 as uuidv4 } from 'uuid';

export default function Checkout() {
    const router = useRouter();
    const { eventId } = router.query;
    const [eventDetails, setEventDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        ticketQuantity: 1,
        paymentMethod: 'credit_card',
        cardNumber: '',
        cardExpiry: '',
        cardCVC: '',
    });
    
    const [processingPayment, setProcessingPayment] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [ticketCode, setTicketCode] = useState('');
    const [isClient, setIsClient] = useState(false);
    
    useEffect(() => {
        // Set isClient to true when component mounts (client-side only)
        setIsClient(true);
        
        // Generate unique ticket code
        const generateTicketCode = () => {
            return `RNB-${eventId || 'EVENT'}-${uuidv4().substring(0, 8).toUpperCase()}`;
        };
        
        setTicketCode(generateTicketCode());
        
        // Retrieve event details from localStorage
        const savedDetails = localStorage.getItem('ticketPurchase');
        if (savedDetails) {
            setEventDetails(JSON.parse(savedDetails));
            setLoading(false);
        } else if (eventId) {
            fetchEventDetails();
        }
    }, [eventId]);
    
    const fetchEventDetails = async () => {
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('id', eventId)
                .single();
                
            if (error) throw error;
            
            setEventDetails({
                eventId: data.id,
                eventTitle: data.title,
                eventDate: data.date,
                eventTime: data.time || '9:00 PM',
                eventVenue: data.venue || data.location,
                eventImageUrl: data.image_url
            });
        } catch (err) {
            console.error('Error fetching event:', err);
        } finally {
            setLoading(false);
        }
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessingPayment(true);
        setErrorMessage('');
        
        try {
            // In a real application, you would integrate with a payment processor here
            // For demonstration, we'll simulate a successful payment
            
            // 1. Process payment (simulated)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // 2. Create ticket purchase with the new service
            const purchaseData = {
                fullName: formData.fullName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                totalAmount: calculateTotal(formData.ticketQuantity)
            };
            
            const { purchase, tickets } = await createTicketPurchase(
                purchaseData, 
                eventId, 
                formData.ticketQuantity
            );
            
            // 3. Send confirmation email with QR code
            await sendConfirmationEmail(
                formData.email,
                formData.fullName,
                eventDetails.eventTitle,
                eventDetails.eventDate,
                tickets
            );
            
            // 4. Redirect to success page
            router.push(`/checkout/success?purchaseId=${purchase.id}`);
            
        } catch (err) {
            console.error('Payment processing error:', err);
            setErrorMessage('There was an error processing your payment. Please try again.');
        } finally {
            setProcessingPayment(false);
        }
    };
    
    const calculateTotal = (quantity) => {
        // Simple ticket price calculation
        const basePrice = 45.00;
        const serviceFee = 5.00;
        return (basePrice + serviceFee) * quantity;
    };
    
    const sendConfirmationEmail = async (email, name, eventTitle, eventDate, tickets) => {
        // In a real application, you would integrate with an email service like SendGrid, Mailchimp, etc.
        // For example with a serverless function:
        
        try {
            const response = await fetch('/api/send-ticket-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    name,
                    eventTitle,
                    eventDate,
                    tickets
                }),
            });
            
            if (!response.ok) throw new Error('Failed to send email');
            
            return true;
        } catch (err) {
            console.error('Email sending error:', err);
            // Continue the process even if email fails
            return true;
        }
    };
    
    if (loading) {
        return <div className="p-10 text-center">Loading checkout details...</div>;
    }
    
    if (!eventDetails) {
        return (
            <div className="p-10 text-center">
                <h1 className="text-2xl mb-4">Event not found</h1>
                <Link href="/dates" className="text-blue-500 hover:underline">
                    Return to Events
                </Link>
            </div>
        );
    }
    
    return (
        <>
            <Head>
                <title>Checkout - {eventDetails?.eventTitle || 'Event'}</title>
                <meta name="description" content={`Purchase tickets for ${eventDetails?.eventTitle || 'our event'}`} />
            </Head>
            
            <div className="min-h-screen bg-[#1a1a1a] text-white p-6 pt-8 pb-20 md:pt-24 md:pb-32 lg:pt-28 lg:pb-36">
                <div className="max-w-4xl mx-auto bg-[#252525] rounded-lg overflow-hidden shadow-xl">
                    <div className="flex flex-col md:flex-row">
                        {/* Event Summary */}
                        <div className="md:w-1/3 p-6 bg-[#202020]">
                            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                            
                            <div className="mb-4">
                                <img 
                                    src={eventDetails.eventImageUrl || '/images/default-event.jpg'} 
                                    alt={eventDetails.eventTitle}
                                    className="w-full h-48 object-cover rounded"
                                />
                            </div>
                            
                            <h3 className="font-bold text-lg">{eventDetails.eventTitle}</h3>
                            
                            <div className="mt-2 text-sm">
                                <p className="mb-1">
                                    {new Date(eventDetails.eventDate).toLocaleDateString()} 
                                    at {eventDetails.eventTime}
                                </p>
                                <p>{eventDetails.eventVenue}</p>
                            </div>
                            
                            <div className="border-t border-gray-600 mt-4 pt-4">
                                <div className="flex justify-between mb-2">
                                    <span>Tickets ({formData.ticketQuantity})</span>
                                    <span>${(45.00 * formData.ticketQuantity).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Service Fee</span>
                                    <span>${(5.00 * formData.ticketQuantity).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold mt-2 pt-2 border-t border-gray-600">
                                    <span>Total</span>
                                    <span>${calculateTotal(formData.ticketQuantity).toFixed(2)}</span>
                                </div>
                            </div>
                            
                            {/* QR Code Display */}
                            <div className="mt-6 text-center">
                                <h3 className="font-bold mb-3">Your Ticket QR Code Preview</h3>
                                <div className="bg-white p-3 inline-block rounded">
                                    {isClient && ticketCode ? (
                                        <Image 
                                            src={getPublicQRUrl(ticketCode)}
                                            alt="Ticket QR Code Preview"
                                            width={150}
                                            height={150}
                                            priority
                                        />
                                    ) : (
                                        <div className="w-[150px] h-[150px] bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-500 text-xs">Loading QR Code...</span>
                                        </div>
                                    )}
                                </div>
                                <p className="mt-2 text-xs text-gray-400">
                                    Your official QR code will be generated after purchase
                                </p>
                            </div>
                        </div>
                        
                        {/* Checkout Form */}
                        <div className="md:w-2/3 p-6">
                            <h2 className="text-2xl font-bold mb-6">Checkout</h2>
                            
                            {errorMessage && (
                                <div className="bg-red-800 text-white p-3 rounded mb-4">
                                    {errorMessage}
                                </div>
                            )}
                            
                            <form onSubmit={handleSubmit} className="mb-6">
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                                    
                                    <div className="mb-4">
                                        <label className="block mb-1">Full Name</label>
                                        <input 
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full p-2 bg-[#333] rounded"
                                        />
                                    </div>
                                    
                                    <div className="mb-4">
                                        <label className="block mb-1">Email</label>
                                        <input 
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full p-2 bg-[#333] rounded"
                                        />
                                    </div>
                                    
                                    <div className="mb-4">
                                        <label className="block mb-1">Phone Number</label>
                                        <input 
                                            type="tel"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full p-2 bg-[#333] rounded"
                                        />
                                    </div>
                                    
                                    <div className="mb-4">
                                        <label className="block mb-1">Ticket Quantity</label>
                                        <select
                                            name="ticketQuantity"
                                            value={formData.ticketQuantity}
                                            onChange={handleInputChange}
                                            className="w-full p-2 bg-[#333] rounded"
                                        >
                                            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                                <option key={num} value={num}>{num}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold mb-3">Payment Information</h3>
                                    
                                    <div className="mb-4">
                                        <label className="block mb-1">Card Number</label>
                                        <input 
                                            type="text"
                                            name="cardNumber"
                                            value={formData.cardNumber}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="1234 5678 9012 3456"
                                            className="w-full p-2 bg-[#333] rounded"
                                        />
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="mb-4">
                                            <label className="block mb-1">Expiration Date</label>
                                            <input 
                                                type="text"
                                                name="cardExpiry"
                                                value={formData.cardExpiry}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="MM/YY"
                                                className="w-full p-2 bg-[#333] rounded"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block mb-1">CVC</label>
                                            <input 
                                                type="text"
                                                name="cardCVC"
                                                value={formData.cardCVC}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="123"
                                                className="w-full p-2 bg-[#333] rounded"
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <button 
                                    type="submit" 
                                    className="w-full py-3 bg-[#e91e63] hover:bg-[#d81b60] text-white font-bold rounded mb-8"
                                    disabled={processingPayment}
                                >
                                    {processingPayment ? 'Processing...' : `Pay $${calculateTotal(formData.ticketQuantity).toFixed(2)}`}
                                </button>
                            </form>
                            
                            {/* Add spacing div to create more separation from footer */}
                            <div className="h-12 md:h-16"></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}