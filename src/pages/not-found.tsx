import { a, AbstractElement } from "@pesca-dev/atomicity";
import { Component } from "../component";
import "../css/organisms/not-found.css";

@Component("website-not-found")
export class WebsiteNotFound extends AbstractElement {
  connectedCallback() {
    super.connectedCallback();
    // Update page title
    document.title = "404 - Page Not Found | lome.dev";
  }

  render() {
    return (
      <section className="not-found">
        <div className="not-found-content">
          <h1 className="not-found-title">404</h1>
          <h2 className="not-found-subtitle">Page Not Found</h2>
          <p className="not-found-text">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="not-found-actions">
            <a href="/" className="btn btn-primary">
              Go Home
            </a>
            <a href="/#blog" className="btn btn-secondary">
              View Blog
            </a>
          </div>
        </div>
      </section>
    ) as HTMLElement;
  }
}
