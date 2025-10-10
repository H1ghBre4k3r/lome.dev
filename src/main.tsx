import { a, AbstractElement } from "@pesca-dev/atomicity";
import "./main.css";
import { Component } from "./component";
import { initScrollReveal } from "./scroll-reveal";

@Component("website-main")
export class WebsiteMain extends AbstractElement {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    // Initialize scroll reveal animations after a short delay
    setTimeout(() => initScrollReveal(), 500);
  }

  render() {
    return (
      <main id="main-content">
        <particle-background></particle-background>
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
