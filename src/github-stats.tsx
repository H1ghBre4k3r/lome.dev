import { a, AbstractElement } from "@pesca-dev/atomicity";
import "./github-stats.css";
import { Component } from "./component";

interface StatItem { label: string; value: number; id: string; }

@Component("github-stats")
export class GitHubStats extends AbstractElement {
  private gridEl: HTMLElement | null = null;
  private stats: StatItem[] = [
    { id: "stars", label: "GitHub Stars", value: 748 },
    { id: "repos", label: "Repositories", value: 85 },
    { id: "years", label: "Years Coding", value: 8 },
    { id: "projects", label: "Projects", value: 25 }
  ];

  connectedCallback() {
    super.connectedCallback();
    this.buildCards();
    // Optional: attempt live fetch (no token, best-effort)
    this.tryFetch().catch(() => {});
    // Start count-up shortly after mount
    setTimeout(() => this.animateCounters(), 300);
  }

  async tryFetch() {
    try {
      const user = "H1ghBre4k3r";
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${user}`),
        fetch(`https://api.github.com/users/${user}/repos?per_page=100&type=owner&sort=updated`)
      ]);
      if (!userRes.ok || !reposRes.ok) return;
      await userRes.json();
      const repos = await reposRes.json();
      const ownRepos = repos.filter((r: any) => !r.fork);
      const starsSum = ownRepos.reduce((acc: number, r: any) => acc + (r.stargazers_count || 0), 0);
      const reposCount = ownRepos.length;
      const stars = starsSum && starsSum > reposCount ? starsSum : 748;
      this.stats = [
        { id: "stars", label: "GitHub Stars", value: stars },
        { id: "repos", label: "Repositories", value: reposCount || 85 },
        { id: "years", label: "Years Coding", value: 8 },
        { id: "projects", label: "Projects", value: 25 }
      ];
      this.buildCards();
      this.animateCounters();
    } catch {}
  }

  animateCounters() {
    const cards = this.querySelectorAll(".stat-value");
    cards.forEach((el) => {
      const target = Number((el as HTMLElement).dataset.value);
      let current = 0;
      const duration = 1200;
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        current = Math.floor(target * (0.2 + 0.8 * p * (2 - p))); // ease-out
        (el as HTMLElement).textContent = String(current);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  buildCards() {
    if (!this.gridEl) return;
    this.gridEl.innerHTML = "";
    this.stats.forEach((s) => {
      const card = document.createElement('div');
      card.className = 'stat-card';
      const val = document.createElement('div');
      val.className = 'stat-value';
      (val as HTMLElement).dataset.id = s.id;
      (val as HTMLElement).dataset.value = String(s.value);
      val.textContent = '0';
      const label = document.createElement('div');
      label.className = 'stat-label';
      label.textContent = s.label;
      card.appendChild(val);
      card.appendChild(label);
      this.gridEl!.appendChild(card);
    });
  }

  render() {
    const el = (
      <section className="github-stats">
        <div className="stats-grid"></div>
      </section>
    ) as HTMLElement;

    this.gridEl = el.querySelector('.stats-grid');
    return el;
  }
}
