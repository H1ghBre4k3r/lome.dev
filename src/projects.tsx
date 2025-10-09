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

  connectedCallback() {
    super.connectedCallback();
    // Add tilt effect to project cards after render
    setTimeout(() => {
      addCardTiltToAll('.project-card', this);
    }, 100);
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
