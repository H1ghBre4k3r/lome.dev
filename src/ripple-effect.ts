
export type RippleVariant = 'default' | 'light' | 'accent';

// Store ripple handlers in a WeakMap to avoid using 'any'
const rippleHandlers = new WeakMap<HTMLElement, (e: MouseEvent) => void>();

interface RippleOptions {
  variant?: RippleVariant;
  duration?: number;
}

/**
 * Add ripple effect to clickable elements
 * @param selector CSS selector for elements
 * @param container Container element to search within
 * @param options Ripple customization options
 */
export function addRippleEffect(
  selector: string,
  container: HTMLElement | Document = document,
  options: RippleOptions = {}
) {
  const { variant = 'default', duration = 600 } = options;
  const elements = container.querySelectorAll(selector);

  elements.forEach((element) => {
    const el = element as HTMLElement;

    // Add ripple container class if not already present
    if (!el.classList.contains('ripple-container')) {
      el.classList.add('ripple-container');
    }

    // Create click handler
    const handleClick = (e: MouseEvent) => {
      createRipple(e, el, variant, duration);
    };

    // Remove existing listener if any
    const existingHandler = rippleHandlers.get(el);
    if (existingHandler) {
      el.removeEventListener('click', existingHandler);
    }

    // Add new listener
    el.addEventListener('click', handleClick);
    rippleHandlers.set(el, handleClick);
  });
}

/**
 * Create and animate a ripple effect
 */
function createRipple(
  event: MouseEvent,
  element: HTMLElement,
  variant: RippleVariant,
  duration: number
) {
  const ripple = document.createElement('span');
  ripple.classList.add('ripple');

  if (variant !== 'default') {
    ripple.classList.add(variant);
  }

  // Calculate ripple position
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  // Set ripple size and position
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;

  // Add ripple to element
  element.appendChild(ripple);

  // Remove ripple after animation
  setTimeout(() => {
    ripple.remove();
  }, duration);
}

/**
 * Remove ripple effect from elements
 */
export function removeRippleEffect(
  selector: string,
  container: HTMLElement | Document = document
) {
  const elements = container.querySelectorAll(selector);

  elements.forEach((element) => {
    const el = element as HTMLElement;
    const handler = rippleHandlers.get(el);
    if (handler) {
      el.removeEventListener('click', handler);
      rippleHandlers.delete(el);
    }
    el.classList.remove('ripple-container');
  });
}

/**
 * Initialize ripple effects on common interactive elements
 */
export function initRippleEffects() {
  // Add to buttons
  addRippleEffect('.btn, button:not(.mobile-menu-toggle):not(.theme-menu-close)');

  // Add to links (lighter variant)
  addRippleEffect('a:not(.github-link):not(.project-link)', document, { variant: 'light' });

  // Add to cards
  addRippleEffect('.project-card, .blog-card, .skill-card');

  // Add to timeline items
  addRippleEffect('.timeline-item');
}
