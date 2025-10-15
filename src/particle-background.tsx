import { a, AbstractElement } from "@pesca-dev/atomicity";
import { Component } from "./component";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

interface BurstParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
}

@Component("particle-background")
export class ParticleBackground extends AbstractElement {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: Particle[] = [];
  private animationFrame: number = 0;
  private mouseX: number = 0;
  private mouseY: number = 0;
  private particleCount: number = 60;
  private hueBase: number = 255; // blue-purple base
  private shooting: {x:number;y:number;vx:number;vy:number;life:number}[] = [];
  private lastSpawn = 0;
  private burstParticles: BurstParticle[] = [];

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.setupCanvas();
    if (!reduce) {
      this.createParticles();
      this.startAnimation();
      window.addEventListener('resize', () => this.setupCanvas());
      window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }
  }

  disconnectedCallback() {
    cancelAnimationFrame(this.animationFrame);
    window.removeEventListener('resize', () => this.setupCanvas());
    window.removeEventListener('mousemove', (e) => this.onMouseMove(e));
  }

  onMouseMove(e: MouseEvent) {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.mouseX = e.clientX - rect.left;
    this.mouseY = e.clientY - rect.top;
  }

  setupCanvas() {
    if (!this.canvas) return;

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx = this.canvas.getContext('2d');
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * (this.canvas?.width || window.innerWidth),
        y: Math.random() * (this.canvas?.height || window.innerHeight),
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1
      });
    }
  }

  /**
   * Create a burst of particles (for Konami code activation)
   */
  createBurst() {
    if (!this.canvas) return;

    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const particleCount = 50;
    const colors = ['#ff00ff', '#00ffff', '#ffff00', '#ff00aa', '#00ff00'];

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = 3 + Math.random() * 5;
      const color = colors[Math.floor(Math.random() * colors.length)];

      this.burstParticles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 3,
        color: color,
        life: 1.0
      });
    }
  }

  startAnimation() {
    if (!this.ctx || !this.canvas) return;

    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const time = performance.now() * 0.001;
    const mouseInfluence = 200;

    // Spawn shooting stars occasionally
    if (time - this.lastSpawn > 2 && Math.random() < 0.05) {
      this.lastSpawn = time;
      const fromTop = Math.random() < 0.5;
      this.shooting.push({
        x: fromTop ? Math.random() * this.canvas.width : -20,
        y: fromTop ? -20 : Math.random() * this.canvas.height,
        vx: 4 + Math.random() * 2,
        vy: 2 + Math.random() * 1.5,
        life: 1.0
      });
    }

    // Update and draw particles
    this.particles.forEach((particle, i) => {
      // Scroll parallax influence
      const scrollY = window.scrollY || 0;
      particle.y += particle.vy + scrollY * 0.0001;
      particle.x += particle.vx;

      // Bounce off edges
      if (particle.x < 0 || particle.x > this.canvas!.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.canvas!.height) particle.vy *= -1;

      // Mouse interaction
      const dx = this.mouseX - particle.x;
      const dy = this.mouseY - particle.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouseInfluence) {
        const force = (mouseInfluence - dist) / mouseInfluence;
        particle.x -= dx * force * 0.03;
        particle.y -= dy * force * 0.03;
      }

      // Color variation
      const hue = (this.hueBase + Math.sin(time + i) * 25) % 360;
      const alpha = 0.35 + 0.25 * (0.5 + 0.5 * Math.sin(time * 2 + i));

      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hue}, 80%, 70%, ${alpha})`;
      ctx.fill();

      // Draw pulsing connections
      this.particles.forEach((p2, j) => {
        if (i === j) return;
        const dx2 = particle.x - p2.x;
        const dy2 = particle.y - p2.y;
        const distance = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        if (distance < 180) {
          ctx.beginPath();
          ctx.strokeStyle = `hsla(${hue}, 80%, 70%, ${0.12 * (1 - distance / 180)})`;
          ctx.lineWidth = 0.5 + 0.2 * Math.sin(time * 2 + distance * 0.05);
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      });
    });

    // Draw shooting stars
    this.shooting = this.shooting.filter(s => (s.life -= 0.01) > 0);
    this.shooting.forEach((s) => {
      s.x += s.vx; s.y += s.vy;
      const grad = ctx.createLinearGradient(s.x - 40, s.y - 40, s.x, s.y);
      grad.addColorStop(0, "rgba(255,255,255,0)");
      grad.addColorStop(1, "rgba(200,220,255,0.8)");
      ctx.beginPath();
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.moveTo(s.x - 40, s.y - 40);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();
    });

    // Draw burst particles
    this.burstParticles = this.burstParticles.filter(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= 0.98; // Friction
      particle.vy *= 0.98;
      particle.life -= 0.015;
      
      if (particle.life > 0) {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.life;
        ctx.fill();
        ctx.globalAlpha = 1; // Reset alpha
        return true;
      }
      return false;
    });

    this.animationFrame = requestAnimationFrame(() => this.startAnimation());
  }

  render() {
    const container = (
      <div className="particle-background">
        <canvas></canvas>
      </div>
    ) as HTMLElement;

    this.canvas = container.querySelector('canvas');

    return container;
  }
}
