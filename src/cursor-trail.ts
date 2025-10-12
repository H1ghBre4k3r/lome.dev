import './cursor-trail.css';

interface CursorTrailOptions {
  maxParticles?: number;
  particleSpacing?: number;
  enabled?: boolean;
}

class CursorTrail {
  private particles: HTMLElement[] = [];
  private maxParticles: number;
  private particleSpacing: number;
  private lastX: number = 0;
  private lastY: number = 0;
  private frameCount: number = 0;
  private enabled: boolean;
  private rafId: number | null = null;

  constructor(options: CursorTrailOptions = {}) {
    this.maxParticles = options.maxParticles || 30;
    this.particleSpacing = options.particleSpacing || 3;
    this.enabled = options.enabled ?? true;

    // Check if we should disable on mobile/reduced motion
    if (
      window.matchMedia('(hover: none) and (pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      this.enabled = false;
    }

    if (this.enabled) {
      this.init();
    }
  }

  private init() {
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
  }

  private handleMouseMove(e: MouseEvent) {
    if (!this.enabled) return;

    const x = e.clientX;
    const y = e.clientY;

    // Calculate distance moved
    const dx = x - this.lastX;
    const dy = y - this.lastY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Only create particle if moved enough distance
    if (distance > this.particleSpacing) {
      this.frameCount++;

      // Throttle particle creation
      if (this.frameCount % 2 === 0) {
        this.createParticle(x, y);
      }

      this.lastX = x;
      this.lastY = y;
    }
  }

  private createParticle(x: number, y: number) {
    // Create particle element
    const particle = document.createElement('div');
    particle.className = 'cursor-trail-particle';
    particle.style.left = `${x - 6}px`; // Center on cursor (half of width)
    particle.style.top = `${y - 6}px`; // Center on cursor (half of height)

    document.body.appendChild(particle);

    // Add to particles array
    this.particles.push(particle);

    // Remove after animation completes
    setTimeout(() => {
      particle.remove();
      const index = this.particles.indexOf(particle);
      if (index > -1) {
        this.particles.splice(index, 1);
      }
    }, 800); // Match animation duration

    // Limit number of particles
    if (this.particles.length > this.maxParticles) {
      const oldestParticle = this.particles.shift();
      if (oldestParticle) {
        oldestParticle.remove();
      }
    }
  }

  public enable() {
    this.enabled = true;
  }

  public disable() {
    this.enabled = false;
    // Clean up existing particles
    this.particles.forEach(particle => particle.remove());
    this.particles = [];
  }

  public destroy() {
    this.disable();
    document.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }
}

// Global instance
let cursorTrailInstance: CursorTrail | null = null;

/**
 * Initialize cursor trail effect
 */
export function initCursorTrail(options?: CursorTrailOptions) {
  if (!cursorTrailInstance) {
    cursorTrailInstance = new CursorTrail(options);
  }
  return cursorTrailInstance;
}

/**
 * Disable cursor trail
 */
export function disableCursorTrail() {
  if (cursorTrailInstance) {
    cursorTrailInstance.disable();
  }
}

/**
 * Enable cursor trail
 */
export function enableCursorTrail() {
  if (cursorTrailInstance) {
    cursorTrailInstance.enable();
  } else {
    cursorTrailInstance = new CursorTrail();
  }
}

/**
 * Destroy cursor trail
 */
export function destroyCursorTrail() {
  if (cursorTrailInstance) {
    cursorTrailInstance.destroy();
    cursorTrailInstance = null;
  }
}
