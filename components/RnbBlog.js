import React from 'react'

export default function RnbBlog() {
  // Example static blog posts; in a real app, fetch from API or CMS
  const posts = [
    {
      id: 1,
      title: "The Evolution of R&B: From Soul to Trap",
      excerpt: "Explore how R&B has transformed over the decades, blending soulful melodies with modern hip hop beats.",
      image: "/images/PC.png",
      author: "DJ Harmony",
      date: "2024-06-01",
      tags: ["R&B", "History", "Culture"]
    },
    {
      id: 2,
      title: "Top 5 Hip Hop & R&B Collabs of 2024",
      excerpt: "Check out the hottest collaborations that are dominating the charts and clubs this year.",
      image: "/images/PC31.png",
      author: "MC Vibe",
      date: "2024-05-20",
      tags: ["Hip Hop", "Collabs", "2024"]
    },
    {
      id: 3,
      title: "R&B Versus Live: Behind the Scenes",
      excerpt: "Go backstage with us and see how the magic happens at R&B Versus Live events.",
      image: "/images/PC34.png",
      author: "Queen Lyric",
      date: "2024-05-10",
      tags: ["Events", "Live", "Exclusive"]
    }
  ];

  return (
    <section className="mb-12">
      <h1 className="text-3xl md:text-4xl font-extrabold gradient-text mb-6 text-center tracking-tight">
        {/* RNBV Live Blog */}
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
              <img
                src={post.image}
                alt={post.title}
                className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                style={{ minHeight: 192, background: "#222" }}
              />
              <div className="absolute top-3 left-3 flex gap-2">
                {post.tags.map(tag => (
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
                <span>{new Date(post.date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
