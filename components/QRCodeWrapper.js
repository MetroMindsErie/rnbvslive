import React, { useEffect, useState } from 'react';

export default function QRCodeWrapper({ value, size = 150, level = 'H', renderAs = 'svg' }) {
  const [QRCode, setQRCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Make sure we're in the browser environment
    if (typeof window === 'undefined') return;

    // Load the QRCode library
    const loadQRCode = async () => {
      try {
        // Import the library
        const QRCodeModule = await import('qrcode.react');
        
        // Get the correct export (QRCodeModule.default is the most likely one)
        const QRCodeComponent = QRCodeModule.default || QRCodeModule.QRCode;
        
        if (!QRCodeComponent) {
          throw new Error('Could not find QRCode component in the imported module');
        }
        
        setQRCode(() => QRCodeComponent);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load QR code library:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadQRCode();
  }, []);

  // Show loading placeholder until QRCode component is loaded
  if (loading) {
    return (
      <div 
        style={{ 
          width: `${size}px`, 
          height: `${size}px`, 
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          color: '#666'
        }}
      >
        Loading QR...
      </div>
    );
  }

  // Show error state
  if (error || !QRCode) {
    return (
      <div 
        style={{ 
          width: `${size}px`, 
          height: `${size}px`, 
          backgroundColor: '#ffebee',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          color: '#d32f2f',
          padding: '8px',
          textAlign: 'center'
        }}
      >
        Failed to load QR code
      </div>
    );
  }

  // Render actual QR code when component is available
  return (
    <QRCode 
      value={value || 'https://rnbvslive.com'} 
      size={size} 
      level={level} 
      renderAs={renderAs} 
    />
  );
}
