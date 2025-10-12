import { a, AbstractElement } from "@pesca-dev/atomicity";
import "./hero.css";
import { Component } from "./component";
import { InteractiveTerminal } from "./interactive-terminal"; // type only
import { addGlitchText } from "./glitch-text";

@Component("website-hero")
export class WebsiteHero extends AbstractElement {
  private terminalEl: InteractiveTerminal | null = null;

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();

    // Parallax for hero background
    const hero = this.querySelector('.hero') as HTMLElement | null;
    const onScroll = () => {
      const y = Math.min(1, (window.scrollY || 0) / 600);
      if (hero) {
        hero.style.setProperty('--hero-parallax-x', `${-20 * y}px`);
        hero.style.setProperty('--hero-parallax-y', `${10 * y}px`);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Apply glitch effect to hero title
    addGlitchText('.hero-title', this, false);

    // Cycle keywords in subtitle
    const keywords = ["Developer", "Compiler Enthusiast", "Rustacean", "TypeScript Nerd", "IoT Tinkerer"];
    let k = 0;
    setInterval(() => {
      const el = this.querySelector('.keyword-rotate');
      if (el) { el.textContent = keywords[k % keywords.length]; k++; }
    }, 2200);

    // Cache terminal element
    this.terminalEl = this.querySelector<InteractiveTerminal>('interactive-terminal');

    // Start terminal animation after a short delay
    setTimeout(() => {
      this.terminalEl?.setIntroLines([
        { text: 'whoami', delay: 300, className: 'highlight' },
        { text: 'H1ghBre4k3r', delay: 200 },
        { text: 'Computer Science Student @ Kiel, Germany 📍', delay: 400 },
        { text: '', delay: 100 },
        { text: 'cat expertise.txt', delay: 300, className: 'highlight' },
        { text: 'TypeScript • Rust • IoT • Distributed Systems', delay: 200, className: 'accent' },
        { text: '', delay: 100 },
        { text: 'echo $ROLE', delay: 300, className: 'highlight' },
        { text: 'GitHub Campus Expert 🎓', delay: 200, className: 'gradient' },
        { text: '', delay: 100 },
        { text: 'ls projects/', delay: 300, className: 'highlight' },
        { text: '├── y-lang/ (Programming Language + Compiler)', delay: 100 },
        { text: '├── dependory/ (DI Framework for TypeScript)', delay: 100 },
        { text: '└── server-monitoring/ (Monitoring from outer space)', delay: 300 },
      ]);
    }, 500);
  }

  render() {
    return (
      <section className="hero" id="home" tabIndex={-1}>
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <span className="badge-icon">🎓</span>
              <span className="badge-text">GitHub Campus Expert</span>
            </div>
            <h1 className="hero-title">
              Hi, I'm <span className="gradient-text">Louis</span><span className="caret" aria-hidden="true">|</span>
            </h1>
            <p className="hero-subtitle">
              <span className="location-badge">📍 Kiel, Germany</span>
              <span className="separator">•</span>
              CS Student & <span className="keyword-rotate">Developer</span>
            </p>
            <p className="hero-description">
              Passionate about building elegant solutions in <span className="tech-highlight">TypeScript</span> and <span className="tech-highlight-rust">Rust</span>.
              I love creating developer tools, exploring distributed systems, and contributing to open source.
              Currently building compilers, DI frameworks, and monitoring tools.
            </p>
            <div className="hero-cta">
              <a href="#projects" className="btn btn-primary">View My Work</a>
              <a href="#contact" className="btn btn-secondary">Get In Touch</a>
            </div>
          </div>
          <div className="hero-visual">
            <interactive-terminal></interactive-terminal>
          </div>
        </div>
      </section>
    );
  }
}
