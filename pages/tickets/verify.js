import { useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

// Import QRScanner only on client-side
const QRScanner = dynamic(() => import('../../components/QRScanner'), {
  ssr: false,
  loading: () => <p>Loading scanner...</p>
});

export default function VerifyTickets() {
  const router = useRouter();
  const [scanHistory, setScanHistory] = useState([]);
  
  const handleScanSuccess = (result) => {
    // Add scan result to history
    setScanHistory(prev => [
      {
        timestamp: new Date().toISOString(),
        ticket: result.ticket,
        valid: result.valid
      },
      ...prev
    ]);
  };
  
  return (
    <>
      <Head>
        <title>Verify Tickets - R&B Versus Live</title>
        <meta name="description" content="Verify tickets for R&B Versus Live events" />
      </Head>
      
      <div className="min-h-screen bg-[#1a1a1a] text-white p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Ticket Verification</h1>
          
          <div className="bg-[#252525] rounded-lg overflow-hidden shadow-xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Scan Ticket QR Code</h2>
            <QRScanner onScanSuccess={handleScanSuccess} />
          </div>
          
          {scanHistory.length > 0 && (
            <div className="bg-[#252525] rounded-lg overflow-hidden shadow-xl p-6">
              <h2 className="text-xl font-bold mb-4">Scan History</h2>
              <div className="space-y-4">
                {scanHistory.map((scan, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg ${scan.valid ? 'bg-green-900/20' : 'bg-red-900/20'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{scan.ticket?.events?.title || 'Unknown Event'}</p>
                        <p className="text-sm text-gray-400">
                          {new Date(scan.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded text-sm ${scan.valid ? 'bg-green-800' : 'bg-red-800'}`}>
                        {scan.valid ? 'Valid' : 'Invalid'}
                      </div>
                    </div>
                    <div className="mt-2 text-sm">
                      <p>Ticket ID: {scan.ticket?.id || 'N/A'}</p>
                      <p>Customer: {scan.ticket?.ticket_purchases?.customer_email || 'N/A'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
