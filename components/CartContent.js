import { useState, useEffect } from 'react'
import useSupabaseSWR from '../lib/supabase/useSupabaseSWR'
import { supabase } from '../lib/supabase/client'
import CartItem from './CartItem'

export default function CartContent() {
  const [sessionId, setSessionId] = useState(null)
  const [isClient, setIsClient] = useState(false)

  // Set up session ID and mark as client-side on component mount
  useEffect(() => {
    setIsClient(true)
    let id = localStorage.getItem('session_id')
    if (!id) {
      id = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('session_id', id)
    }
    setSessionId(id)
  }, [])

  // Only fetch cart items after sessionId is set (client-side only)
  const { data: cartItems = [], error, isLoading, mutate } = useSupabaseSWR(
    sessionId ? ['cart_items', sessionId] : null,
    sessionId
      ? {
          table: 'cart_items',
          select: `
            *,
            products (
              id,
              name,
              description,
              price,
              image_url,
              stock_quantity
            )
          `,
          filter: { column: 'session_id', value: sessionId }
        }
      : {}
  )

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      await removeItem(itemId)
      return
    }

    await supabase
      .from('cart_items')
      .update({ quantity: newQuantity })
      .eq('id', itemId)

    mutate()
    window.dispatchEvent(new CustomEvent('cartUpdated'))
  }

  const removeItem = async (itemId) => {
    await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId)

    mutate()
    window.dispatchEvent(new CustomEvent('cartUpdated'))
  }

  const getTotal = () => {
    if (!cartItems || cartItems.length === 0) return '0.00'
    
    return cartItems.reduce((total, item) => {
      return total + ((item?.products?.price || 0) * (item?.quantity || 0))
    }, 0).toFixed(2)
  }

  // Show loading state if we're on the client but still loading data
  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading-pulse text-center">
          <div className="preloader"></div>
          <p className="mt-4 text-gray-600">Loading cart...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">Error loading cart.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>
        
        {!cartItems || cartItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-xl mb-4">Your cart is empty</p>
            <a href="/products" className="btn-primary">
              Continue Shopping
            </a>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map(item => (
                <CartItem 
                  key={item.id} 
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>
              
              <div className="space-y-2 mb-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item?.products?.name || 'Product'} x {item?.quantity || 0}</span>
                    <span>${((item?.products?.price || 0) * (item?.quantity || 0)).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span>${getTotal()}</span>
                </div>
              </div>
              
              <button className="w-full btn-primary mt-6">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
