import useSupabaseSWR from '../lib/supabase/useSupabaseSWR'
import ProductCard from '../components/ProductCard'
import { useState } from 'react'

export default function Products() {
  const [filter, setFilter] = useState('all')
  const { data: products = [], error, isLoading } = useSupabaseSWR(
    'products',
    {
      table: 'products',
      order: { column: 'name', ascending: true }
    }
  )

  const categories = ['all', ...new Set(products.map(p => p.category))]
  const filteredProducts = filter === 'all'
    ? products
    : products.filter(product => product.category === filter)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading-pulse text-center">
          <div className="preloader"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">Error loading products.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6 animate-fade-in">
            R&B Versus <span className="text-yellow-400">Shop</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Official merchandise, exclusive collectibles, and VIP experiences
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                  filter === category 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category === 'all' ? 'All Products' : category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product}
                className="card-entrance"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-xl">No products found in this category.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

