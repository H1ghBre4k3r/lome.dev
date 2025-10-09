import { a, AbstractElement } from "@pesca-dev/atomicity";
import "./achievements.css";
import { Component } from "./component";

interface Badge { key: string; title: string; desc: string; icon?: string; }

const BADGES: Badge[] = [
  { key: "pull-shark", title: "Pull Shark ×3", desc: "Merged PRs across projects" },
  { key: "arctic", title: "Arctic Code Vault", desc: "Archive Program 2020" },
  { key: "starstruck", title: "Starstruck", desc: "Project received stars" },
  { key: "pair", title: "Pair Extraordinaire", desc: "Collaborative PRs" },
  { key: "yolo", title: "YOLO", desc: "Hotfix merged quickly" },
  { key: "quickdraw", title: "Quickdraw", desc: "Fast response to issues" }
];

@Component("website-achievements")
export class WebsiteAchievements extends AbstractElement {
  private gridEl: HTMLElement | null = null;

  connectedCallback() {
    super.connectedCallback();
    this.build();
  }

  build() {
    if (!this.gridEl) return;
    this.gridEl.innerHTML = '';
    BADGES.forEach(b => {
      const badge = document.createElement('div');
      badge.className = 'badge';
      badge.title = b.desc;
      const medal = document.createElement('div');
      medal.className = 'badge-medal';
      medal.setAttribute('aria-hidden', 'true');
      const title = document.createElement('div');
      title.className = 'badge-title';
      title.textContent = b.title;
      badge.appendChild(medal);
      badge.appendChild(title);
      this.gridEl!.appendChild(badge);
    });
  }

  render() {
    const el = (
      <section className="achievements" aria-label="GitHub achievements">
        <div className="achievements-grid"></div>
      </section>
    ) as HTMLElement;
    this.gridEl = el.querySelector('.achievements-grid');
    return el;
  }
}
