/**
 * Utility for handling smooth scrolling behavior between mashups
 */

// Scroll to element with smooth behavior and snap
export function scrollToElement(elementId, options = {}) {
  const {
    behavior = 'smooth',
    block = 'start',
    inline = 'nearest',
    offset = 0,
  } = options;
  
  const element = document.getElementById(elementId);
  
  if (!element) return;
  
  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = elementPosition + offset;
  
  window.scrollTo({
    top: offsetPosition,
    behavior,
  });
}

// Detect if element is fully in viewport
export function isElementInViewport(element) {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Set up scrolling snap behavior
export function setupScrollSnapping(containerSelector, itemSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  
  // Find all snappable elements
  const items = container.querySelectorAll(itemSelector);
  
  // Monitor scroll position
  let lastScrollTop = 0;
  let isScrolling = false;
  
  const handleScroll = () => {
    if (isScrolling) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollDown = scrollTop > lastScrollTop;
    
    // Find the closest element to snap to
    let closestElement = null;
    let closestDistance = Infinity;
    
    items.forEach(item => {
      const rect = item.getBoundingClientRect();
      const distance = Math.abs(rect.top);
      
      if (distance < closestDistance) {
        closestDistance = distance;
        closestElement = item;
      }
    });
    
    // Snap to closest element if we've scrolled enough
    if (closestElement && Math.abs(closestDistance) > 100) {
      isScrolling = true;
      
      scrollToElement(closestElement.id, {
        offset: 0,
      });
      
      setTimeout(() => {
        isScrolling = false;
      }, 1000);
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  };
  
  // Throttle scroll events
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(handleScroll, 150);
  });
}
