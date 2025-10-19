import { a, AbstractElement } from "@pesca-dev/atomicity";
import { Component } from "./component";
import { getBlogPosts, formatDate, estimateReadingTime, type BlogPost } from "./lib/blog";
import { addCardTilt } from "./card-tilt";

@Component("website-blog")
export class WebsiteBlog extends AbstractElement {
  private posts: BlogPost[] = [];
  private gridElement: HTMLElement | null = null;
  private contentEl: HTMLElement | null = null;
  private categories: string[] = [];
  private tags: string[] = [];
  private filterCategory: string = 'all';
  private filterTag: string = 'all';
  private filterQuery: string = '';

  constructor() {
    super();
    this.loadPosts();
  }
  applyFilters(posts: BlogPost[]): BlogPost[] {
    return posts.filter(p => {
      const catOk = this.filterCategory === 'all' || p.category === this.filterCategory;
      const tagOk = this.filterTag === 'all' || p.tags.includes(this.filterTag);
      const q = this.filterQuery.trim().toLowerCase();
      const qOk = !q || [p.title, p.excerpt, p.tags.join(' ')].some(s => s.toLowerCase().includes(q));
      return catOk && tagOk && qOk;
    });
  }

  renderFilters() {
    if (!this.contentEl || (this.categories.length === 0 && this.tags.length === 0)) return;
    let bar = this.contentEl.querySelector('.blog-filters');
    if (!bar) {
      bar = (
        <div className="blog-filters">
          <input
            className="filter-input"
            type="search"
            placeholder="Search articles..."
            aria-label="Search articles"
            onInput={(e: Event) => {
              this.filterQuery = (e.target as HTMLInputElement).value;
              this.updateBlogGrid();
            }}
          />
          <select
            className="filter-select category"
            onChange={(e: Event) => {
              this.filterCategory = (e.target as HTMLSelectElement).value;
              this.updateBlogGrid();
            }}
          >
            <option value="all">All categories</option>
            {() => this.categories.map(c => <option value={c}>{c}</option>)}
          </select>
          <select
            className="filter-select tag"
            onChange={(e: Event) => {
              this.filterTag = (e.target as HTMLSelectElement).value;
              this.updateBlogGrid();
            }}
          >
            <option value="all">All tags</option>
            {() => this.tags.map(t => <option value={t}>{t}</option>)}
          </select>
        </div>
      ) as HTMLElement;
      this.contentEl.insertBefore(bar, this.contentEl.querySelector('.blog-grid'));
    }
  }


  async loadPosts() {
    try {
      this.posts = await getBlogPosts();
      // derive filters
      const catSet = new Set<string>();
      const tagSet = new Set<string>();
      this.posts.forEach(p => { catSet.add(p.category); p.tags.forEach(t => tagSet.add(t)); });
      this.categories = Array.from(catSet).sort();
      this.tags = Array.from(tagSet).sort();
      this.renderFilters();
      this.updateBlogGrid();
    } catch (error) {
      console.error('Failed to load blog posts:', error);
      this.updateBlogGrid();
    }
  }

  updateBlogGrid() {
    if (!this.gridElement) return;

    // Clear loading message
    this.gridElement.innerHTML = '';

    const filtered = this.applyFilters(this.posts);

    // Render blog cards
    if (filtered.length === 0) {
      const noArticles = (<p className="blog-loading">No matching articles.</p>) as HTMLElement;
      this.gridElement.appendChild(noArticles);
    } else {
      filtered.forEach(post => {
        const card = this.createBlogCard(post);
        this.gridElement!.appendChild(card);
      });
      // Add tilt to all blog cards after render
      setTimeout(() => {
        const cards = this.gridElement!.querySelectorAll('.blog-card');
        cards.forEach(c => addCardTilt(c as HTMLElement));
      }, 50);
    }
  }

  createBlogCard(post: BlogPost): HTMLElement {
    const card = (
      <article className="blog-card" onClick={(e: Event) => {
        e.preventDefault();
        const url = `/blog/${post.slug}`;
        window.history.pushState({}, '', url);
        window.dispatchEvent(new PopStateEvent('popstate'));
        document.querySelector('website-blog-router')?.dispatchEvent(new Event('routechange'));
      }}>
        <div className="blog-meta">
          <span className="blog-date">{formatDate(post.date)}</span>
          <span className="blog-reading">{estimateReadingTime(post.content || post.excerpt || '')}</span>
          <span className="blog-category">{post.category}</span>
        </div>
        <h3 className="blog-title">{post.title}</h3>
        <p className="blog-excerpt">{post.excerpt}</p>
        <div className="blog-tags">
          {() => post.tags.slice(0, 4).map(tag => <span className="tag">{tag}</span>)}
        </div>
      </article>
    ) as HTMLElement;
    addCardTilt(card);
    return card;
  }

  render() {
    const section = (
      <section className="blog" id="blog">
        <div className="blog-content">
          <h2 className="section-title">Recent Articles</h2>
          <div className="blog-grid">
            <p className="blog-loading">Loading articles...</p>
          </div>
        </div>
      </section>
    ) as HTMLElement;

    // Store references
    this.gridElement = section.querySelector('.blog-grid');
    this.contentEl = section.querySelector('.blog-content');
    // If posts already loaded, render filters now
    if (this.posts.length) this.renderFilters();

    return section;
  }
}
