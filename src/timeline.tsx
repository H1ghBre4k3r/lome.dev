import { a, AbstractElement } from "@pesca-dev/atomicity";
import "./timeline.css";
import { Component } from "./component";
import { TIMELINE_ENTRIES } from "./data/timeline";
import { addScrollReveal } from "./scroll-reveal";

@Component("website-timeline")
export class WebsiteTimeline extends AbstractElement {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();

    // Initialize scroll reveal for timeline items
    setTimeout(() => {
      const timelineItems = this.querySelectorAll('.timeline-item');
      if (timelineItems.length > 0) {
        addScrollReveal(timelineItems);
      }
    }, 100);
  }

  timelineEntries = () => {
    return TIMELINE_ENTRIES.map((entry) => (
      <div className={`timeline-item scroll-reveal ${entry.type}`}>
        <div className="timeline-marker">
          <span className="marker-icon">{entry.icon || '•'}</span>
        </div>
        <div className="timeline-content">
          <div className="timeline-header">
            <div className="timeline-date">{entry.date}</div>
            <span className={`timeline-type ${entry.type}`}>{entry.type}</span>
          </div>
          <h3 className="timeline-title">
            {entry.link ? (
              <a href={entry.link} target="_blank" rel="noopener noreferrer">{entry.title}</a>
            ) : entry.title}
          </h3>
          <div className="timeline-org">{entry.organization}</div>
          <p className="timeline-description">{entry.description}</p>
          {entry.tags && entry.tags.length > 0 && (
            <div className="timeline-tags">
              {() => entry?.tags?.map(tag => <span className="tag">{tag}</span>)}
            </div>
          )}
          <button className="timeline-toggle" aria-expanded="false" onClick={(e: Event) => {
            const btn = e.currentTarget as HTMLButtonElement;
            const item = btn.closest('.timeline-item') as HTMLElement | null;
            if (!item) return;
            const expanded = item.classList.toggle('expanded');
            btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            btn.textContent = expanded ? 'Show less' : 'Show more';
          }}>Show more</button>
        </div>
      </div>
    ));
  }

  render() {
    return (
      <section className="timeline-section">
        <h2 className="section-title">My Journey</h2>
        <p className="timeline-intro">
          From learning my first programming language to building compilers and leading communities.
        </p>
        <div className="timeline">
          <div className="timeline-line"></div>
          <div className="timeline-entries">{this.timelineEntries}</div>
        </div>
      </section>
    ) as HTMLElement;
  }
}
