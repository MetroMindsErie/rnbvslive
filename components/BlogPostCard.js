import Link from 'next/link'

export default function BlogPostCard({ post, className = '', style = {} }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <article 
      className={`bg-white rounded-xl shadow-lg overflow-hidden card-hover ${className}`}
      style={style}
    >
      <div className="h-48 bg-gray-200">
        {post.image_url ? (
          <img 
            src={post.image_url} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
            <span className="text-white text-4xl">📰</span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-center mb-3">
          <span className="text-sm text-purple-600 font-semibold">
            {formatDate(post.published_date)}
          </span>
          {post.author && (
            <>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-sm text-gray-600">{post.author}</span>
            </>
          )}
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
          {post.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        
        <Link 
          href={`/blog/${post.id}`}
          className="text-purple-600 hover:text-purple-800 font-semibold transition-colors"
        >
          Read More →
        </Link>
      </div>
    </article>
  )
}
