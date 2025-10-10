import { a, AbstractElement } from "@pesca-dev/atomicity";
import "./skills.css";
import { Component } from "./component";
import {
  SKILL_CATEGORIES,
  CURRENTLY_LEARNING,
  SOFT_SKILLS,
  getSkillLevelPercentage,
  getSkillLevelColor
} from "./data/skills";
import { addScrollReveal } from "./scroll-reveal";

@Component("website-skills")
export class WebsiteSkills extends AbstractElement {
  constructor() {
    super();
  }

  skillCategories = () => {
    return SKILL_CATEGORIES.map((category) => (
      <div className="skill-category">
        <h3 className="category-title">
          <span className="category-icon">{category.icon}</span>
          {category.title}
        </h3>
        <div className="skills-grid">
          {() => category.skills.map(skill => {
            const percentage = getSkillLevelPercentage(skill.level);
            const color = skill.color || getSkillLevelColor(skill.level);

            return (
              <div className={`skill-card scroll-reveal ${skill.projects && skill.projects.length > 0 ? 'clickable' : ''}`} tabIndex={skill.projects && skill.projects.length ? 0 : undefined} data-projects={(skill.projects||[]).join('|')} data-skill={skill.name} data-level={skill.level}>
                <div className="skill-name">{skill.name}</div>
                <div className="skill-level-bar">
                  <div className="skill-level-fill" data-percentage={percentage} data-color={color}></div>
                </div>
                <div className="skill-level-text">{skill.level}</div>
              </div>
            );
          })}
        </div>
      </div>
    ));
  }

  learningTags = () => {
    return CURRENTLY_LEARNING.map(item => (
      <span className="learning-tag">{item}</span>
    ));
  }

  softSkillItems = () => {
    return SOFT_SKILLS.map(skill => (
      <div className="soft-skill-item">
        <span className="check-icon">✓</span>
        <span>{skill}</span>
      </div>
    ));
  }

  connectedCallback() {
    super.connectedCallback();

    const init = () => {
      const bars = this.querySelectorAll('.skill-level-fill');
      const elements = this.querySelectorAll('.skill-card.scroll-reveal, .currently-learning.scroll-reveal, .soft-skills.scroll-reveal');
      if (bars.length === 0 || elements.length === 0) return requestAnimationFrame(init);

      // Modal wiring
      if (!this.modalEl) {
        this.modalEl = document.createElement('div');
        this.modalEl.className = 'skill-modal';
        this.modalEl.innerHTML = `
          <div class="modal-backdrop"></div>
          <div class="modal-content"></div>
          <button class="modal-close" aria-label="Close">×</button>
        `;
        this.modalContent = this.modalEl.querySelector('.modal-content');
        document.body.appendChild(this.modalEl);
        this.modalEl.addEventListener('click', (e) => {
          // Close only when clicking backdrop/close
          if ((e.target as HTMLElement).matches('.modal-backdrop, .modal-close')) this.closeModal();
        });
      }

      // Click/keyboard to open modal
      this.addEventListener('click', (e) => {
        const card = (e.target as HTMLElement).closest('.skill-card.clickable') as HTMLElement | null;
        if (!card) return;
        const name = card.dataset.skill || '';
        const level = card.dataset.level || '';
        const projects = (card.dataset.projects || '').split('|').filter(Boolean);
        this.openModal(name, level, projects);
      });

      this.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          const card = (e.target as HTMLElement).closest('.skill-card.clickable') as HTMLElement | null;
          if (!card) return;
          e.preventDefault();
          const name = card.dataset.skill || '';
          const level = card.dataset.level || '';
          const projects = (card.dataset.projects || '').split('|').filter(Boolean);
          this.openModal(name, level, projects);
          setTimeout(() => this.modalEl?.classList.add('active-ready'));
        }
        if (e.key === 'Escape') this.closeModal();
      });

      bars.forEach((bar) => {
        const el = bar as HTMLElement;
        const percentage = el.dataset.percentage;
        const color = el.dataset.color;
        if (percentage) el.style.setProperty('--level', `${percentage}%`);
        if (color) {
          el.style.backgroundColor = color;
          (el.closest('.skill-card') as HTMLElement)?.style.setProperty('--skill-color', color);
        }
      });

      addScrollReveal(elements);
    };

    requestAnimationFrame(init);
  }

  render() {
    return (
      <section className="skills-section">
        <h2 className="section-title">Skills & Expertise</h2>
        <p className="skills-intro">
          Technologies and tools I work with, from systems programming to web development.
        </p>

        <div className="skills-container">
          {this.skillCategories}
        </div>

        <div className="additional-skills">
          <div className="currently-learning scroll-reveal">
            <h3>🌱 Currently Learning</h3>
            <div className="learning-tags">
              {this.learningTags}
            </div>
          </div>

          <div className="soft-skills scroll-reveal">
            <h3>🤝 Soft Skills</h3>
            <div className="soft-skills-grid">
              {this.softSkillItems}
            </div>
          </div>
        </div>
      </section>
    ) as HTMLElement;
  }

  // Modal state elements
  private modalEl: HTMLElement | null = null;
  private modalContent: HTMLElement | null = null;

  openModal(title: string, level: string, projects: string[]) {
    if (!this.modalEl || !this.modalContent) return;
    this.modalEl.classList.add('active');
    this.modalContent.innerHTML = `
      <div class="modal-skill-name">${title}</div>
      <div class="modal-skill-level">${level}</div>
      ${projects.length ? `<div class="modal-skill-projects"><h4>Projects</h4>${projects.map(p=>`<span class=\"project-tag\">${p}</span>`).join('')}</div>` : ''}
    `;
  }

  closeModal() {
    this.modalEl?.classList.remove('active');
    this.modalEl?.classList.remove('active-ready');
  }
}
