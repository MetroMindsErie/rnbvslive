import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '../../lib/supabase/client';
import { getTicketsForPurchase } from '../../lib/ticketService';

export default function CheckoutSuccess() {
    const router = useRouter();
    const { purchaseId, paymentMethod } = router.query;
    const [purchaseData, setPurchaseData] = useState(null);
    const [eventData, setEventData] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        if (purchaseId) {
            fetchPurchaseData();
        }
    }, [purchaseId]);
    
    const fetchPurchaseData = async () => {
        try {
            // Get purchase data
            const { data: purchase, error: purchaseError } = await supabase
                .from('ticket_purchases')
                .select('*')
                .eq('id', purchaseId)
                .single();
                
            if (purchaseError) throw purchaseError;
            
            setPurchaseData(purchase);
            
            // Get event details
            const { data: event, error: eventError } = await supabase
                .from('events')
                .select('*')
                .eq('id', purchase.event_id)
                .single();
                
            if (eventError) throw eventError;
            
            setEventData(event);
            
            // Get all tickets for this purchase
            const ticketData = await getTicketsForPurchase(purchaseId);
            setTickets(ticketData);
        } catch (err) {
            console.error('Error fetching purchase data:', err);
        } finally {
            setLoading(false);
        }
    };
    
    const handleDownloadTickets = () => {
        // In a real application, this would generate and download a PDF
        alert('Tickets would be downloaded as PDF in a real application');
    };
    
    const handleResendEmail = async () => {
        if (!purchaseData) return;
        
        try {
            // Call the email API endpoint again
            await fetch('/api/send-ticket-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: purchaseData.customer_email,
                    name: purchaseData.customer_name,
                    eventTitle: eventData.title,
                    eventDate: eventData.date,
                    tickets: tickets
                }),
            });
            
            alert(`Email with tickets has been resent to ${purchaseData.customer_email}`);
        } catch (err) {
            console.error('Error resending email:', err);
            alert('There was an error resending the email. Please try again.');
        }
    };
    
    // Helper function to get a payment method icon
    const getPaymentMethodIcon = (method) => {
        switch(method) {
            case 'square':
                return <span>💳 Credit Card</span>;
            case 'paypal':
                return <span>📱 PayPal</span>;
            case 'applepay':
                return <span>🍎 Apple Pay</span>;
            case 'googlepay':
                return <span>📱 Google Pay</span>;
            case 'venmo':
                return <span>📱 Venmo</span>;
            case 'amazonpay':
                return <span>📦 Amazon Pay</span>;
            default:
                return <span>💳 Payment</span>;
        }
    };
    
    if (loading) {
        return <div className="p-10 text-center">Loading order details...</div>;
    }
    
    if (!purchaseData || !eventData) {
        return (
            <div className="p-10 text-center">
                <h1 className="text-2xl mb-4">Order not found</h1>
                <Link href="/dates" className="text-blue-500 hover:underline">
                    Browse Events
                </Link>
            </div>
        );
    }
    
    return (
        <>
            <Head>
                <title>Order Confirmation - R&B Versus Live</title>
                <meta name="description" content="Your ticket purchase has been confirmed" />
            </Head>
            
            <div className="min-h-screen bg-[#1a1a1a] text-white p-6">
                <div className="max-w-2xl mx-auto bg-[#252525] rounded-lg overflow-hidden shadow-xl">
                    <div className="p-6">
                        <div className="text-center mb-8">
                            <div className="inline-block p-3 rounded-full bg-green-800 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold">Order Confirmed!</h1>
                            <p className="text-gray-400 mt-1">Thank you for your purchase</p>
                            <p className="text-sm mt-2">A confirmation email with your tickets has been sent to {purchaseData?.customer_email}</p>
                        </div>
                        
                        <div className="bg-[#202020] p-4 rounded-lg mb-6">
                            <h2 className="font-bold text-lg mb-3">{eventData.title}</h2>
                            <p className="text-sm mb-1">
                                {new Date(eventData.date).toLocaleDateString()} at {eventData.time || '9:00 PM'}
                            </p>
                            <p className="text-sm">{eventData.venue || eventData.location}</p>
                        </div>
                        
                        <div className="mb-6">
                            <h3 className="font-bold text-lg mb-3">Order Details</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>Order #:</div>
                                <div className="font-mono">{purchaseId}</div>
                                
                                <div>Date:</div>
                                <div>{purchaseData && new Date(purchaseData.purchase_date).toLocaleDateString()}</div>
                                
                                <div>Name:</div>
                                <div>{purchaseData?.customer_name}</div>
                                
                                <div>Email:</div>
                                <div>{purchaseData?.customer_email}</div>
                                
                                <div>Tickets:</div>
                                <div>{purchaseData?.ticket_quantity}</div>
                                
                                <div>Payment Method:</div>
                                <div>{paymentMethod && getPaymentMethodIcon(paymentMethod)}</div>
                                
                                <div>Total Paid:</div>
                                <div>${purchaseData?.total_amount.toFixed(2)}</div>
                            </div>
                        </div>
                        
                        <div className="mb-6">
                            <h3 className="font-bold text-lg mb-3">Your Tickets</h3>
                            
                            {tickets.length > 0 ? (
                                <div className="space-y-4">
                                    {tickets.map((ticket, index) => (
                                        <div key={ticket.id} className="bg-[#202020] p-4 rounded-lg">
                                            <div className="flex flex-col md:flex-row items-center">
                                                <div className="mb-4 md:mb-0 md:mr-4 bg-white p-3 rounded">
                                                    <Image 
                                                        src={ticket.qr_code_url}
                                                        alt={`Ticket QR Code ${index + 1}`}
                                                        width={120}
                                                        height={120}
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-semibold mb-1">{eventData.title}</p>
                                                    <p className="text-sm text-gray-400">Ticket #{index + 1}</p>
                                                    <p className="text-sm">{ticket.seat_label}</p>
                                                    <p className="text-xs font-mono mt-2">{ticket.id}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400">No tickets found</p>
                            )}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button 
                                onClick={handleDownloadTickets}
                                className="flex-1 py-3 bg-[#e91e63] hover:bg-[#d81b60] text-white font-bold rounded"
                            >
                                Download Tickets
                            </button>
                            <button 
                                onClick={handleResendEmail}
                                className="flex-1 py-3 bg-[#333] hover:bg-[#444] text-white font-bold rounded"
                            >
                                Resend Email
                            </button>
                        </div>
                        
                        <div className="mt-8 text-center">
                            <Link href="/dates" className="text-[#e91e63] hover:underline">
                                Browse More Events
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
