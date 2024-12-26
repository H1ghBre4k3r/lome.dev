import { a, AbstractElement } from "@pesca-dev/atomicity";
import "./header.css";
import { Component } from "./component";

import { siGithub, siNeovim } from "simple-icons";
import { svg } from "./utils";

@Component("website-header")
export class WebsiteHeader extends AbstractElement {
  constructor() {
    super();
  }

  render() {
    return (
      <header>
        <h1>H1ghBre4k3r</h1>
        <ul>
          <li>
            <h3>CS Student</h3>
          </li>
          <li>
            {svg(siNeovim.svg)}
            <a href="https://github.com/H1ghBre4k3r" target="_blank">
              <h3>Programmer</h3>
            </a>
          </li>
          <li>
            {svg(siGithub.svg)}
            <a href="https://githubcampus.expert/H1ghBre4k3r/" target="_blank">
              <h3>GitHub Campus Expert</h3>
            </a>
          </li>
        </ul>
      </header>
    );
  }
}
