import { useState } from 'react'
import { supabase } from '../lib/supabase/client'

export default function ProductCard({ product, className = '', style = {} }) {
  const [isAdding, setIsAdding] = useState(false)

  const addToCart = async () => {
    setIsAdding(true)
    
    const sessionId = getSessionId()
    
    // Check if item already exists in cart
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('session_id', sessionId)
      .eq('product_id', product.id)
      .single()

    if (existingItem) {
      // Update quantity
      await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + 1 })
        .eq('id', existingItem.id)
    } else {
      // Add new item
      await supabase
        .from('cart_items')
        .insert({
          session_id: sessionId,
          product_id: product.id,
          quantity: 1
        })
    }
    
    setIsAdding(false)
    
    // Trigger cart count update
    window.dispatchEvent(new CustomEvent('cartUpdated'))
  }

  const getSessionId = () => {
    let sessionId = localStorage.getItem('session_id')
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('session_id', sessionId)
    }
    return sessionId
  }

  return (
    <div 
      className={`bg-white rounded-xl shadow-lg overflow-hidden card-hover ${className}`}
      style={style}
    >
      <div className="h-48 bg-gray-200">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
            <span className="text-white text-4xl">🛍️</span>
          </div>
        )}
        
        {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
            Only {product.stock_quantity} left!
          </div>
        )}
        
        {product.stock_quantity === 0 && (
          <div className="absolute top-4 left-4 bg-gray-500 text-white px-2 py-1 rounded text-sm font-semibold">
            Out of Stock
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
          <span className="text-xl font-bold text-purple-600">
            ${product.price}
          </span>
        </div>
        
        <p className="text-gray-600 mb-4 text-sm">{product.description}</p>
        
        <button 
          onClick={addToCart}
          disabled={isAdding || product.stock_quantity === 0}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAdding ? 'Adding...' : product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}
