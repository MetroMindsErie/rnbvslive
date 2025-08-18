import React from 'react';
import { getPublicQRUrl } from '../utils/qrGenerator';

// A simplified QR code component that uses our utility
export default function SimpleQRCode({ value, size = 150 }) {
  // Generate a unique identifier for this QR code
  const qrId = `qr-${Math.random().toString(36).substring(2, 9)}`;
  
  // Use our utility to get a QR code URL
  const qrCodeSrc = getPublicQRUrl(value, size);
  
  return (
    <img 
      src={qrCodeSrc}
      alt={`QR Code: ${value}`}
      width={size}
      height={size}
      style={{ background: 'white' }}
      id={qrId}
      onError={(e) => {
        e.target.onerror = null; 
        // Fallback to Google Charts API if the first one fails
        e.target.src = `https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(value)}&chs=${size}x${size}`; 
      }}
    />
  );
}
