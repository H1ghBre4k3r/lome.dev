/**
 * Adds scroll-triggered reveal animations to elements
 */
export function addScrollReveal(elements: NodeListOf<Element> | Element[]) {
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
      rootMargin: '0px 0px -100px 0px'
    }
  );

  elements.forEach(el => observer.observe(el));

  return observer;
}

/**
 * Initialize scroll reveal for common selectors
 */
export function initScrollReveal() {
  // Add reveal class to sections and cards
  const selectors = [
    '.about',
    '.projects',
    '.blog',
    '.contact',
    '.project-card',
    '.blog-card',
    '.about-grid',
    '.section-title'
  ];

  selectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      elements.forEach(el => el.classList.add('scroll-reveal'));
      addScrollReveal(elements);
    }
  });
}
