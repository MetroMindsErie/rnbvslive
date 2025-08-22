import dynamic from 'next/dynamic';

// Create a simple loading component for server-side render
function TicketConfirmationLoading() {
  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <p className="text-gray-500">Loading ticket information...</p>
    </div>
  );
}

// Load TicketConfirmation component dynamically with SSR disabled
const TicketConfirmationContent = dynamic(
  () => import('../../components/TicketConfirmationContent'),
  { 
    ssr: false,
    loading: () => <TicketConfirmationLoading />
  }
);

// Main component that only renders client-side content
export default function TicketConfirmationPage() {
  return <TicketConfirmationContent />;
}