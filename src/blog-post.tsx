import { a, AbstractElement } from "@pesca-dev/atomicity";
import { Component } from "./component";
import type { PreventAndRedirectCommands, Route } from "@vaadin/router";
import {
  estimateReadingTime,
  getBlogPost,
  getBlogPosts,
  getRelatedPosts,
  markdownToHtml,
  formatDate,
  type BlogPost
} from "./lib/blog";
import { WebsiteBlogTOC } from "./blog-toc"; // type only
import { BlogRelatedArticles } from "./blog-related"; // type only

interface RouteLocation {
  pathname: string;
  search: string;
  hash: string;
  params: { [key: string]: string | undefined };
  route: Route | null;
}

@Component("website-blog-post")
export class WebsiteBlogPost extends AbstractElement {
  private post: BlogPost | null = null;
  private contentElement: HTMLElement | null = null;
  private tocEl: WebsiteBlogTOC | null = null;
  private relatedEl: BlogRelatedArticles | null = null;
  location?: RouteLocation;

  constructor() {
    super();
  }

  // Vaadin Router lifecycle hook - just store the location
  onBeforeEnter(location: RouteLocation, _commands: PreventAndRedirectCommands) {
    this.location = location;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  connectedCallback() {
    super.connectedCallback();

    // Wait for render to complete, then load post
    setTimeout(() => {
      let slug: string | undefined;

      if (this.location && this.location.params.slug) {
        slug = this.location.params.slug as string;
      } else {
        // Fallback: try to get slug from URL
        const pathParts = window.location.pathname.split('/');
        slug = pathParts[pathParts.length - 1];
      }

      if (slug && slug !== 'blog') {
        this.loadPost(slug);
      }
    }, 50);
  }

  async loadPost(slug: string): Promise<BlogPost | null> {
    try {
      this.post = await getBlogPost(slug);
      this.updateContent();

      // Update SEO meta tags and structured data
      if (this.post) {
        this.updateMetaTags(this.post);
        this.updateStructuredData(this.post);
      }

      // Load related posts
      if (this.post && this.relatedEl) {
        const allPosts = await getBlogPosts();
        const related = getRelatedPosts(this.post, allPosts, 3);
        this.relatedEl.setRelatedPosts(related);
      }

      return this.post;
    } catch (error) {
      console.error('Failed to load blog post:', error);
      this.showError();
      return null;
    }
  }

  /**
   * Update meta tags for SEO when viewing a blog post
   */
  private updateMetaTags(post: BlogPost) {
    const url = `https://lome.dev/#blog/${post.slug}`;

    // Update document title
    document.title = `${post.title} | lome.dev`;

    // Helper to update or create meta tag
    const setMeta = (nameOrProperty: string, value: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${nameOrProperty}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, nameOrProperty);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', value);
    };

    // Standard meta tags
    setMeta('description', post.excerpt);

    // Open Graph tags
    setMeta('og:title', post.title, true);
    setMeta('og:description', post.excerpt, true);
    setMeta('og:type', 'article', true);
    setMeta('og:url', url, true);
    setMeta('article:published_time', post.date, true);
    setMeta('article:author', 'Louis (H1ghBre4k3r)', true);
    setMeta('article:section', post.category, true);
    post.tags.forEach((tag, index) => {
      if (index < 4) {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'article:tag');
        meta.setAttribute('content', tag);
        document.head.appendChild(meta);
      }
    });

    // Twitter Card tags
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', post.title);
    setMeta('twitter:description', post.excerpt);

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  }

  /**
   * Add JSON-LD structured data for blog posts
   */
  private updateStructuredData(post: BlogPost) {
    // Remove old structured data if exists
    const oldScript = document.querySelector('script[data-blog-post-ld]');
    if (oldScript) {
      oldScript.remove();
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "datePublished": post.date,
      "dateModified": post.date,
      "author": {
        "@type": "Person",
        "name": "Louis",
        "alternateName": "H1ghBre4k3r",
        "url": "https://lome.dev/"
      },
      "publisher": {
        "@type": "Person",
        "name": "Louis",
        "alternateName": "H1ghBre4k3r"
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://lome.dev/#blog/${post.slug}`
      },
      "keywords": post.tags.join(', '),
      "articleSection": post.category,
      "inLanguage": "en-US"
    };

    const script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('data-blog-post-ld', 'true');
    script.textContent = JSON.stringify(structuredData, null, 2);
    document.head.appendChild(script);
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
        <a href="/#blog" className="back-link">← Back to Articles</a>
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
        <a href="/" className="btn btn-primary">Back to Home</a>
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
        <div className="blog-post-related">
          <blog-related-articles></blog-related-articles>
        </div>
      </section>
    ) as HTMLElement;

    this.contentElement = section.querySelector('.blog-post-content');
    this.tocEl = section.querySelector('website-blog-toc') as unknown as WebsiteBlogTOC;
    this.relatedEl = section.querySelector('blog-related-articles') as unknown as BlogRelatedArticles;

    return section;
  }
}
