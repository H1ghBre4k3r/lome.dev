import { a, AbstractElement } from "@pesca-dev/atomicity";
import { Component } from "./component";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

@Component("website-blog-toc")
export class WebsiteBlogTOC extends AbstractElement {
  private tocItems: TOCItem[] = [];
  private tocList: HTMLElement | null = null;
  private contentElement: HTMLElement | null = null;
  private activeId: string = '';
  private observer: IntersectionObserver | null = null;

  constructor() {
    super();
  }

  /**
   * Generates table of contents from an article element
   */
  generateTOC(articleElement: HTMLElement) {
    this.contentElement = articleElement;
    this.tocItems = [];

    // Find all headings (h2, h3, h4) in the content
    const headings = articleElement.querySelectorAll('h1, h2, h3, h4');

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.substring(1));
      const text = heading.textContent || '';

      // Generate ID from heading text if it doesn't have one
      let id = heading.id;
      if (!id) {
        id = `heading-${index}-${text.toLowerCase().replace(/[^\w]+/g, '-')}`;
        heading.id = id;
      }

      this.tocItems.push({ id, text, level });
    });

    this.updateTOCList();
    this.setupIntersectionObserver();
  }

  /**
   * Updates the TOC list in the DOM
   */
  updateTOCList() {
    if (!this.tocList) return;

    this.tocList.innerHTML = '';

    if (this.tocItems.length === 0) {
      const emptyState = (<div className="toc-empty">No headings found</div>) as HTMLElement;
      this.tocList.appendChild(emptyState);
      return;
    }

    this.tocItems.forEach(item => {
      const link = (
        <a
          href={`#${item.id}`}
          className={`toc-link toc-level-${item.level}`}
          data-id={item.id}
          onClick={(e: Event) => {
            e.preventDefault();
            this.scrollToHeading(item.id);
          }}
        >{item.text}</a>
      ) as HTMLAnchorElement;

      this.tocList!.appendChild(link);
    });
  }

  /**
   * Scrolls to a heading with smooth behavior
   */
  scrollToHeading(id: string) {
    const element = document.getElementById(id);
    if (!element) return;

    const offset = 100; // Offset from top for header space
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });

    // Update active state
    this.setActiveLink(id);
  }

  /**
   * Sets the active link based on the current heading ID
   */
  setActiveLink(id: string) {
    if (this.activeId === id) return;

    this.activeId = id;

    if (!this.tocList) return;

    // Remove active class from all links
    this.tocList.querySelectorAll('.toc-link').forEach(link => {
      link.classList.remove('active');
    });

    // Add active class to the current link
    const activeLink = this.tocList.querySelector(`[data-id="${id}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }

  /**
   * Sets up intersection observer to track which section is visible
   */
  setupIntersectionObserver() {
    if (!this.contentElement) return;

    // Disconnect existing observer if any
    if (this.observer) {
      this.observer.disconnect();
    }

    const options = {
      rootMargin: '-100px 0px -66%',
      threshold: 0
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.setActiveLink(entry.target.id);
        }
      });
    }, options);

    // Observe all headings
    this.tocItems.forEach(item => {
      const element = document.getElementById(item.id);
      if (element) {
        this.observer!.observe(element);
      }
    });
  }

  /**
   * Clean up observer when component is removed
   */
  disconnectedCallback() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  render() {
    const nav = (
      <nav className="blog-toc" id="blog-toc">
        <div className="toc-header">On this page</div>
        <div className="toc-list"></div>
      </nav>
    ) as HTMLElement;

    this.tocList = nav.querySelector('.toc-list');

    return nav;
  }
}
