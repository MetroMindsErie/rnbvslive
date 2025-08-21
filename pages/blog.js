import Navbar from '../components/Navbar'
import useSupabaseSWR from '../lib/supabase/useSupabaseSWR'

export default function Blog() {
  const { data: posts, error, isLoading } = useSupabaseSWR(
    'blog_posts',
    {
      table: 'blog_posts',
      order: { column: 'published_date', ascending: false }
    }
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex flex-col">
        <Navbar />
        <div style={{ height: '60px', width: '100%' }}></div>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-400 ml-4">Loading blog posts...</p>
        </div>
      </div>
    )
  }
  if (error) {
    return <div>Error loading blog posts.</div>
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col">
      <Navbar />
      {/* Spacer for fixed navbar */}
      <div style={{ height: '60px', width: '100%' }}></div>
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold gradient-text mb-10 text-center tracking-tight">
            {/* R&B & Hip-Hop Entertainment Blog */}
          </h1>
          <div className="grid gap-8 md:grid-cols-3">
            {posts.map(post => (
              <div
                key={post.id}
                className="bg-[#18181c] rounded-2xl shadow-xl card-hover overflow-hidden flex flex-col"
                style={{
                  border: '1.5px solid #23272f',
                  minHeight: 380,
                  transition: 'box-shadow 0.2s, transform 0.2s'
                }}
              >
                <div className="relative h-48 w-full overflow-hidden">
                  {post.image_url ? (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                      style={{ minHeight: 192, background: "#222" }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                      <span className="text-white text-4xl">📰</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {post.tags && Array.isArray(post.tags) && post.tags.map(tag => (
                      <span
                        key={tag}
                        className="bg-blue-700/80 text-xs text-white px-2 py-1 rounded-full font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex-1 flex flex-col p-5">
                  <h2 className="text-xl font-bold mb-2 text-white">{post.title}</h2>
                  <p className="text-gray-300 mb-4 flex-1">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400 mt-auto">
                    <span>
                      <span className="font-semibold">{post.author}</span>
                    </span>
                    <span>
                      {post.published_date
                        ? new Date(post.published_date).toLocaleDateString()
                        : ''}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {posts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-xl">No blog posts available yet. Check back soon!</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
