import { a, AbstractElement } from "@pesca-dev/atomicity";
import { Component } from "./component";
import type { WebsiteBlogPost } from "./blog-post";

@Component("website-blog-router")
export class WebsiteBlogRouter extends AbstractElement {
  private blogList: HTMLElement | null = null;
  private blogPost: HTMLElement | null = null;

  constructor() {
    super();
    this.setupRouting();
  }

  setupRouting() {
    // Handle initial route on load
    this.handleRouteChange();

    // Listen for popstate (back/forward buttons)
    window.addEventListener('popstate', () => {
      this.handleRouteChange();
    });

    // Listen for hash changes (in-page navigation)
    window.addEventListener('hashchange', () => {
      this.handleHashNavigation();
    });
  }

  handleHashNavigation() {
    const path = window.location.pathname;
    const hash = window.location.hash;
    
    // If we're on a blog post and user clicks a nav link with hash
    // Navigate to home first, then scroll to section
    if (path.startsWith('/blog/') && path !== '/blog/' && hash) {
      window.history.pushState({}, '', '/' + hash);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }

  handleRouteChange() {
    const path = window.location.pathname;
    
    if (!this.blogList || !this.blogPost) {
      // Elements not ready yet, try again after render
      setTimeout(() => this.handleRouteChange(), 100);
      return;
    }

    // Check if we're on a blog post page
    if (path.startsWith('/blog/') && path !== '/blog/') {
      const slug = path.replace('/blog/', '');
      this.showBlogPost(slug);
    } else {
      this.showBlogList();
    }
  }

  hideOtherSections() {
    // Hide all main sections except header and blog post
    const sections = ['website-hero', 'website-about', 'website-projects', 'website-contact'];
    sections.forEach(selector => {
      const element = document.querySelector(selector);
      if (element && element instanceof HTMLElement) {
        element.style.display = 'none';
      }
    });
  }

  showOtherSections() {
    // Show all main sections
    const sections = ['website-hero', 'website-about', 'website-projects', 'website-contact'];
    sections.forEach(selector => {
      const element = document.querySelector(selector);
      if (element && element instanceof HTMLElement) {
        element.style.display = 'contents';
      }
    });
  }

  showBlogList() {
    if (!this.blogList || !this.blogPost) return;

    this.blogList.style.display = 'contents';
    this.blogPost.style.display = 'none';
    
    // Show other sections
    this.showOtherSections();
    
    // Update page title
    document.title = 'Louis Mömmer - Software Engineer';
    
    // Scroll to blog section if coming from blog post
    const path = window.location.pathname;
    if (path === '/blog' || path === '/blog/') {
      setTimeout(() => {
        const blogSection = document.getElementById('blog');
        if (blogSection) {
          blogSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }

  showBlogPost(slug: string) {
    if (!this.blogList || !this.blogPost) return;

    this.blogList.style.display = 'none';
    this.blogPost.style.display = 'block';

    // Hide other sections
    this.hideOtherSections();

    // Load the blog post
    const postComponent = this.blogPost as unknown as WebsiteBlogPost;
    if (postComponent.loadPost) {
      postComponent.loadPost(slug).then((post) => {
        // Update page title with post title
        if (post) {
          document.title = `${post.title} - Louis Mömmer`;
        }
      });
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  render() {
    const container = (
      <div className="blog-router">
        <website-blog></website-blog>
        <website-blog-post></website-blog-post>
      </div>
    ) as HTMLElement;

    // Store references
    this.blogList = container.querySelector('website-blog');
    this.blogPost = container.querySelector('website-blog-post');

    // Initially hide blog post
    if (this.blogPost) {
      this.blogPost.style.display = 'none';
    }

    return container;
  }
}
