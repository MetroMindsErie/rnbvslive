import { useRouter } from 'next/router'
import useSupabaseSWR from '../../lib/supabase/useSupabaseSWR'
import Link from 'next/link'

export default function MashupDetail() {
  const router = useRouter()
  const { id } = router.query

  const { data: mashup, error, isLoading } = useSupabaseSWR(
    id ? ['mashups', id] : null,
    id
      ? {
          table: 'mashups',
          filter: { column: 'id', value: id },
          single: true
        }
      : {}
  )

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (error || !mashup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500">Mashup not found.</p>
          <Link href="/mashups" className="text-purple-600 mt-4 inline-block">Back to mashups</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="py-12">
        <div className="container mx-auto px-4">
          <Link href="/mashups" className="text-gray-400 hover:text-white">← Back</Link>
          <h1 className="text-4xl md:text-5xl font-bold mt-6">{mashup.title}</h1>
          {mashup.description && <p className="text-gray-300 mt-2 max-w-3xl">{mashup.description}</p>}
        </div>
      </header>

      <main className="container mx-auto px-4 pb-24">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2 bg-gray-900 rounded-lg overflow-hidden p-6">
            {mashup.embed_url ? (
              <div className="w-full" style={{ aspectRatio: '16/9' }}>
                <iframe
                  src={mashup.embed_url}
                  className="w-full h-full rounded"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="w-full h-64 flex items-center justify-center bg-gray-800 rounded">
                <p className="text-gray-400">No player available</p>
              </div>
            )}

            <div className="mt-6 text-gray-300">
              <p><strong>Platform:</strong> {mashup.platform || 'Unknown'}</p>
              {mashup.description && <p className="mt-3">{mashup.description}</p>}
            </div>
          </div>

          <aside className="bg-gray-900 rounded-lg p-6">
            {mashup.thumbnail_url ? (
              <img src={mashup.thumbnail_url} alt={mashup.title} className="w-full rounded mb-4" />
            ) : (
              <div className="w-full h-40 bg-gray-800 rounded mb-4 flex items-center justify-center">
                <span className="text-gray-500">No thumbnail</span>
              </div>
            )}

            <div className="space-y-3 text-sm text-gray-300">
              <div>
                <strong>Uploaded:</strong>
                <div className="text-gray-400">
                  {mashup.created_at ? new Date(mashup.created_at).toLocaleString() : '—'}
                </div>
              </div>

              {mashup.embed_url && (
                <a
                  href={mashup.embed_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-3 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
                >
                  Open in source
                </a>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
