import { a, AbstractElement } from "@pesca-dev/atomicity";
import "./header.css";
import { Component } from "./component";

import { siGithub } from "simple-icons";
import { svg } from "./utils";

@Component("website-header")
export class WebsiteHeader extends AbstractElement {
  constructor() {
    super();
  }

  navigateHash(e: Event, hash: string) {
    const path = window.location.pathname;
    if (path.startsWith('/blog/') && path !== '/blog/') {
      e.preventDefault();
      window.location.href = '/' + hash;
    }
  }

  render() {
    return (
      <header>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <div className="header-content">
          <a href="/" className="logo" onClick={(e: Event) => {
            const path = window.location.pathname;
            if (path.startsWith('/blog/') && path !== '/blog/') {
              e.preventDefault();
              window.history.pushState({}, '', '/');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }
          }}>lome.dev</a>
          <nav>
            <a href="#about" onClick={(e: Event) => this.navigateHash(e, '#about')}>About</a>
            <a href="#blog" onClick={(e: Event) => this.navigateHash(e, '#blog')}>Blog</a>
            <a href="#projects" onClick={(e: Event) => this.navigateHash(e, '#projects')}>Projects</a>
            <a href="#contact" onClick={(e: Event) => this.navigateHash(e, '#contact')}>Contact</a>
            <a href="https://github.com/H1ghBre4k3r" target="_blank" rel="noopener noreferrer" className="github-link">
              {svg(siGithub.svg)}
            </a>
          </nav>
        </div>
      </header>
    ) as HTMLElement;
  }
}
