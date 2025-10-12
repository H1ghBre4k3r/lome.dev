import { a, AbstractElement } from "@pesca-dev/atomicity";
import "./projects.css";
import { Component } from "./component";
import { siGithub } from "simple-icons";
import { svg } from "./utils";
import { addCardTiltToAll } from "./card-tilt";
import { addMagneticHover } from "./magnetic-hover";
import { addGlitchText } from "./glitch-text";
import {
  type Project,
  getAllProjects,
  getAllTechnologies,
  getAllCategories,
  filterProjects
} from "./data/projects";

@Component("website-projects")
export class WebsiteProjects extends AbstractElement {
  private projects: Project[] = [];
  private filteredProjects: Project[] = [];
  private showAll = false;
  private filterTechnology = 'all';
  private filterCategory = 'all';
  private filterStatus = 'all';
  private filterSearch = '';
  private projectsContainer: HTMLElement | null = null;

  constructor() {
    super();
    this.projects = getAllProjects();
    this.applyFilters();
  }

  async connectedCallback() {
    super.connectedCallback();
    // Fetch GitHub metadata best-effort
    setTimeout(() => {
      this.renderProjects();
      addCardTiltToAll('.project-card', this);
      addMagneticHover('.project-card', this, {
        strength: 0.25,
        distance: 200,
        rotation: true,
        scale: true
      });
      addGlitchText('.section-title', this, false);
      this.fetchMetadata();
    }, 100);
  }

  applyFilters() {
    this.filteredProjects = filterProjects(this.projects, {
      technology: this.filterTechnology,
      category: this.filterCategory,
      status: this.filterStatus,
      search: this.filterSearch
    });
  }

