import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import MashupCard from '../components/MashupCard'

export default function Mashups() {
  const [mashups, setMashups] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchMashups()
  }, [])

  const fetchMashups = async () => {
    const { data, error } = await supabase
      .from('mashups')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching mashups:', error)
    } else {
      setMashups(data || [])
    }
    setLoading(false)
  }

  const filteredMashups = filter === 'all' 
    ? mashups 
    : mashups.filter(mashup => mashup.platform === filter)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading-pulse text-center">
          <div className="preloader"></div>
          <p className="mt-4 text-gray-600">Loading mashups...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6 animate-fade-in">
            R&B <span className="text-yellow-400">Mashups</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Experience the hottest R&B remixes and mashups from our live events
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {['all', 'youtube', 'instagram', 'x'].map((platform) => (
              <button
                key={platform}
                onClick={() => setFilter(platform)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                  filter === platform 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {platform === 'all' ? 'All' : platform.charAt(0).toUpperCase() + platform.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Mashups Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMashups.map((mashup, index) => (
              <MashupCard 
                key={mashup.id} 
                mashup={mashup} 
                className="card-entrance"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))}
          </div>
          
          {filteredMashups.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-xl">No mashups found for this filter.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
