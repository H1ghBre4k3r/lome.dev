/**
 * Adds 3D tilt effect to a card element based on mouse position
 */
export function addCardTilt(element: HTMLElement) {
  let isHovering = false;

  element.addEventListener('mouseenter', () => {
    isHovering = true;
  });

  element.addEventListener('mouseleave', () => {
    isHovering = false;
    // Reset transform
    element.style.transform = '';
  });

  element.addEventListener('mousemove', (e) => {
    if (!isHovering) return;

    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const percentX = (x - centerX) / centerX;
    const percentY = (y - centerY) / centerY;

    const maxTilt = 10; // degrees
    const rotateY = percentX * maxTilt;
    const rotateX = -percentY * maxTilt;

    element.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateZ(10px)
      scale3d(1.02, 1.02, 1.02)
    `;
  });
}

/**
 * Adds tilt effect to all elements matching a selector
 */
export function addCardTiltToAll(selector: string, parent: HTMLElement | Document = document) {
  const elements = parent.querySelectorAll(selector);
  elements.forEach(el => {
    if (el instanceof HTMLElement) {
      addCardTilt(el);
    }
  });
}
