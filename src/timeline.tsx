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
          {(entry.tags && entry.tags.length > 0) ? (
            <div className="timeline-tags">
              {() => entry?.tags?.map(tag => <span className="tag">{tag}</span>)}
            </div>
          ) : ''}
          {() => {
            if (!(entry.details || entry.achievements || entry.skills)) return '';

            const wrapper = document.createElement('div');
            wrapper.className = 'timeline-expandable-wrapper';

            const expandable = (
              <div className="timeline-expandable">
                {entry.details ? (<p className="timeline-details">{entry.details}</p>) : ''}
                {(entry.achievements && entry.achievements.length > 0) ? (
                  <div className="timeline-achievements">
                    <h4 className="expandable-title">✨ Key Achievements</h4>
                    <ul className="achievements-list">
                      {() => entry.achievements?.map(achievement => <li>{achievement}</li>)}
                    </ul>
                  </div>
                ) : ''}
                {(entry.skills && entry.skills.length > 0) ? (
                  <div className="timeline-skills">
                    <h4 className="expandable-title">🛠️ Technologies & Skills</h4>
                    <div className="skills-tags">
                      {() => entry.skills?.map(skill => <span className="skill-tag">{skill}</span>)}
                    </div>
                  </div>
                ) : ''}
              </div>
            ) as HTMLElement;

            const button = (
              <button className="timeline-toggle" aria-expanded="false" onClick={(e: Event) => {
                const btn = e.currentTarget as HTMLButtonElement;
                const item = btn.closest('.timeline-item') as HTMLElement | null;
                if (!item) return;
                const expanded = item.classList.toggle('expanded');
                btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
                btn.textContent = expanded ? 'Show less ↑' : 'Show more ↓';
              }}>
                <span>Show more ↓</span>
              </button>
            ) as HTMLElement;

            wrapper.appendChild(expandable);
            wrapper.appendChild(button);
            return wrapper;
          }}
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
