/**
 * Check if element is already substantially visible in viewport
 */
function isElementInView(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;

  // Check if element is already substantially visible (more than 10%)
  const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
  const elementHeight = rect.height;

  return visibleHeight / elementHeight > 0.1;
}

/**
 * Adds scroll-triggered reveal animations to elements
 */
export function addScrollReveal(elements: NodeListOf<Element> | Element[]) {
  // Use positive root margin on mobile to trigger animations earlier
  const isMobile = window.innerWidth <= 768;
  const bottomMargin = isMobile ? '50px' : '-100px';

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Optionally unobserve after revealing
          // observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: `0px 0px ${bottomMargin} 0px`
    }
  );

  elements.forEach((el: Element) => {
    // If element is already visible, reveal it immediately
    if (isElementInView(el)) {
      el.classList.add('revealed');
    }
    observer.observe(el);
  });

  return observer;
}

/**
 * Initialize scroll reveal for common selectors
 */
export function initScrollReveal() {
  // On mobile: only animate cards/sub-elements, not main sections
  // On desktop: animate everything including main sections
  const isMobile = window.innerWidth <= 768;
  const selectors = isMobile
    ? ['.project-card', '.blog-card', '.about-grid', '.section-title']
    : ['.about', '.projects', '.blog', '.contact', '.project-card', '.blog-card', '.about-grid', '.section-title'];

  selectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      // Check visibility BEFORE adding scroll-reveal class
      elements.forEach(el => {
        const alreadyVisible = isElementInView(el);
        if (alreadyVisible) {
          // Add both classes together to prevent fade-out
          el.classList.add('scroll-reveal', 'revealed');
        } else {
          // Only add scroll-reveal for off-screen elements
          el.classList.add('scroll-reveal');
        }
      });
      addScrollReveal(elements);
    }
  });
}
