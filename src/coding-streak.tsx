import { a, AbstractElement } from "@pesca-dev/atomicity";
import { Component } from "./component";
import { fetchContributions, calculateStreak, type ContributionDay, GITHUB_USERNAME } from "./lib/github";

@Component("coding-streak")
export class CodingStreak extends AbstractElement {
  private currentStreak = 0;
  private longestStreak = 0;
  private loading = true;
  private contributions: ContributionDay[] = [];

  connectedCallback() {
    super.connectedCallback();
    this.loadStreak();
  }

  async loadStreak() {
    try {
      const data = await fetchContributions(GITHUB_USERNAME);

      if (!data || data.length === 0) {
        // Fallback to mock data
        this.currentStreak = 47;
        this.longestStreak = 156;
        this.contributions = this.generateMockContributions();
      } else {
        const streak = calculateStreak(data);
        this.currentStreak = streak.current;
        this.longestStreak = streak.longest;
        this.contributions = data;
      }

      this.loading = false;
      this.renderStreak();
    } catch (error) {
      console.error('Failed to load streak data:', error);
      this.currentStreak = 47;
      this.longestStreak = 156;
      this.contributions = this.generateMockContributions();
      this.loading = false;
      this.renderStreak();
    }
  }

  generateMockContributions(): ContributionDay[] {
    const days: ContributionDay[] = [];
    const today = new Date();

    // Generate last 60 days with mostly contributions
    for (let i = 59; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const count = i < 47 ? Math.floor(Math.random() * 15) + 1 : 0;

      days.push({
        date: date.toISOString().split('T')[0],
        count,
        level: count === 0 ? 0 : count < 5 ? 1 : count < 10 ? 2 : count < 15 ? 3 : 4
      });
    }

    return days;
  }

  renderStreak() {
    const container = this.querySelector('.streak-content');
    if (!container) return;

    container.innerHTML = '';

    if (this.loading) {
      container.innerHTML = '<div class="streak-loading">Calculating streak...</div>';
      return;
    }

    // Create streak cards
    const statsGrid = (
      <div className="streak-stats">
        <div className="streak-card current">
          <div className="streak-icon">🔥</div>
          <div className="streak-value">{this.currentStreak}</div>
          <div className="streak-label">Day{this.currentStreak !== 1 ? 's' : ''} Current Streak</div>
          <div className="streak-message">{this.getStreakMessage(this.currentStreak)}</div>
        </div>
        <div className="streak-card longest">
          <div className="streak-icon">🏆</div>
          <div className="streak-value">{this.longestStreak}</div>
          <div className="streak-label">Day{this.longestStreak !== 1 ? 's' : ''} Longest Streak</div>
          <div className="streak-milestone">{this.getMilestone(this.longestStreak)}</div>
        </div>
      </div>
    ) as HTMLElement;

    container.appendChild(statsGrid);

    // Create recent activity visualization
    const recentDays = this.contributions.slice(-28);
    const activity = (
      <div className="streak-activity">
        <div className="activity-title">Last 28 Days</div>
        <div className="activity-grid">
          {() => recentDays.map(day => this.createActivityDay(day))}
        </div>
      </div>
    ) as HTMLElement;

    container.appendChild(activity);
  }

  createActivityDay(day: ContributionDay): HTMLElement {
    const date = new Date(day.date);
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });

    return (
      <div
        className={`activity-day level-${day.level}`}
        title={`${day.count} contribution${day.count !== 1 ? 's' : ''} on ${formattedDate}`}
      ></div>
    ) as HTMLElement;
  }

  getStreakMessage(days: number): string {
    if (days === 0) return "Start your streak today!";
    if (days < 7) return "Building momentum!";
    if (days < 30) return "Great consistency!";
    if (days < 100) return "Impressive dedication!";
    if (days < 365) return "Coding machine!";
    return "Legendary streak!";
  }

  getMilestone(days: number): string {
    if (days >= 365) return "🌟 Year+ Milestone";
    if (days >= 180) return "🎯 Half Year Milestone";
    if (days >= 100) return "💯 Century Milestone";
    if (days >= 30) return "📅 Month Milestone";
    if (days >= 7) return "⭐ Week Milestone";
    return "🚀 Keep going!";
  }

  render() {
    return (
      <section className="coding-streak-section">
        <h3 className="streak-title">Coding Streak</h3>
        <div className="streak-content"></div>
      </section>
    ) as HTMLElement;
  }
}
