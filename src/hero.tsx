import { a, AbstractElement } from "@pesca-dev/atomicity";
import "./hero.css";
import { Component } from "./component";

@Component("website-hero")
export class WebsiteHero extends AbstractElement {
  constructor() {
    super();
  }

  render() {
    return (
      <section className="hero" id="home">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Hi, I'm <span className="gradient-text">H1ghBre4k3r</span>
            </h1>
            <p className="hero-subtitle">CS Student • Programmer • GitHub Campus Expert</p>
            <p className="hero-description">
              Passionate about building elegant solutions and exploring the depths of computer science.
              I love open source, Neovim, and creating tools that make developers' lives easier.
            </p>
            <div className="hero-cta">
              <a href="#projects" className="btn btn-primary">View My Work</a>
              <a href="#contact" className="btn btn-secondary">Get In Touch</a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-card card-1">
              <span className="icon">💻</span>
              <span className="label">Code</span>
            </div>
            <div className="floating-card card-2">
              <span className="icon">🚀</span>
              <span className="label">Deploy</span>
            </div>
            <div className="floating-card card-3">
              <span className="icon">⚡</span>
              <span className="label">Optimize</span>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
