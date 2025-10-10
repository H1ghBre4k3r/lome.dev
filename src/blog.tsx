import { a, AbstractElement } from "@pesca-dev/atomicity";
import "./blog.css";
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
      bar = document.createElement('div');
      bar.className = 'blog-filters';
      bar.innerHTML = `
        <input class="filter-input" type="search" placeholder="Search articles..." aria-label="Search articles" />
        <select class="filter-select category">
          <option value="all">All categories</option>
        </select>
        <select class="filter-select tag">
          <option value="all">All tags</option>
        </select>
      `;
      this.contentEl.insertBefore(bar, this.contentEl.querySelector('.blog-grid'));
      const input = bar.querySelector('.filter-input') as HTMLInputElement;
      const catSel = bar.querySelector('.filter-select.category') as HTMLSelectElement;
      const tagSel = bar.querySelector('.filter-select.tag') as HTMLSelectElement;
      input.addEventListener('input', () => { this.filterQuery = input.value; this.updateBlogGrid(); });
      catSel.addEventListener('change', () => { this.filterCategory = catSel.value; this.updateBlogGrid(); });
      tagSel.addEventListener('change', () => { this.filterTag = tagSel.value; this.updateBlogGrid(); });
    }
    const catSel = (this.contentEl.querySelector('.filter-select.category') as HTMLSelectElement | null);
    const tagSel = (this.contentEl.querySelector('.filter-select.tag') as HTMLSelectElement | null);
    if (catSel && catSel.options.length === 1) {
      this.categories.forEach(c => {
        const o = document.createElement('option'); o.value = c; o.textContent = c; catSel.appendChild(o);
      });
    }
    if (tagSel && tagSel.options.length === 1) {
      this.tags.forEach(t => { const o = document.createElement('option'); o.value = t; o.textContent = t; tagSel.appendChild(o); });
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
      const noArticles = document.createElement('p');
      noArticles.className = 'blog-loading';
      noArticles.textContent = 'No matching articles.';
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
    const article = document.createElement('article');
    article.className = 'blog-card';

    // Make card clickable
    article.style.cursor = 'pointer';
    article.addEventListener('click', (e) => {
      e.preventDefault();
      const url = `/blog/${post.slug}`;
      window.history.pushState({}, '', url);
      window.dispatchEvent(new PopStateEvent('popstate'));
      // ensure timeline stays hidden during transition
      document.querySelector('website-blog-router')?.dispatchEvent(new Event('routechange'));
    });

    // Add tilt effect
    addCardTilt(article);

    const meta = document.createElement('div');
    meta.className = 'blog-meta';

    const date = document.createElement('span');
    date.className = 'blog-date';
    date.textContent = formatDate(post.date);

    const reading = document.createElement('span');
    reading.className = 'blog-reading';
    reading.textContent = estimateReadingTime(post.content || post.excerpt || '');

    const category = document.createElement('span');
    category.className = 'blog-category';
    category.textContent = post.category;

    meta.appendChild(date);
    meta.appendChild(reading);
    meta.appendChild(category);

    const title = document.createElement('h3');
    title.className = 'blog-title';
    title.textContent = post.title;

    const excerpt = document.createElement('p');
    excerpt.className = 'blog-excerpt';
    excerpt.textContent = post.excerpt;

    const tagsDiv = document.createElement('div');
    tagsDiv.className = 'blog-tags';

    post.tags.slice(0, 4).forEach(tag => {
      const tagSpan = document.createElement('span');
      tagSpan.className = 'tag';
      tagSpan.textContent = tag;
      tagsDiv.appendChild(tagSpan);
    });

    article.appendChild(meta);
    article.appendChild(title);
    article.appendChild(excerpt);
    article.appendChild(tagsDiv);

    return article;
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
