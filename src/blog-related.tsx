import { a, AbstractElement } from "@pesca-dev/atomicity";
import { Component } from "./component";
import { type BlogPost, formatDate, estimateReadingTime } from "./lib/blog";

@Component("blog-related-articles")
export class BlogRelatedArticles extends AbstractElement {
  private relatedPosts: BlogPost[] = [];

  constructor() {
    super();
  }

  setRelatedPosts(posts: BlogPost[]) {
    this.relatedPosts = posts;
    this.renderPosts();
  }

  renderPosts() {
    const container = this.querySelector('.related-articles-grid');
    if (!container) return;

    container.innerHTML = '';

    if (this.relatedPosts.length === 0) {
      return; // Hide section if no related posts
    }

    this.relatedPosts.forEach(post => {
      const card = this.createArticleCard(post);
      container.appendChild(card);
    });
  }

  createArticleCard(post: BlogPost): HTMLElement {
    return (
      <a href={`/blog/${post.slug}`} className="related-article-link">
        <article className="related-article-card">
          <div className="related-article-meta">
            <span className="related-date">{formatDate(post.date)}</span>
            <span className="related-reading">{estimateReadingTime(post.content || post.excerpt || '')}</span>
          </div>
          <h3 className="related-article-title">{post.title}</h3>
          <p className="related-article-excerpt">{post.excerpt}</p>
          <div className="related-article-tags">
            {() => post.tags.slice(0, 3).map(tag => <span className="tag">{tag}</span>)}
          </div>
          <span className="related-read-more">Read article →</span>
        </article>
      </a>
    ) as HTMLElement;
  }

  render() {
    return (
      <section className="related-articles">
        <h2 className="related-articles-title">Related Articles</h2>
        <div className="related-articles-grid"></div>
      </section>
    ) as HTMLElement;
  }
}
