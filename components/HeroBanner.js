export default function HeroBanner({ 
  title, 
  subtitle, 
  backgroundImage, 
  children, 
  className = '',
  showAnimatedElements = true 
}) {
  return (
    <section className={`relative hero-bg text-white py-24 overflow-hidden min-h-[60vh] flex items-center ${className}`}>
      {/* Background Image Overlay */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
      
      {/* Animated Background Elements */}
      {showAnimatedElements && (
        <>
          <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-blue-500/10 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-yellow-400/10 rounded-full animate-pulse"></div>
        </>
      )}
      
      <div className="relative container mx-auto px-4 text-center z-10">
        {title && (
          <h1 className="text-5xl md:text-7xl font-black mb-6 animate-fade-in text-shadow-lg">
            {title}
          </h1>
        )}
        
        {subtitle && (
          <p className="text-lg md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed text-shadow">
            {subtitle}
          </p>
        )}
        
        {children}
      </div>
    </section>
  )
}
