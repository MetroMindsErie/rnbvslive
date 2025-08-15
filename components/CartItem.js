export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  const product = item.products

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
              <span className="text-white">🛍️</span>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-gray-600 text-sm">{product.description}</p>
          <p className="text-purple-600 font-bold">${product.price}</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
          >
            -
          </button>
          
          <span className="w-8 text-center font-semibold">{item.quantity}</span>
          
          <button 
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
            disabled={item.quantity >= product.stock_quantity}
          >
            +
          </button>
        </div>
        
        <button 
          onClick={() => onRemove(item.id)}
          className="text-red-500 hover:text-red-700 p-2"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}
