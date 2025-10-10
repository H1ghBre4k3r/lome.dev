import { a, AbstractElement } from "@pesca-dev/atomicity";
import "./blog-post.css";
import { Component } from "./component";
import { estimateReadingTime } from "./lib/blog";
import { getBlogPost, markdownToHtml, formatDate, type BlogPost } from "./lib/blog";
import { WebsiteBlogTOC } from "./blog-toc"; // type only

@Component("website-blog-post")
export class WebsiteBlogPost extends AbstractElement {
  private post: BlogPost | null = null;
  private contentElement: HTMLElement | null = null;
  private tocEl: WebsiteBlogTOC | null = null;

  constructor() {
    super();
  }

  async loadPost(slug: string): Promise<BlogPost | null> {
    try {
      this.post = await getBlogPost(slug);
      this.updateContent();
      return this.post;
    } catch (error) {
      console.error('Failed to load blog post:', error);
      this.showError();
      return null;
    }
  }

  updateContent() {
    if (!this.contentElement) return;

    if (!this.post) {
      this.showError();
      return;
    }

    // Header via JSX (Atomicity)
    const header = (
      <header className="post-header">
        <a href="#blog" className="back-link" onClick={(e: Event) => { e.preventDefault(); window.location.hash = 'blog'; }}>← Back to Articles</a>
        <div className="post-meta">
          <span className="post-date">{formatDate(this.post.date)}</span>
          <span className="post-reading">{estimateReadingTime(this.post.content || '')}</span>
          <span className="post-category">{this.post.category}</span>
        </div>
        <h1 className="post-title">{this.post.title}</h1>
        <div className="post-tags">{() => this.post!.tags.map(tag => <span className="tag">{tag}</span>)}</div>
        <div className="share-buttons">
          <a className="share-btn" href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(this.post!.title)}&url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer">Share on X</a>
          <a className="share-btn" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer">Share on LinkedIn</a>
        </div>
      </header>
    ) as HTMLElement;

    // Article via JSX container
    const article = (<article className="post-content"></article>) as HTMLElement;
    if (this.post.content) {
      article.innerHTML = markdownToHtml(this.post.content);
    }

    // Clear and update
    this.contentElement.innerHTML = '';
    this.contentElement.appendChild(header);
    this.contentElement.appendChild(article);

    // Generate TOC after content is rendered
    setTimeout(() => {
      this.tocEl?.generateTOC(article);
    }, 0);
  }

  showError() {
    if (!this.contentElement) return;

    const error = (
      <div className="post-error">
        <h2>Post Not Found</h2>
        <p>Sorry, the blog post you're looking for doesn't exist.</p>
        <a href="/" className="btn btn-primary" onClick={(e: Event) => {
          e.preventDefault();
          window.history.pushState({}, '', '/');
          window.dispatchEvent(new PopStateEvent('popstate'));
        }}>Back to Blog</a>
      </div>
    ) as HTMLElement;

    this.contentElement.innerHTML = '';
    this.contentElement.appendChild(error);
  }

  render() {
    const section = (
      <section className="blog-post" id="blog-post">
        <div className="blog-post-container">
          <div className="blog-post-content">
            <div className="post-loading">Loading article...</div>
          </div>
          <aside className="blog-post-sidebar">
            <website-blog-toc></website-blog-toc>
          </aside>
        </div>
      </section>
    ) as HTMLElement;

    this.contentElement = section.querySelector('.blog-post-content');
    this.tocEl = section.querySelector('website-blog-toc') as unknown as WebsiteBlogTOC;


    return section;
  }
}
