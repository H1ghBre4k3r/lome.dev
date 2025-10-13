import { a, AbstractElement } from "@pesca-dev/atomicity";
import { Component } from "./component";
import { initScrollReveal } from "./scroll-reveal";
import { initRippleEffects } from "./ripple-effect";
import { initCursorTrail } from "./cursor-trail";

@Component("website-main")
export class WebsiteMain extends AbstractElement {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    // Initialize scroll reveal animations after a short delay
    setTimeout(() => {
      initScrollReveal();
      initRippleEffects();
      initCursorTrail();
    }, 500);
  }

  render() {
    return (
      <main id="main-content">
        <particle-background></particle-background>
        <scroll-progress></scroll-progress>
        <website-header></website-header>
        <website-hero></website-hero>
        <website-about></website-about>
        <website-timeline></website-timeline>
        <website-blog-router></website-blog-router>
        <website-projects></website-projects>
        <website-contact></website-contact>
      </main>
    );
  }
}
