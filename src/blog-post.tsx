import { a, AbstractElement } from "@pesca-dev/atomicity";
import "./blog-post.css";
import { Component } from "./component";
import { getBlogPost, markdownToHtml, formatDate, type BlogPost } from "./lib/blog";

@Component("website-blog-post")
export class WebsiteBlogPost extends AbstractElement {
  private post: BlogPost | null = null;
  private contentElement: HTMLElement | null = null;

  constructor() {
    super();
  }

  async loadPost(slug: string) {
    try {
      this.post = await getBlogPost(slug);
      this.updateContent();
    } catch (error) {
      console.error('Failed to load blog post:', error);
      this.showError();
    }
  }

  updateContent() {
    if (!this.contentElement) return;

    if (!this.post) {
      this.showError();
      return;
    }

    // Create article header
    const header = document.createElement('header');
    header.className = 'post-header';

    const backLink = document.createElement('a');
    backLink.href = '#blog';
    backLink.className = 'back-link';
    backLink.innerHTML = '← Back to Articles';

    const meta = document.createElement('div');
    meta.className = 'post-meta';

    const date = document.createElement('span');
    date.className = 'post-date';
    date.textContent = formatDate(this.post.date);

    const category = document.createElement('span');
    category.className = 'post-category';
    category.textContent = this.post.category;

    meta.appendChild(date);
    meta.appendChild(category);

    const title = document.createElement('h1');
    title.className = 'post-title';
    title.textContent = this.post.title;

    const tagsDiv = document.createElement('div');
    tagsDiv.className = 'post-tags';

    this.post.tags.forEach(tag => {
      const tagSpan = document.createElement('span');
      tagSpan.className = 'tag';
      tagSpan.textContent = tag;
      tagsDiv.appendChild(tagSpan);
    });

    header.appendChild(backLink);
    header.appendChild(meta);
    header.appendChild(title);
    header.appendChild(tagsDiv);

    // Create article content
    const article = document.createElement('article');
    article.className = 'post-content';
    
    if (this.post.content) {
      article.innerHTML = markdownToHtml(this.post.content);
    }

    // Clear and update
    this.contentElement.innerHTML = '';
    this.contentElement.appendChild(header);
    this.contentElement.appendChild(article);
  }

  showError() {
    if (!this.contentElement) return;

    const error = document.createElement('div');
    error.className = 'post-error';
    error.innerHTML = `
      <h2>Post Not Found</h2>
      <p>Sorry, the blog post you're looking for doesn't exist.</p>
      <a href="#blog" class="btn btn-primary">Back to Blog</a>
    `;

    this.contentElement.innerHTML = '';
    this.contentElement.appendChild(error);
  }

  render() {
    const section = (
      <section className="blog-post" id="blog-post">
        <div className="blog-post-content">
          <div className="post-loading">Loading article...</div>
        </div>
      </section>
    ) as HTMLElement;

    this.contentElement = section.querySelector('.blog-post-content');

    return section;
  }
}
