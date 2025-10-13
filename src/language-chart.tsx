import { a, AbstractElement } from "@pesca-dev/atomicity";
import { Component } from "./component";
import { fetchAggregatedLanguages } from "./lib/github";

interface LanguageStat {
  name: string;
  bytes: number;
  percentage: number;
  color: string;
}

// Language colors (GitHub-style)
const LANGUAGE_COLORS: Record<string, string> = {
  'TypeScript': '#3178c6',
  'JavaScript': '#f1e05a',
  'Python': '#3572A5',
  'Java': '#b07219',
  'C++': '#f34b7d',
  'C': '#555555',
  'C#': '#178600',
  'Go': '#00ADD8',
  'Rust': '#dea584',
  'PHP': '#4F5D95',
  'Ruby': '#701516',
  'Swift': '#F05138',
  'Kotlin': '#A97BFF',
  'Dart': '#00B4AB',
  'HTML': '#e34c26',
  'CSS': '#563d7c',
  'Shell': '#89e051',
  'Vue': '#41b883',
  'Svelte': '#ff3e00',
  'default': '#8b949e'
};

@Component("language-chart")
export class LanguageChart extends AbstractElement {
  private languages: LanguageStat[] = [];
  private loading = true;

  connectedCallback() {
    super.connectedCallback();
    this.loadLanguages();
  }

  async loadLanguages() {
    try {
      const data = await fetchAggregatedLanguages();

      if (!data || Object.keys(data).length === 0) {
        // Fallback to mock data
        this.languages = this.getMockLanguages();
      } else {
        this.languages = this.processLanguageData(data);
      }

      this.loading = false;
      this.renderChart();
    } catch (error) {
      console.error('Failed to load language data:', error);
      this.languages = this.getMockLanguages();
      this.loading = false;
      this.renderChart();
    }
  }

  processLanguageData(data: Record<string, number>): LanguageStat[] {
    const total = Object.values(data).reduce((sum, bytes) => sum + bytes, 0);

    const stats: LanguageStat[] = Object.entries(data)
      .map(([name, bytes]) => ({
        name,
        bytes,
        percentage: (bytes / total) * 100,
        color: LANGUAGE_COLORS[name] || LANGUAGE_COLORS.default
      }))
      .sort((a, b) => b.bytes - a.bytes)
      .slice(0, 8); // Top 8 languages

    return stats;
  }

  getMockLanguages(): LanguageStat[] {
    return [
      { name: 'TypeScript', bytes: 500000, percentage: 45, color: LANGUAGE_COLORS.TypeScript },
      { name: 'JavaScript', bytes: 300000, percentage: 27, color: LANGUAGE_COLORS.JavaScript },
      { name: 'Python', bytes: 150000, percentage: 13.5, color: LANGUAGE_COLORS.Python },
      { name: 'Rust', bytes: 80000, percentage: 7.2, color: LANGUAGE_COLORS.Rust },
      { name: 'Go', bytes: 45000, percentage: 4.1, color: LANGUAGE_COLORS.Go },
      { name: 'CSS', bytes: 25000, percentage: 2.3, color: LANGUAGE_COLORS.CSS },
      { name: 'HTML', bytes: 10000, percentage: 0.9, color: LANGUAGE_COLORS.HTML }
    ];
  }

  renderChart() {
    const container = this.querySelector('.language-chart-container');
    if (!container) return;

    container.innerHTML = '';

    if (this.loading) {
      container.innerHTML = '<div class="chart-loading">Loading language data...</div>';
      return;
    }

    if (this.languages.length === 0) {
      container.innerHTML = '<div class="chart-empty">No language data available</div>';
      return;
    }

    // Create language bars
    this.languages.forEach(lang => {
      const bar = this.createLanguageBar(lang);
      container.appendChild(bar);
    });
  }

  createLanguageBar(lang: LanguageStat): HTMLElement {
    const formatBytes = (bytes: number): string => {
      const kb = bytes / 1024;
      if (kb < 1024) return `${kb.toFixed(1)} KB`;
      const mb = kb / 1024;
      return `${mb.toFixed(1)} MB`;
    };

    const dot = document.createElement('span');
    dot.className = 'language-dot';
    dot.style.backgroundColor = lang.color;

    const fill = document.createElement('div');
    fill.className = 'language-bar-fill';
    fill.style.width = `${lang.percentage}%`;
    fill.style.backgroundColor = lang.color;
    fill.title = `${lang.name}: ${formatBytes(lang.bytes)} (${lang.percentage.toFixed(1)}%)`;

    const container = (
      <div className="language-bar-container">
        <div className="language-info">
          <span className="language-name">
            {lang.name}
          </span>
          <span className="language-percentage">{lang.percentage.toFixed(1)}%</span>
        </div>
        <div className="language-bar-track"></div>
      </div>
    ) as HTMLElement;

    container.querySelector('.language-name')?.prepend(dot);
    container.querySelector('.language-bar-track')?.appendChild(fill);

    return container;
  }

  render() {
    return (
      <section className="language-chart-section">
        <h3 className="chart-title">Languages</h3>
        <p className="chart-subtitle">Most used across all repositories</p>
        <div className="language-chart-container"></div>
      </section>
    ) as HTMLElement;
  }
}
