import { a, AbstractElement } from "@pesca-dev/atomicity";
import "./projects.css";
import { Component } from "./component";
import { siGithub } from "simple-icons";
import { svg } from "./utils";
import { addCardTiltToAll } from "./card-tilt";

@Component("website-projects")
export class WebsiteProjects extends AbstractElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    super.connectedCallback();
    setTimeout(() => { addCardTiltToAll('.project-card', this); }, 100);
    // Fetch GitHub metadata best-effort
    try { await this.fetchMetadata(); } catch {}
  }

  async fetchMetadata() {
    const map: Record<string, string> = {
      "Y Programming Language": "H1ghBre4k3r/y-lang",
      "Dependory": "H1ghBre4k3r/dependory",
      "Lachs": "H1ghBre4k3r/lachs",
      "Disruption": "H1ghBre4k3r/disruption"
    };
    const cards = this.querySelectorAll('.project-card');
    await Promise.all(Array.from(cards).map(async (card) => {
      const title = card.querySelector('h3')?.textContent?.trim() || '';
      const repo = map[title];
      if (!repo) return;
      const res = await fetch(`https://api.github.com/repos/${repo}`);
      if (!res.ok) return;
      const data = await res.json();
      const meta = document.createElement('div');
      meta.className = 'project-meta';
      meta.innerHTML = `
        <span class="meta-badge">★ ${data.stargazers_count}</span>
        <span class="meta-badge">⑂ ${data.forks_count}</span>
        <span class="meta-badge">Updated ${new Date(data.pushed_at).toLocaleDateString()}</span>
      `;
      card.appendChild(meta);
    }));
  }

  render() {
    return (
      <section className="projects" id="projects">
        <div className="projects-content">
          <h2 className="section-title">Featured Projects</h2>
          <div className="projects-grid">
            <div className="project-card">
              <div className="project-header">
                <h3>Y Programming Language</h3>
                <a href="https://github.com/H1ghBre4k3r/y-lang" target="_blank" rel="noopener noreferrer" className="project-link">
                  {svg(siGithub.svg)}
                </a>
              </div>
              <p className="project-description">An experimental, expression-centric programming language targeting LLVM. Features static typing with inference, first-class functions, and a complete LSP implementation with formatter.</p>
              <div className="project-tags">
                <span className="tag">Rust</span>
                <span className="tag">LLVM</span>
                <span className="tag">Compiler</span>
                <span className="tag">LSP</span>
              </div>
            </div>
            <div className="project-card">
              <div className="project-header">
                <h3>Dependory</h3>
                <a href="https://github.com/H1ghBre4k3r/dependory" target="_blank" rel="noopener noreferrer" className="project-link">
                  {svg(siGithub.svg)}
                </a>
              </div>
              <p className="project-description">A featherweight yet powerful dependency injection framework for TypeScript using decorators. Supports singletons, transients, custom registries, and flexible injection patterns.</p>
              <div className="project-tags">
                <span className="tag">TypeScript</span>
                <span className="tag">DI Framework</span>
                <span className="tag">Decorators</span>
              </div>
            </div>
            <div className="project-card">
              <div className="project-header">
                <h3>Lachs</h3>
                <a href="https://github.com/H1ghBre4k3r/lachs" target="_blank" rel="noopener noreferrer" className="project-link">
                  {svg(siGithub.svg)}
                </a>
              </div>
              <p className="project-description">Lightweight lexer generator for Rust written in Rust. Automatically generates lexers from enum definitions with terminals and regex-based literals using proc macros.</p>
              <div className="project-tags">
                <span className="tag">Rust</span>
                <span className="tag">Lexer</span>
                <span className="tag">Proc Macros</span>
              </div>
            </div>
            <div className="project-card">
              <div className="project-header">
                <h3>Disruption</h3>
                <a href="https://github.com/H1ghBre4k3r/disruption" target="_blank" rel="noopener noreferrer" className="project-link">
                  {svg(siGithub.svg)}
                </a>
              </div>
              <p className="project-description">Featherweight wrapper around the Discord API written in Rust. Clean, type-safe abstraction for building Discord bots with focus on simplicity and performance.</p>
              <div className="project-tags">
                <span className="tag">Rust</span>
                <span className="tag">Discord</span>
                <span className="tag">API Wrapper</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
