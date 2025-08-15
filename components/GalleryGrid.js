import Image from 'next/image'

export default function GalleryGrid({ photos, onPhotoClick }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {photos.map((photo, index) => (
        <div 
          key={photo.id}
          className="relative aspect-square overflow-hidden rounded-lg cursor-pointer card-hover card-entrance"
          style={{ animationDelay: `${index * 0.1}s` }}
          onClick={() => onPhotoClick(photo)}
        >
          <Image
            src={photo.image_url}
            alt={photo.title || 'Event photo'}
            fill
            className="object-cover transition-transform duration-300 hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          {photo.title && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="text-white font-semibold">{photo.title}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
