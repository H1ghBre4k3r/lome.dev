import { a, AbstractElement } from "@pesca-dev/atomicity";
import { Component } from "./component";
import { initScrollReveal } from "./scroll-reveal";
import { initRippleEffects } from "./ripple-effect";
import { initCursorTrail } from "./cursor-trail";
import { Router } from "@vaadin/router";
import { routes } from "./routes";

@Component("website-main")
export class WebsiteMain extends AbstractElement {
  private router: Router | null = null;

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();

    // Initialize Vaadin Router
    const outlet = this.querySelector('#outlet');
    if (outlet) {
      this.router = new Router(outlet);
      this.router.setRoutes(routes);
    }

    // Setup hash navigation for sections on home page
    this.setupHashNavigation();

    // Initialize scroll reveal animations after a short delay
    setTimeout(() => {
      initScrollReveal();
      initRippleEffects();
      initCursorTrail();
    }, 500);
  }

  private setupHashNavigation() {
    // Handle hash navigation for section scrolling
    window.addEventListener('hashchange', () => {
      this.handleHashNavigation();
    });

    // Handle initial hash on page load
    if (window.location.hash) {
      setTimeout(() => this.handleHashNavigation(), 100);
    }
  }

  private handleHashNavigation() {
    const hash = window.location.hash;
    if (hash && window.location.pathname === '/') {
      // Only handle hash navigation on home page
      setTimeout(() => {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          const y = element.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 50);
    }
  }

  render() {
    return (
      <main id="main-content">
        <particle-background></particle-background>
        <scroll-progress></scroll-progress>
        <website-header></website-header>
        <div id="outlet"></div>
      </main>
    );
  }
}
