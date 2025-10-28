import { a, AbstractElement } from "@pesca-dev/atomicity";
import { Component } from "../component";

@Component("website-home")
export class WebsiteHome extends AbstractElement {
  render() {
    return (
      <div className="home-page">
        <website-hero></website-hero>
        <website-about></website-about>
        <website-timeline></website-timeline>
        <website-blog></website-blog>
        <website-projects></website-projects>
        <website-contact></website-contact>
      </div>
    ) as HTMLElement;
  }
}
