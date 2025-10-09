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

  render() {
    return (
      <header>
        <div className="header-content">
          <a href="#home" className="logo">lome.dev</a>
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
    );
  }
}
