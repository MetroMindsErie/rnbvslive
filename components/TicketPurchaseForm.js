import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function TicketPurchaseForm({ event }) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const formatPrice = (cents) => {
    return `$${(cents / 100).toFixed(2)}`;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const stripe = await stripePromise;
      
      // Create Checkout Session
      const response = await fetch('/api/tickets/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: event.id,
          email,
          phone,
          quantity
        }),
      });
      
      const { sessionId, url, error } = await response.json();
      
      if (error) {
        throw new Error(error);
      }
      
      // Redirect to Checkout
      if (url) {
        window.location.href = url;
      } else {
        const result = await stripe.redirectToCheckout({
          sessionId,
        });
        
        if (result.error) {
          throw new Error(result.error.message);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Calculate total
  const total = event.ticket_price * quantity;
  
  // Determine max quantity based on tickets remaining
  const maxQuantity = Math.min(event.tickets_remaining, 10); // Limit to 10 per purchase
  
  return (
    <div className="bg-white p-6 border border-gray-300 rounded-lg">
      <h3 className="text-xl font-bold mb-4">Purchase Tickets</h3>
      
      {event.tickets_remaining > 0 ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number (for SMS confirmation)
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Number of Tickets
            </label>
            <select
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              disabled={maxQuantity < 1}
            >
              {[...Array(maxQuantity)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm">Price per ticket:</span>
            <span>{formatPrice(event.ticket_price)}</span>
          </div>
          
          <div className="flex justify-between items-center mb-6 font-bold">
            <span>Total:</span>
            <span>{formatPrice(total)}</span>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 transition-colors duration-300 disabled:bg-gray-400"
            disabled={isLoading || maxQuantity < 1}
          >
            {isLoading ? 'Processing...' : 'Purchase Tickets'}
          </button>
        </form>
      ) : (
        <div className="text-center py-8">
          <p className="text-xl font-bold text-red-600 mb-2">SOLD OUT</p>
          <p className="text-gray-600">
            Sorry, there are no more tickets available for this event.
          </p>
        </div>
      )}
    </div>
  );
}
