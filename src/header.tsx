import { a, AbstractElement, atom } from "@pesca-dev/atomicity";
import { Component } from "./component";

import { siGithub } from "simple-icons";
import { svg } from "./utils";

@Component("website-header")
export class WebsiteHeader extends AbstractElement {
  private mobileMenuOpen = atom<boolean>(false);
  private savedScrollY = 0;

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();

    // Listen for ESC key to close mobile menu
    this.handleKeyDown = this.handleKeyDown.bind(this);
    document.addEventListener('keydown', this.handleKeyDown);
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape' && this.mobileMenuOpen()) {
      this.closeMobileMenu();
    }
  }

  toggleMobileMenu() {
    const isOpen = !this.mobileMenuOpen();
    this.mobileMenuOpen.set(isOpen);

    // Lock/unlock body scroll
    if (isOpen) {
      // Save current scroll position
      this.savedScrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${this.savedScrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Restore scroll position instantly (no animation)
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    }
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
    // Restore scroll position instantly (no animation)
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
  }

  navigateHash(e: Event, hash: string) {
    const path = window.location.pathname;
    if (path.startsWith('/blog/') && path !== '/blog/') {
      e.preventDefault();
      window.location.href = '/' + hash;
    }
    // Close mobile menu after navigation
    this.closeMobileMenu();
  }

  render() {
    return (
      <header>
        <a className="skip-link" href="#home">Skip to content</a>
        <div className="header-content">
          <a href="/" className="logo" onClick={(e: Event) => {
            const path = window.location.pathname;
            if (path.startsWith('/blog/') && path !== '/blog/') {
              e.preventDefault();
              window.history.pushState({}, '', '/');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }
            this.closeMobileMenu();
          }}>lome.dev</a>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <a href="#about" onClick={(e: Event) => this.navigateHash(e, '#about')}>About</a>
            <a href="#blog" onClick={(e: Event) => this.navigateHash(e, '#blog')}>Blog</a>
            <a href="#projects" onClick={(e: Event) => this.navigateHash(e, '#projects')}>Projects</a>
            <a href="#contact" onClick={(e: Event) => this.navigateHash(e, '#contact')}>Contact</a>
            <a href="https://github.com/H1ghBre4k3r" target="_blank" rel="noopener noreferrer" className="github-link">
              {svg(siGithub.svg)}
            </a>
          </nav>

          {/* Mobile Menu Toggle Button */}
          <button
            className="mobile-menu-toggle"
            aria-label={() => this.mobileMenuOpen() ? 'Close menu' : 'Open menu'}
            aria-expanded={() => this.mobileMenuOpen() ? 'true' : 'false'}
            onClick={(e: Event) => {
              e.preventDefault();
              this.toggleMobileMenu();
            }}>
            <span className="hamburger-icon">{() => this.mobileMenuOpen() ? '✕' : '☰'}</span>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <nav className={() => `mobile-nav ${this.mobileMenuOpen() ? 'open' : ''}`} aria-hidden={() => !this.mobileMenuOpen()}>
          <a href="#about" onClick={(e: Event) => this.navigateHash(e, '#about')}>About</a>
          <a href="#blog" onClick={(e: Event) => this.navigateHash(e, '#blog')}>Blog</a>
          <a href="#projects" onClick={(e: Event) => this.navigateHash(e, '#projects')}>Projects</a>
          <a href="#contact" onClick={(e: Event) => this.navigateHash(e, '#contact')}>Contact</a>
          <a href="https://github.com/H1ghBre4k3r" target="_blank" rel="noopener noreferrer" className="github-link-mobile">
            {svg(siGithub.svg)}
            <span>GitHub</span>
          </a>
        </nav>

        {/* Backdrop Overlay */}
        {() => this.mobileMenuOpen() ? (
          <div
            className="mobile-nav-backdrop"
            onClick={(e: Event) => {
              e.stopPropagation();
              this.closeMobileMenu();
            }}>
          </div>
        ) : ''}
      </header>
    ) as HTMLElement;
  }
}