  renderFilters() {
    if (!this.projectsContainer) return;

    let filterBar = this.projectsContainer.querySelector('.project-filters');
    if (!filterBar) {
      const technologies = getAllTechnologies();
      const categories = getAllCategories();

      filterBar = (
        <div className="project-filters">
          <input
            className="filter-input"
            type="search"
            placeholder="Search projects..."
            aria-label="Search projects"
            onInput={(e: Event) => {
              this.filterSearch = (e.target as HTMLInputElement).value;
              this.applyFilters();
              this.renderProjects();
            }}
          />
          <select
            className="filter-select technology"
            onChange={(e: Event) => {
              this.filterTechnology = (e.target as HTMLSelectElement).value;
              this.applyFilters();
              this.renderProjects();
            }}
          >
            <option value="all">All Technologies</option>
            {() => technologies.map(tech => <option value={tech}>{tech}</option>)}
          </select>
          <select
            className="filter-select category"
            onChange={(e: Event) => {
              this.filterCategory = (e.target as HTMLSelectElement).value;
              this.applyFilters();
              this.renderProjects();
            }}
          >
            <option value="all">All Categories</option>
            {() => categories.map(cat => <option value={cat}>{cat}</option>)}
          </select>
          <select
            className="filter-select status"
            onChange={(e: Event) => {
              this.filterStatus = (e.target as HTMLSelectElement).value;
              this.applyFilters();
              this.renderProjects();
            }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="maintained">Maintained</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      ) as HTMLElement;

      const grid = this.projectsContainer.querySelector('.projects-grid');
      if (grid) {
        this.projectsContainer.insertBefore(filterBar, grid);
      }
    }
  }

  renderProjects() {
    const grid = this.querySelector('.projects-grid');
    if (!grid) return;

    grid.innerHTML = '';

    const projectsToShow = this.showAll ? this.filteredProjects : this.filteredProjects.slice(0, 4);

    if (projectsToShow.length === 0) {
      const emptyMessage = (<p className="projects-empty">No projects match your filters.</p>) as HTMLElement;
      grid.appendChild(emptyMessage);
      return;
    }

    projectsToShow.forEach(project => {
      const card = this.createProjectCard(project);
      grid.appendChild(card);
    });

    // Add "Show All" button if there are more than 4 projects
    if (this.filteredProjects.length > 4 && !this.showAll) {
      const showAllBtn = (
        <button
          className="btn btn-secondary show-all-projects"
          onClick={() => {
            this.showAll = true;
            this.renderProjects();
          }}
        >
          Show All Projects ({this.filteredProjects.length})
        </button>
      ) as HTMLElement;
      grid.appendChild(showAllBtn);
    } else if (this.showAll && this.filteredProjects.length > 4) {
      const showLessBtn = (
        <button
          className="btn btn-secondary show-all-projects"
          onClick={() => {
            this.showAll = false;
            this.renderProjects();
            this.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Show Less
        </button>
      ) as HTMLElement;
      grid.appendChild(showLessBtn);
    }

    // Apply tilt and magnetic effects to new cards
    setTimeout(() => {
      addCardTiltToAll('.project-card', this);
      addMagneticHover('.project-card', this, {
        strength: 0.25,
        distance: 200,
        rotation: true,
        scale: true
      });
    }, 50);
  }

  createProjectCard(project: Project): HTMLElement {
    const statusEmoji = {
      active: '🟢',
      maintained: '🟡',
      archived: '⚪'
    };

    const statusLabel = {
      active: 'Active',
      maintained: 'Maintained',
      archived: 'Archived'
    };

    const card = (
      <div className={`project-card ${project.featured ? 'featured' : ''}`} data-repo={project.repo}>
        <div className="project-header">
          <h3>{project.title}</h3>
          <div className="project-links">
            <a href={`https://github.com/${project.repo}`} target="_blank" rel="noopener noreferrer" className="project-link" aria-label="View on GitHub">
              {svg(siGithub.svg)}
            </a>
          </div>
        </div>
        <div className="project-badges">
          <span className={`status-badge status-${project.status}`} title={statusLabel[project.status]}>
            {statusEmoji[project.status]} {statusLabel[project.status]}
          </span>
          <span className="category-badge">{project.category}</span>
        </div>
        <p className="project-description">{project.description}</p>
        <div className="project-tags">
          {() => project.technologies.map(tech => <span className="tag">{tech}</span>)}
        </div>
        {project.liveDemo ? (
          <a href={project.liveDemo} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-demo">
            Live Demo →
          </a>
        ) : ''}
      </div>
    ) as HTMLElement;

    // Add holographic mouse tracking effect
    card.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;

      card.style.setProperty('--mouse-x', `${deltaX * 30}px`);
      card.style.setProperty('--mouse-y', `${deltaY * 30}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mouse-x', '0px');
      card.style.setProperty('--mouse-y', '0px');
    });

    return card;
  }

  async fetchMetadata() {
    const cards = this.querySelectorAll('.project-card');
    await Promise.all(Array.from(cards).map(async (card) => {
      const repo = (card as HTMLElement).dataset.repo;
      if (!repo) return;

      try {
        const [res, langRes] = await Promise.all([
          fetch(`https://api.github.com/repos/${repo}`),
          fetch(`https://api.github.com/repos/${repo}/languages`)
        ]);

        if (!res.ok) return;

        const data = await res.json();
        const meta = (
          <div className="project-meta">
            <span className="meta-badge">★ {data.stargazers_count}</span>
            <span className="meta-badge">⑂ {data.forks_count}</span>
            <span className="meta-badge">Updated {new Date(data.pushed_at).toLocaleDateString()}</span>
          </div>
        ) as HTMLElement;

        // Insert metadata after project-badges
        const badges = card.querySelector('.project-badges');
        if (badges && badges.nextSibling) {
          badges.parentNode?.insertBefore(meta, badges.nextSibling);
        }

        // Languages - add to bottom
        if (langRes.ok) {
          const langs = await langRes.json();
          const entries = Object.entries(langs) as [string, number][];
          entries.sort((a, b) => b[1] - a[1]);
          const top = entries.slice(0, 3).map(e => e[0]);

          if (top.length) {
            const langDiv = (
              <div className="project-languages">
                <span className="languages-label">Languages:</span>
                {() => top.map(name => <span className="lang-badge">{name}</span>)}
              </div>
            ) as HTMLElement;
            card.appendChild(langDiv);
          }
        }
      } catch (error) {
        console.error(`Failed to fetch metadata for ${repo}:`, error);
      }
    }));
  }

  render() {
    const section = (
      <section className="projects" id="projects">
        <div className="projects-content">
          <h2 className="section-title">Projects</h2>
          <p className="section-description">
            From programming language compilers to reactive web frameworks, distributed monitoring systems to API wrappers — 
            these projects showcase my expertise in systems programming, web technologies, and developer tooling.
          </p>
          <div className="projects-grid">
            <p className="projects-loading">Loading projects...</p>
          </div>
        </div>
      </section>
    ) as HTMLElement;

    this.projectsContainer = section.querySelector('.projects-content');

    // Render filters once we have the container
    setTimeout(() => this.renderFilters(), 0);

    return section;
  }
}
