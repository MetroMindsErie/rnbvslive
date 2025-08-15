import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import CartItem from '../components/CartItem'

export default function Cart() {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCartItems()
  }, [])

  const fetchCartItems = async () => {
    const sessionId = getSessionId()
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        products (
          id,
          name,
          description,
          price,
          image_url,
          stock_quantity
        )
      `)
      .eq('session_id', sessionId)

    if (error) {
      console.error('Error fetching cart items:', error)
    } else {
      setCartItems(data || [])
    }
    setLoading(false)
  }

  const getSessionId = () => {
    if (typeof window === 'undefined') return null
    let sessionId = localStorage.getItem('session_id')
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('session_id', sessionId)
    }
    return sessionId
  }

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      await removeItem(itemId)
      return
    }

    await supabase
      .from('cart_items')
      .update({ quantity: newQuantity })
      .eq('id', itemId)

    fetchCartItems()
    window.dispatchEvent(new CustomEvent('cartUpdated'))
  }

  const removeItem = async (itemId) => {
    await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId)

    fetchCartItems()
    window.dispatchEvent(new CustomEvent('cartUpdated'))
  }

  const getTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.products.price * item.quantity)
    }, 0).toFixed(2)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading-pulse text-center">
          <div className="preloader"></div>
          <p className="mt-4 text-gray-600">Loading cart...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
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
                    <span>{item.products.name} x {item.quantity}</span>
                    <span>${(item.products.price * item.quantity).toFixed(2)}</span>
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
