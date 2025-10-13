import { a, AbstractElement } from "@pesca-dev/atomicity";
import { Component } from "./component";
import { fetchEnhancedStats } from "./lib/github";

interface StatItem { label: string; value: number; id: string; }

@Component("github-stats")
export class GitHubStats extends AbstractElement {
  private stats: StatItem[] = [
    { id: "stars", label: "GitHub Stars", value: 748 },
    { id: "repos", label: "Repositories", value: 85 },
    { id: "forks", label: "Total Forks", value: 120 },
    { id: "followers", label: "Followers", value: 150 },
    { id: "years", label: "Years Coding", value: 8 },
    { id: "public", label: "Public Repos", value: 90 }
  ];

  connectedCallback() {
    super.connectedCallback();
    // Start count-up shortly after mount for initial values
    setTimeout(() => this.animateCounters(), 300);
    // Fetch live values
    this.fetchLiveStats().catch(console.error);
  }

  async fetchLiveStats() {
    try {
      const stats = await fetchEnhancedStats();
      if (!stats) return;

      // Update stat values
      const updates = [
        { id: 'stars', value: stats.stars },
        { id: 'repos', value: stats.repos },
        { id: 'forks', value: stats.forks },
        { id: 'followers', value: stats.followers },
        { id: 'years', value: stats.yearsCoding },
        { id: 'public', value: stats.publicRepos }
      ];

      // Update DOM values directly
      updates.forEach(({ id, value }) => {
        const el = this.querySelector(`.stat-value[data-id="${id}"]`) as HTMLElement | null;
        if (el) {
          el.dataset.value = String(value);
          el.textContent = '0';
        }
      });

      // Re-animate with new values
      this.animateCounters();
    } catch (error) {
      console.error('Failed to fetch GitHub stats:', error);
    }
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

  cards = () => {
    return this.stats.map(({ id, value, label }) => {
      return <div className="stat-card">
        <div className="stat-value" data-id={id} data-value={`${value}`}>0</div>
        <div className="stat-label">{label}</div>
      </div>
    })
  }

  render() {
    return (
      <section className="github-stats">
        <div className="stats-grid">{this.cards}</div>
      </section>
    )
  }
}
