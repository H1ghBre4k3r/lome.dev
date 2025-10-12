import './glitch-text.css';

/**
 * Add glitch text effect to elements
 * @param selector CSS selector for elements to apply glitch effect
 * @param container Container to search within (default: document)
 * @param auto If true, glitch periodically; if false, glitch on hover only
 */
export function addGlitchText(
  selector: string,
  container: HTMLElement | Document = document,
  auto: boolean = false
) {
  const elements = container.querySelectorAll(selector);

  elements.forEach((element) => {
    const el = element as HTMLElement;

    // Store the text content in a data attribute for pseudo-elements
    const text = el.textContent || '';
    el.setAttribute('data-text', text);

    // Add glitch class
    el.classList.add('glitch-text');

    if (auto) {
      el.classList.add('glitch-text-auto');
    }
  });
}

/**
 * Remove glitch text effect from elements
 * @param selector CSS selector for elements to remove glitch effect
 * @param container Container to search within (default: document)
 */
export function removeGlitchText(
  selector: string,
  container: HTMLElement | Document = document
) {
  const elements = container.querySelectorAll(selector);

  elements.forEach((element) => {
    const el = element as HTMLElement;
    el.classList.remove('glitch-text', 'glitch-text-auto');
    el.removeAttribute('data-text');
  });
}

/**
 * Trigger a one-time glitch animation
 * @param element Element to glitch
 */
export function triggerGlitch(element: HTMLElement) {
  if (!element.classList.contains('glitch-text')) {
    const text = element.textContent || '';
    element.setAttribute('data-text', text);
    element.classList.add('glitch-text');
  }

  // Add temporary class to trigger animation
  element.classList.add('glitch-active');

  setTimeout(() => {
    element.classList.remove('glitch-active');
  }, 600);
}
