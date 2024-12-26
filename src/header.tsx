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
          <li>CS Student</li>
          <li>
            {svg(siNeovim.svg)}
            <a href="https://github.com/H1ghBre4k3r" target="_blank">
              Programmer
            </a>
          </li>
          <li>
            {svg(siGithub.svg)}
            <a href="https://githubcampus.expert/H1ghBre4k3r/" target="_blank">
              GitHub Campus Expert
            </a>
          </li>
        </ul>
      </header>
    );
  }
}
