import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase/client'
import BlogPostCard from '../components/BlogPostCard'

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('published_date', { ascending: false })

    if (error) {
      console.error('Error fetching blog posts:', error)
    } else {
      setPosts(data || [])
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading-pulse text-center">
          <div className="preloader"></div>
          <p className="mt-4 text-gray-600">Loading blog posts...</p>
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
            R&B Versus <span className="text-yellow-400">Blog</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Stay updated with the latest news, artist spotlights, and behind-the-scenes content
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <BlogPostCard 
                key={post.id} 
                post={post}
                className="card-entrance"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))}
          </div>
          
          {posts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-xl">No blog posts available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
