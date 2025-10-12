/**
 * Magnetic hover effect for cards
 * Cards are "pulled" toward the cursor when it's nearby
 */

interface MagneticOptions {
  strength?: number;
  distance?: number;
  rotation?: boolean;
  scale?: boolean;
}

const defaultOptions: Required<MagneticOptions> = {
  strength: 0.3,
  distance: 150,
  rotation: true,
  scale: true,
};

export function addMagneticHover(selector: string, container: HTMLElement | Document = document, options: MagneticOptions = {}) {
  const opts = { ...defaultOptions, ...options };
  const elements = container.querySelectorAll(selector);

  elements.forEach((element) => {
    const card = element as HTMLElement;
    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;

        const mouseX = e.clientX;
        const mouseY = e.clientY;

        const distanceX = mouseX - cardCenterX;
        const distanceY = mouseY - cardCenterY;
        const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

        if (distance < opts.distance) {
          // Calculate magnetic pull
          const pull = 1 - distance / opts.distance;
          const translateX = distanceX * pull * opts.strength;
          const translateY = distanceY * pull * opts.strength;

          // Calculate rotation based on cursor position
          let rotateX = 0;
          let rotateY = 0;
          if (opts.rotation) {
            rotateY = (distanceX / rect.width) * 5 * pull;
            rotateX = -(distanceY / rect.height) * 5 * pull;
          }

          // Scale slightly
          const scale = opts.scale ? 1 + pull * 0.02 : 1;

          // Apply transform
          card.style.transform = `
            translate3d(${translateX}px, ${translateY}px, 0)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale(${scale})
          `;

          // Add active class for additional styling
          card.classList.add('magnetic-active');
        } else {
          // Reset transform when cursor is far away
          card.style.transform = '';
          card.classList.remove('magnetic-active');
        }
      });
    };

    const handleMouseLeave = () => {
      if (rafId) cancelAnimationFrame(rafId);
      card.style.transform = '';
      card.classList.remove('magnetic-active');
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    // Store cleanup function
    (card as any)._magneticCleanup = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  });
}

export function removeMagneticHover(selector: string, container: HTMLElement | Document = document) {
  const elements = container.querySelectorAll(selector);
  elements.forEach((element) => {
    const card = element as any;
    if (card._magneticCleanup) {
      card._magneticCleanup();
      delete card._magneticCleanup;
    }
  });
}
