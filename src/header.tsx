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

  handleNavClick(e: Event, hash: string) {
    const path = window.location.pathname;
    
    // If we're on a blog post page, navigate to home first
    if (path.startsWith('/blog/') && path !== '/blog/') {
      e.preventDefault();
      window.location.href = '/' + hash; // allow native history/back and hash scroll
      return;
    }
    // Otherwise, let the default hash navigation work
  }

  render() {
    const header = (
      <header>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <div className="header-content">
          <a href="/" className="logo">lome.dev</a>
          <nav>
            <a href="#about">About</a>
            <a href="#blog">Blog</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
            <a href="https://github.com/H1ghBre4k3r" target="_blank" rel="noopener noreferrer" className="github-link">
              {svg(siGithub.svg)}
            </a>
          </nav>
        </div>
      </header>
    ) as HTMLElement;

    // Add click handlers to nav links
    const navLinks = header.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        link.addEventListener('click', (e) => this.handleNavClick(e, href));
      }
    });

    // Handle logo click
    const logo = header.querySelector('.logo');
    if (logo) {
      logo.addEventListener('click', (e) => {
        const path = window.location.pathname;
        // If on blog post, navigate to home
        if (path.startsWith('/blog/') && path !== '/blog/') {
          e.preventDefault();
          window.history.pushState({}, '', '/');
          window.dispatchEvent(new PopStateEvent('popstate'));
        }
      });
    }

    return header;
  }
}
