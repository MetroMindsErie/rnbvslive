import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'

export default function BlogPost() {
  const router = useRouter()
  const { id } = router.query
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [relatedPosts, setRelatedPosts] = useState([])

  useEffect(() => {
    if (id) {
      fetchPost()
      fetchRelatedPosts()
    }
  }, [id])

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching blog post:', error)
    } else {
      setPost(data)
    }
    setLoading(false)
  }

  const fetchRelatedPosts = async () => {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .neq('id', id)
      .order('published_date', { ascending: false })
      .limit(3)
    
    setRelatedPosts(data || [])
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading-pulse text-center">
          <div className="preloader"></div>
          <p className="mt-4 text-gray-600">Loading post...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Post Not Found</h1>
          <Link href="/blog" className="btn-primary">
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <Link href="/blog" className="text-purple-600 hover:text-purple-800 font-semibold">
            ← Back to Blog
          </Link>
        </div>
      </div>

      {/* Article */}
      <article className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Hero Image */}
          {post.image_url && (
            <div className="h-64 md:h-96 rounded-xl overflow-hidden mb-8 animate-fade-in">
              <Image 
                src={post.image_url} 
                alt={post.title}
                width={1200}
                height={600}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          )}

          {/* Article Header */}
          <header className="mb-8 animate-fade-in">
            <div className="flex items-center mb-4 text-sm text-gray-600">
              <span>{formatDate(post.published_date)}</span>
              {post.author && (
                <>
                  <span className="mx-2">•</span>
                  <span>By {post.author}</span>
                </>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-xl text-gray-600 leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none animate-fade-in">
            <div 
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Share this post</h3>
            <div className="flex space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Share on Facebook
              </button>
              <button className="bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors">
                Share on Twitter
              </button>
              <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Related Posts</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {relatedPosts.map((relatedPost) => (
                <Link 
                  key={relatedPost.id} 
                  href={`/blog/${relatedPost.id}`}
                  className="block bg-white rounded-xl shadow-lg overflow-hidden card-hover"
                >
                  <div className="h-48 bg-gray-200">
                    {relatedPost.image_url ? (
                      <Image 
                        src={relatedPost.image_url} 
                        alt={relatedPost.title}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                        <span className="text-white text-4xl">📰</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <span className="text-sm text-purple-600 font-semibold">
                      {formatDate(relatedPost.published_date)}
                    </span>
                    <h3 className="text-lg font-bold text-gray-800 mt-2 mb-3 line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
