import { a, AbstractElement } from "@pesca-dev/atomicity";
import { Component } from "./component";

interface SectionInfo {
  id: string;
  label: string;
  element: Element;
}

@Component("scroll-progress")
export class ScrollProgress extends AbstractElement {
  private progressFill: HTMLElement | null = null;
  private circleProgress: HTMLElement | null = null;
  private circleFill: SVGCircleElement | null = null;
  private sectionIndicators: HTMLElement | null = null;
  private sections: SectionInfo[] = [];
  private ticking = false;

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();

    // Find all major sections
    this.sections = Array.from(document.querySelectorAll('section[id]'))
      .map(section => ({
        id: section.id,
        label: this.getSectionLabel(section.id),
        element: section
      }))
      .filter(s => s.label); // Only sections with valid labels

    // Set up scroll listener
    this.handleScroll = this.handleScroll.bind(this);
    window.addEventListener('scroll', this.onScroll.bind(this), { passive: true });

    // Initial update
    setTimeout(() => {
      this.progressFill = this.querySelector('.scroll-progress-fill');
      this.circleProgress = this.querySelector('.scroll-progress-circle');
      this.circleFill = this.querySelector('.progress-circle-fill');
      this.sectionIndicators = this.querySelector('.section-progress-indicators');
      this.updateProgress();
    }, 100);
  }

  disconnectedCallback() {
    window.removeEventListener('scroll', this.onScroll.bind(this));
  }

  getSectionLabel(id: string): string {
    const labels: Record<string, string> = {
      'home': 'Home',
      'about': 'About',
      'blog': 'Blog',
      'projects': 'Projects',
      'skills': 'Skills',
      'timeline': 'Timeline',
      'contact': 'Contact'
    };
    return labels[id] || '';
  }

  onScroll() {
    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        this.handleScroll();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  handleScroll() {
    this.updateProgress();
  }

  updateProgress() {
    // Calculate scroll percentage
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    // Update progress bar
    if (this.progressFill) {
      this.progressFill.style.width = `${scrollPercent}%`;
    }

    // Update circular progress
    if (this.circleFill) {
      const circumference = 283; // 2 * PI * 45
      const offset = circumference - (scrollPercent / 100) * circumference;
      this.circleFill.style.strokeDashoffset = offset.toString();
    }

    // Show/hide circular indicator
    if (this.circleProgress) {
      if (scrollTop > 300) {
        this.circleProgress.classList.add('visible');
      } else {
        this.circleProgress.classList.remove('visible');
      }
    }

    // Show/hide section indicators
    if (this.sectionIndicators) {
      if (scrollTop > 200) {
        this.sectionIndicators.classList.add('visible');
      } else {
        this.sectionIndicators.classList.remove('visible');
      }
    }

    // Update active section indicator
    this.updateActiveSectionIndicator();
  }

  updateActiveSectionIndicator() {
    const scrollPos = window.scrollY + window.innerHeight / 3;

    let activeSection: string | null = null;
    for (const section of this.sections) {
      const element = section.element as HTMLElement;
      const offsetTop = element.offsetTop;
      const offsetBottom = offsetTop + element.offsetHeight;

      if (scrollPos >= offsetTop && scrollPos < offsetBottom) {
        activeSection = section.id;
        break;
      }
    }

    // Update indicator classes
    const indicators = this.querySelectorAll('.section-indicator');
    indicators.forEach(indicator => {
      const id = (indicator as HTMLElement).dataset.section;
      if (id === activeSection) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  scrollToSection(sectionId: string) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }

  render() {
    const container = document.createElement('div');

    // Top progress bar
    const progressBar = (
      <div className="scroll-progress-bar">
        <div className="scroll-progress-fill"></div>
      </div>
    ) as HTMLElement;
    container.appendChild(progressBar);

    // Circular scroll to top indicator
    const circleContainer = document.createElement('div');
    circleContainer.className = 'scroll-progress-circle';
    circleContainer.onclick = () => this.scrollToTop();

    // Create SVG using DOM methods
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'progressGradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '100%');
    gradient.setAttribute('y2', '0%');

    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('style', 'stop-color:#667eea;stop-opacity:1');

    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('style', 'stop-color:#764ba2;stop-opacity:1');

    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    svg.appendChild(defs);

    const circleBg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circleBg.setAttribute('class', 'progress-circle-bg');
    circleBg.setAttribute('cx', '50');
    circleBg.setAttribute('cy', '50');
    circleBg.setAttribute('r', '45');

    const circleFill = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circleFill.setAttribute('class', 'progress-circle-fill');
    circleFill.setAttribute('cx', '50');
    circleFill.setAttribute('cy', '50');
    circleFill.setAttribute('r', '45');

    svg.appendChild(circleBg);
    svg.appendChild(circleFill);
    circleContainer.appendChild(svg);

    const icon = (<div className="progress-circle-icon">↑</div>) as HTMLElement;
    circleContainer.appendChild(icon);

    container.appendChild(circleContainer);

    // Section indicators
    const sectionIndicators = (
      <div className="section-progress-indicators">
        {() => this.sections.map(section => (
          <div
            className="section-indicator"
            data-section={section.id}
            data-label={section.label}
            onClick={() => this.scrollToSection(section.id)}
          ></div>
        ))}
      </div>
    ) as HTMLElement;
    container.appendChild(sectionIndicators);

    return container;
  }
}
