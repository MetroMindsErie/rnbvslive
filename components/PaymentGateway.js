import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Loader2, Lock, CreditCard, Wallet, Smartphone, Shield } from 'lucide-react';

// PaymentGateway component
const PaymentGateway = ({ 
  amount = 100.00, 
  currency = 'USD', 
  onPaymentSuccess = () => {}, 
  onPaymentError = () => {} 
}) => {
  const [selectedMethod, setSelectedMethod] = useState('square');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  // Payment methods configuration - using image files instead of SVGs
const paymentMethods = [
    {
        id: 'applepay',
        name: 'Apple Pay',
        icon: <img src="/images/payment-icons/ap.jpeg" alt="Apple Pay" className="h-14 w-auto object-contain rounded-lg" />,
        available: true // Always show Apple Pay option regardless of browser support
    },
    {
        id: 'venmo',
        name: 'Venmo',
        icon: <img src="/images/payment-icons/venmo.png" alt="Venmo" className="h-14 w-auto object-contain rounded-lg" />,
        available: true
    },
    {
        id: 'square',
        name: 'Square',
        icon: <img src="/images/payment-icons/caa.png" alt="Square" className="h-14 w-auto object-contain rounded-lg" />,
        available: true
    },
    {
        id: 'card',
        name: 'Credit Card',
        icon: <img src="/images/payment-icons/cc.jpg" alt="Credit Card" className="h-14 w-auto object-contain rounded-lg" />,
        available: true
    },
    {
        id: 'paypal',
        name: 'PayPal',
        icon: <img src="/images/payment-icons/paypal.png" alt="PayPal" className="h-14 w-auto object-contain rounded-lg" />,
        available: true
    },
    {
        id: 'googlepay',
        name: 'Google Pay',
        icon: <img src="/images/payment-icons/google-pay.png" alt="Google Pay" className="h-14 w-auto object-contain rounded-lg" />,
        available: true
    }
];

  // Simulate payment processing
  const processPayment = async (method) => {
    setIsProcessing(true);
    setPaymentStatus(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate success/failure (90% success rate)
      const success = Math.random() > 0.1;

      if (success) {
        setPaymentStatus('success');
        onPaymentSuccess({
          method,
          amount,
          currency,
          transactionId: `txn_${Date.now()}`,
          timestamp: new Date().toISOString()
        });
      } else {
        throw new Error('Payment declined');
      }
    } catch (error) {
      setPaymentStatus('error');
      onPaymentError({
        method,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Square Payment Form - simplified for cleaner UI
  const SquarePaymentForm = () => (
    <div className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Card Number"
          className="w-full p-3 border border-gray-300 rounded-lg"
          value={cardData.number}
          onChange={(e) => setCardData({...cardData, number: e.target.value})}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="MM/YY"
          className="w-full p-3 border border-gray-300 rounded-lg"
          value={cardData.expiry}
          onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
        />
        <input
          type="text"
          placeholder="CVV"
          className="w-full p-3 border border-gray-300 rounded-lg"
          value={cardData.cvv}
          onChange={(e) => setCardData({...cardData, cvv: e.target.value})}
        />
      </div>
    </div>
  );

  // PayPal Payment Form
  const PayPalPaymentForm = () => (
    <div className="text-center py-8">
      <div className="bg-[#1a1a1a] rounded-lg p-6 mb-4">
        <div className="mx-auto w-12 h-12 mb-3">
          <img src="/images/payment-icons/paypal.png" alt="PayPal" className="h-12 w-auto object-contain" />
        </div>
        <h3 className="text-lg font-semibold mb-2 text-white">PayPal Checkout</h3>
        <p className="text-gray-300">You'll be redirected to PayPal to complete your payment</p>
      </div>
      <div className="text-sm text-gray-400">
        <p>✓ PayPal Buyer Protection</p>
        <p>✓ No card details needed</p>
      </div>
    </div>
  );

  // Apple Pay Form
  const ApplePayForm = () => (
    <div className="text-center py-8">
      <div className="bg-black rounded-lg p-6 mb-4">
        <div className="mx-auto w-12 h-12 mb-3 text-white">
          <img src="/images/payment-icons/apple-pay.png" alt="Apple Pay" className="h-12 w-auto object-contain" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Apple Pay</h3>
        <p className="text-gray-300">Touch ID or Face ID required</p>
      </div>
      <div className="text-sm text-gray-400">
        <p>✓ Secure biometric authentication</p>
        <p>✓ No card details stored</p>
      </div>
    </div>
  );

  // Digital Wallet Form (Google Pay, Venmo, Amazon Pay)
  const DigitalWalletForm = ({ method }) => {
    const methodConfig = paymentMethods.find(m => m.id === method);
    
    return (
      <div className="text-center py-8">
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#252525] rounded-lg p-6 mb-4">
          <div className="mx-auto w-12 h-12 flex items-center justify-center mb-3">
            {methodConfig?.icon}
          </div>
          <h3 className="text-lg font-semibold mb-2 text-white">
            {methodConfig?.name}
          </h3>
          <p className="text-gray-300">Secure one-click payment</p>
        </div>
        <div className="text-sm text-gray-400">
          <p>✓ Encrypted transactions</p>
          <p>✓ Instant processing</p>
        </div>
      </div>
    );
  };

  const renderPaymentForm = () => {
    switch (selectedMethod) {
      case 'square':
        return <SquarePaymentForm />;
      case 'paypal':
        return <PayPalPaymentForm />;
      case 'applepay':
        return <ApplePayForm />;
      default:
        return <DigitalWalletForm method={selectedMethod} />;
    }
  };

  const formatAmount = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header - matches the image with the red background */}
      <div className="bg-red-600 text-white p-6">
        <h2 className="text-2xl font-bold mb-2">Complete Your Purchase</h2>
        <div className="text-3xl font-bold">{formatAmount(amount, currency)}</div>
      </div>

      {/* Payment Status */}
      {paymentStatus && (
        <div className={`p-4 mx-6 mt-6 rounded-lg flex items-center gap-3 ${
          paymentStatus === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {paymentStatus === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="font-medium">
            {paymentStatus === 'success' 
              ? 'Payment successful!' 
              : 'Payment failed. Please try again.'}
          </span>
        </div>
      )}

      <div className="p-6">
        {/* Payment Method Selection - larger images centered in buttons */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Choose a payment method</h3>
          <div className="grid grid-cols-2 gap-3">
            {paymentMethods.filter(method => method.available).slice(0, 6).map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`p-4 rounded-lg border transition-all flex items-center justify-center h-28 ${
                  selectedMethod === method.id
                    ? 'border-red-600 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {method.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Form - Simplified card inputs */}
        {selectedMethod === 'card' && (
          <div className="mb-8">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full p-3 border border-gray-300 rounded-lg"
                value={cardData.number}
                onChange={(e) => setCardData({...cardData, number: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  value={cardData.expiry}
                  onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="CVV"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  value={cardData.cvv}
                  onChange={(e) => setCardData({...cardData, cvv: e.target.value})}
                />
              </div>
            </div>
          </div>
        )}

        {/* Payment Button - Large and prominent like in the image */}
        <button
          onClick={() => processPayment(selectedMethod)}
          disabled={isProcessing || paymentStatus === 'success'}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-white text-lg transition-all ${
            isProcessing || paymentStatus === 'success'
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 shadow-md hover:shadow-lg'
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing Payment...
            </div>
          ) : paymentStatus === 'success' ? (
            'Payment Completed'
          ) : (
            `Pay ${formatAmount(amount, currency)}`
          )}
        </button>
      </div>
    </div>
  );
};

export default PaymentGateway;