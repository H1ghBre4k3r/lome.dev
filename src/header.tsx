import { a, AbstractElement } from "@pesca-dev/atomicity";
import "./header.css";
import { Component } from "./component";

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
            <a href="https://github.com/H1ghBre4k3r" target="_blank">
              Programmer
            </a>
          </li>
        </ul>
      </header>
    );
  }
}
