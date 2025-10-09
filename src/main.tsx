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
        <website-hero></website-hero>
        <website-about></website-about>
        <website-blog></website-blog>
        <website-projects></website-projects>
        <website-contact></website-contact>
      </main>
    );
  }
}
