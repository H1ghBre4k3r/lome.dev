import { a, AbstractElement } from "@pesca-dev/atomicity";
import "./particle-background.css";
import { Component } from "./component";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

@Component("particle-background")
export class ParticleBackground extends AbstractElement {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: Particle[] = [];
  private animationFrame: number = 0;
  private mouseX: number = 0;
  private mouseY: number = 0;
  private particleCount: number = 50;

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.setupCanvas();
    this.createParticles();
    this.animate();
    window.addEventListener('resize', () => this.setupCanvas());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
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

  animate() {
    if (!this.ctx || !this.canvas) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw particles
    this.particles.forEach((particle, i) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off edges
      if (particle.x < 0 || particle.x > this.canvas!.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.canvas!.height) particle.vy *= -1;

      // Mouse interaction
      const dx = this.mouseX - particle.x;
      const dy = this.mouseY - particle.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 150) {
        const force = (150 - dist) / 150;
        particle.x -= dx * force * 0.03;
        particle.y -= dy * force * 0.03;
      }

      // Draw particle
      this.ctx!.beginPath();
      this.ctx!.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx!.fillStyle = `rgba(102, 126, 234, ${0.4 + Math.random() * 0.3})`;
      this.ctx!.fill();

      // Draw connections
      this.particles.forEach((p2, j) => {
        if (i === j) return;

        const dx = particle.x - p2.x;
        const dy = particle.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          this.ctx!.beginPath();
          this.ctx!.strokeStyle = `rgba(102, 126, 234, ${0.15 * (1 - distance / 150)})`;
          this.ctx!.lineWidth = 0.5;
          this.ctx!.moveTo(particle.x, particle.y);
          this.ctx!.lineTo(p2.x, p2.y);
          this.ctx!.stroke();
        }
      });
    });

    this.animationFrame = requestAnimationFrame(() => this.animate());
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
