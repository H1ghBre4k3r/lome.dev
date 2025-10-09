import { a, AbstractElement } from "@pesca-dev/atomicity";
import "./blog.css";
import { Component } from "./component";

@Component("website-blog")
export class WebsiteBlog extends AbstractElement {
  constructor() {
    super();
  }

  render() {
    return (
      <section className="blog" id="blog">
        <div className="blog-content">
          <h2 className="section-title">Recent Articles</h2>
          <div className="blog-grid">
            <article className="blog-card">
              <div className="blog-meta">
                <span className="blog-date">Coming Soon</span>
                <span className="blog-category">Compilers</span>
              </div>
              <h3 className="blog-title">Building Y: An Expression-Centric Language</h3>
              <p className="blog-excerpt">
                Deep dive into the design decisions behind Y-lang, exploring how treating everything as an expression 
                simplifies both the language semantics and the compiler implementation.
              </p>
              <div className="blog-tags">
                <span className="tag">Rust</span>
                <span className="tag">LLVM</span>
                <span className="tag">Language Design</span>
              </div>
            </article>

            <article className="blog-card">
              <div className="blog-meta">
                <span className="blog-date">Coming Soon</span>
                <span className="blog-category">Rust</span>
              </div>
              <h3 className="blog-title">Lexer Generation with Proc Macros</h3>
              <p className="blog-excerpt">
                How Lachs uses Rust's powerful proc macro system to automatically generate lexers from enum definitions, 
                making compiler frontend development faster and more maintainable.
              </p>
              <div className="blog-tags">
                <span className="tag">Rust</span>
                <span className="tag">Macros</span>
                <span className="tag">Metaprogramming</span>
              </div>
            </article>

            <article className="blog-card">
              <div className="blog-meta">
                <span className="blog-date">Coming Soon</span>
                <span className="blog-category">TypeScript</span>
              </div>
              <h3 className="blog-title">Dependency Injection Without the Boilerplate</h3>
              <p className="blog-excerpt">
                Exploring how TypeScript decorators enable elegant dependency injection patterns in Dependory, 
                and why decorator-based DI is more powerful than you might think.
              </p>
              <div className="blog-tags">
                <span className="tag">TypeScript</span>
                <span className="tag">Decorators</span>
                <span className="tag">Design Patterns</span>
              </div>
            </article>

            <article className="blog-card">
              <div className="blog-meta">
                <span className="blog-date">Coming Soon</span>
                <span className="blog-category">DevOps</span>
              </div>
              <h3 className="blog-title">From Docker to Kubernetes: A Practical Guide</h3>
              <p className="blog-excerpt">
                Lessons learned deploying applications on Kubernetes, including tips for local development with K3s, 
                managing configurations, and monitoring your cluster effectively.
              </p>
              <div className="blog-tags">
                <span className="tag">Kubernetes</span>
                <span className="tag">Docker</span>
                <span className="tag">Infrastructure</span>
              </div>
            </article>
          </div>
        </div>
      </section>
    );
  }
}
