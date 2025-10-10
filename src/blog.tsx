import { a, AbstractElement } from "@pesca-dev/atomicity";
import "./blog.css";
import { Component } from "./component";
import { getBlogPosts, formatDate, estimateReadingTime, type BlogPost } from "./lib/blog";
import { addCardTilt } from "./card-tilt";

@Component("website-blog")
export class WebsiteBlog extends AbstractElement {
  private posts: BlogPost[] = [];
  private gridElement: HTMLElement | null = null;

  constructor() {
    super();
    this.loadPosts();
  }

  async loadPosts() {
    try {
      this.posts = await getBlogPosts();
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

    // Render blog cards
    if (this.posts.length === 0) {
      const noArticles = document.createElement('p');
      noArticles.className = 'blog-loading';
      noArticles.textContent = 'No articles found.';
      this.gridElement.appendChild(noArticles);
    } else {
      this.posts.slice(0, 4).forEach(post => {
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

    // Store reference to the grid element for later updates
    this.gridElement = section.querySelector('.blog-grid');

    return section;
  }
}
