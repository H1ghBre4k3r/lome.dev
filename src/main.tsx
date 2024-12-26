import { a, AbstractElement } from "@pesca-dev/atomicity";
import "./main.css";
import { Component } from "./component";

@Component("website-main")
export class WebsiteMain extends AbstractElement {
  constructor() {
    super();
  }

  render() {
    return (
      <main>
        <website-header></website-header>
      </main>
    );
  }
}
