import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { supabase } from '../lib/supabase/client'

// Import Cart component dynamically with SSR disabled
const CartContent = dynamic(() => import('../components/CartContent'), { 
  ssr: false 
})

// Create a simple loading component for the server-side render
function CartLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="loading-pulse text-center">
        <div className="preloader"></div>
        <p className="mt-4 text-gray-600">Loading cart...</p>
      </div>
    </div>
  )
}

// Main cart page - this will only render the CartContent component on the client
export default function Cart() {
  return <CartContent />
}
