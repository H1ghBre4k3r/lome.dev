import { a, AbstractElement } from "@pesca-dev/atomicity";
import "./contact.css";
import { Component } from "./component";
import { siGithub, siX, siBluesky } from "simple-icons";
import { svg } from "./utils";

@Component("website-contact")
export class WebsiteContact extends AbstractElement {
  constructor() {
    super();
  }

  render() {
    return (
      <section className="contact" id="contact">
        <div className="contact-content">
          <h2 className="section-title">Let's Connect</h2>
          <p className="contact-subtitle">
            I'm always open to new opportunities, collaborations, and interesting conversations.
            Feel free to reach out!
          </p>
          <div className="contact-links">
            <a href="https://github.com/H1ghBre4k3r" target="_blank" rel="noopener noreferrer" className="contact-link">
              {svg(siGithub.svg)}
              <span>GitHub</span>
            </a>
            <a href="https://twitter.com/h1ghbre4k3r" target="_blank" rel="noopener noreferrer" className="contact-link">
              {svg(siX.svg)}
              <span>Twitter</span>
            </a>
            <a href="https://bsky.app/profile/h1ghbre4k3r.bsky.social" target="_blank" rel="noopener noreferrer" className="contact-link">
              {svg(siBluesky.svg)}
              <span>Bluesky</span>
            </a>
            <a href="https://githubcampus.expert/H1ghBre4k3r/" target="_blank" rel="noopener noreferrer" className="contact-link campus-expert">
              <span className="icon">🎓</span>
              <span>Campus Expert</span>
            </a>
          </div>
        </div>
        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} lome.dev • Built with ❤️ and TypeScript</p>
        </footer>
      </section>
    );
  }
}
