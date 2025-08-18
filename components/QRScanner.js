import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function QRScanner({ onScanSuccess }) {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [ticketInfo, setTicketInfo] = useState(null);
  
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    // Create QR scanner
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false
    );
    
    const onScannerSuccess = async (decodedText) => {
      setIsVerifying(true);
      setScanResult(decodedText);
      
      try {
        // Verify the QR code with the server
        const response = await fetch('/api/tickets/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ qrData: decodedText }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to verify ticket');
        }
        
        setTicketInfo(data.ticket);
        
        // Call the parent component's success handler
        if (onScanSuccess) {
          onScanSuccess(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsVerifying(false);
      }
    };
    
    const onScannerError = (err) => {
      console.error(err);
    };
    
    scanner.render(onScannerSuccess, onScannerError);
    
    // Cleanup
    return () => {
      scanner.clear().catch(error => {
        console.error('Failed to clear scanner', error);
      });
    };
  }, [onScanSuccess]);
  
  const resetScanner = () => {
    setScanResult(null);
    setError(null);
    setTicketInfo(null);
    
    // Reload the page to reset the scanner
    window.location.reload();
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      {!scanResult && !error && (
        <div id="qr-reader" className="w-full"></div>
      )}
      
      {isVerifying && (
        <div className="text-center my-4">
          <p>Verifying ticket...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <button 
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={resetScanner}
          >
            Try Again
          </button>
        </div>
      )}
      
      {ticketInfo && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative my-4">
          <h3 className="font-bold text-lg mb-2">Ticket Valid!</h3>
          <p><strong>Event:</strong> {ticketInfo.events.title}</p>
          <p><strong>Ticket ID:</strong> {ticketInfo.id}</p>
          <p><strong>Purchased by:</strong> {ticketInfo.ticket_purchases.customer_email}</p>
          <p><strong>Check-in time:</strong> {new Date().toLocaleString()}</p>
          
          <button 
            className="mt-3 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            onClick={resetScanner}
          >
            Scan Next Ticket
          </button>
        </div>
      )}
    </div>
  );
}
