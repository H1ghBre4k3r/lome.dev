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

    // Listen to custom routechange events (e.g., clicks)
    this.addEventListener('routechange', () => {
      this.handleRouteChange();
    });

    // Listen for hash changes (in-page navigation)
    window.addEventListener('hashchange', () => {
      this.handleHashNavigation();
    });

    // Also handle initial hash on load
    if (window.location.hash) {
      this.handleHashNavigation();
    }
  }

  handleHashNavigation() {
    const path = window.location.pathname;
    const hash = window.location.hash;

    // If we're on a blog post and user clicks a nav link with hash
    // Navigate to home first, then scroll to section
    if (path.startsWith('/blog/') && path !== '/blog/' && hash) {
      // Navigate to root with hash; popstate will render list
      window.location.href = '/' + hash;
      return;
    }

    // If on homepage, handle various section hashes
    if (path === '/' || path === '') {
      if (hash) {
        // Scroll to any valid section hash
        setTimeout(() => {
          const sectionId = hash.substring(1); // Remove #
          const el = document.getElementById(sectionId);
          if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY - 80; // account for scroll-padding
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }, 50);
      }
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
    const sections = ['website-hero', 'website-about', 'website-timeline', 'website-projects', 'website-contact'];
    sections.forEach(selector => {
      const element = document.querySelector(selector);
      if (element && element instanceof HTMLElement) {
        element.style.display = 'none';
      }
    });
  }

  showOtherSections() {
    // Show all main sections
    const sections = ['website-hero', 'website-about', 'website-timeline', 'website-projects', 'website-contact'];
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
    document.title = 'H1ghBre4k3r - lome.dev';

    // Scroll to blog section if needed
    const { pathname, hash } = window.location;
    if (pathname === '/blog' || pathname === '/blog/' || hash === '#blog') {
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
    // If hash is #blog, scroll into view after showing list
    if (window.location.hash === '#blog') {
      setTimeout(() => {
        const el = document.getElementById('blog');
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 50);
    }

    if (postComponent.loadPost) {
      postComponent.loadPost(slug).then((post) => {
        // Update page title with post title
        if (post) {
          document.title = `${post.title} - H1ghBre4k3r`;
        }

        // Scroll to top AFTER content is loaded and rendered
        requestAnimationFrame(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      });
    }
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
