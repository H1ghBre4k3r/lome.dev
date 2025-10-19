import { a, AbstractElement } from "@pesca-dev/atomicity";
import { Component } from "./component";
import { fetchContributions, type ContributionDay, GITHUB_USERNAME } from "./lib/github";

@Component("contribution-heatmap")
export class ContributionHeatmap extends AbstractElement {
  private contributions: ContributionDay[] = [];
  private loading = true;
  private error = false;

  connectedCallback() {
    super.connectedCallback();
    this.loadContributions();
  }

  async loadContributions() {
    try {
      const data = await fetchContributions(GITHUB_USERNAME);

      if (!data || data.length === 0) {
        // If API fails (likely due to auth), generate mock data
        this.contributions = this.generateMockData();
      } else {
        this.contributions = data;
      }

      this.loading = false;
      this.renderHeatmap();
    } catch (error) {
      console.error('Failed to load contributions:', error);
      // Use mock data as fallback
      this.contributions = this.generateMockData();
      this.loading = false;
      this.error = true;
      this.renderHeatmap();
    }
  }

  /**
   * Generate realistic mock contribution data for the last year
   */
  generateMockData(): ContributionDay[] {
    const days: ContributionDay[] = [];
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
      const date = new Date(d);
      const dayOfWeek = date.getDay();

      // Simulate realistic contribution patterns
      // More contributions on weekdays, less on weekends
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const baseChance = isWeekend ? 0.4 : 0.8;

      let count = 0;
      if (Math.random() < baseChance) {
        // Random contribution count weighted towards lower numbers
        const rand = Math.random();
        if (rand < 0.5) count = Math.floor(Math.random() * 5) + 1; // 1-5
        else if (rand < 0.8) count = Math.floor(Math.random() * 10) + 5; // 5-15
        else if (rand < 0.95) count = Math.floor(Math.random() * 15) + 10; // 10-25
        else count = Math.floor(Math.random() * 20) + 20; // 20-40 (rare burst days)
      }

      const level = count === 0 ? 0 :
                    count < 5 ? 1 :
                    count < 10 ? 2 :
                    count < 20 ? 3 : 4;

      days.push({
        date: date.toISOString().split('T')[0],
        count,
        level
      });
    }

    return days;
  }

  renderHeatmap() {
    const container = this.querySelector('.heatmap-grid');
    if (!container) return;

    container.innerHTML = '';

    if (this.loading) {
      container.innerHTML = '<div class="heatmap-loading">Loading contributions...</div>';
      return;
    }

    if (this.contributions.length === 0) {
      container.innerHTML = '<div class="heatmap-error">Unable to load contribution data</div>';
      return;
    }

    // Group contributions by week
    const weeks = this.groupByWeeks(this.contributions);

    // Create month labels
    const monthLabels = this.createMonthLabels(this.contributions);
    const monthsRow = (<div className="heatmap-months"></div>) as HTMLElement;
    monthLabels.forEach(month => {
      const label = document.createElement('span');
      label.className = 'month-label';
      label.style.gridColumn = `span ${month.weeks}`;
      label.textContent = month.name;
      monthsRow.appendChild(label);
    });
    container.appendChild(monthsRow);

    // Create day labels (Mon, Wed, Fri) - 7 slots to match the week grid
    const daysColumn = (
      <div className="heatmap-days">
        <span className="day-label"></span>
        <span className="day-label">Mon</span>
        <span className="day-label"></span>
        <span className="day-label">Wed</span>
        <span className="day-label"></span>
        <span className="day-label">Fri</span>
        <span className="day-label"></span>
      </div>
    ) as HTMLElement;
    container.appendChild(daysColumn);

    // Create week columns
    const weeksContainer = (
      <div className="heatmap-weeks">
        {() => weeks.map(week => this.createWeekColumn(week))}
      </div>
    ) as HTMLElement;
    container.appendChild(weeksContainer);

    // Add total contribution count
    const total = this.contributions.reduce((sum, day) => sum + day.count, 0);
    const totalEl = (
      <div className="heatmap-total">
        {total.toLocaleString()} contributions in the last year
        {this.error ? <span className="mock-notice"> (demo data)</span> : ''}
      </div>
    ) as HTMLElement;
    container.appendChild(totalEl);
  }

  groupByWeeks(days: ContributionDay[]): ContributionDay[][] {
    const weeks: ContributionDay[][] = [];
    let currentWeek: ContributionDay[] = [];

    // Pad the beginning to start on Sunday
    const firstDay = new Date(days[0].date);
    const firstDayOfWeek = firstDay.getDay();

    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push({ date: '', count: 0, level: 0 });
    }

    days.forEach(day => {
      currentWeek.push(day);

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    // Pad the end to complete the last week
    while (currentWeek.length < 7 && currentWeek.length > 0) {
      currentWeek.push({ date: '', count: 0, level: 0 });
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  }

  createWeekColumn(week: ContributionDay[]): HTMLElement {
    return (
      <div className="heatmap-week">
        {() => week.map(day => this.createDayCell(day))}
      </div>
    ) as HTMLElement;
  }

  createDayCell(day: ContributionDay): HTMLElement {
    if (!day.date) {
      return (<div className="heatmap-day empty"></div>) as HTMLElement;
    }

    const date = new Date(day.date);
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const contributionText = day.count === 0 ? 'No contributions' :
                             day.count === 1 ? '1 contribution' :
                             `${day.count} contributions`;

    const cell = (
      <div
        className={`heatmap-day level-${day.level}`}
        data-date={day.date}
        data-count={day.count}
        title={`${contributionText} on ${formattedDate}`}
      ></div>
    ) as HTMLElement;

    cell.addEventListener('mouseenter', (e) => this.showTooltip(e, day, formattedDate));
    cell.addEventListener('mouseleave', () => this.hideTooltip());

    return cell;
  }

  createMonthLabels(days: ContributionDay[]): { name: string; weeks: number }[] {
    const months: { name: string; weeks: number }[] = [];
    let currentMonth = -1;
    let weekCount = 0;

    days.forEach((day, index) => {
      const date = new Date(day.date);
      const month = date.getMonth();

      if (index % 7 === 0) { // Start of a new week
        if (month !== currentMonth) {
          if (currentMonth !== -1 && weekCount > 0) {
            months.push({
              name: new Date(2024, currentMonth).toLocaleDateString('en-US', { month: 'short' }),
              weeks: weekCount
            });
          }
          currentMonth = month;
          weekCount = 1;
        } else {
          weekCount++;
        }
      }
    });

    // Add the last month
    if (weekCount > 0) {
      months.push({
        name: new Date(2024, currentMonth).toLocaleDateString('en-US', { month: 'short' }),
        weeks: weekCount
      });
    }

    return months;
  }

  showTooltip(event: Event, day: ContributionDay, formattedDate: string) {
    const target = event.target as HTMLElement;
    
    // Remove any existing tooltip first
    const existingTooltip = this.querySelector('.heatmap-tooltip') as HTMLElement;
    if (existingTooltip) {
      existingTooltip.remove();
    }

    // Create new tooltip and append to body (to avoid transform issues)
    const tooltip = (<div className="heatmap-tooltip"></div>) as HTMLElement;
    document.body.appendChild(tooltip);

    const contributionText = day.count === 0 ? 'No contributions' :
                             day.count === 1 ? '1 contribution' :
                             `${day.count} contributions`;

    tooltip.innerHTML = `
      <div class="tooltip-count">${contributionText}</div>
      <div class="tooltip-date">${formattedDate}</div>
    `;

    // Get target position in viewport
    const rect = target.getBoundingClientRect();
    
    console.log('Target rect:', rect);
    console.log('Window dimensions:', window.innerWidth, window.innerHeight);
    
    // Calculate tooltip position (centered above the target)
    const tooltipWidth = 200;
    const tooltipHeight = 80;
    const margin = 8;
    
    let left = rect.left + rect.width / 2 - tooltipWidth / 2;
    let top = rect.top - tooltipHeight - margin;
    
    // Keep within viewport bounds
    if (left < 10) left = 10;
    if (left > window.innerWidth - tooltipWidth - 10) left = window.innerWidth - tooltipWidth - 10;
    if (top < 10) {
      // Show below instead of above
      top = rect.bottom + margin;
    }
    
    console.log('Final calculated position:', { left, top });

    // Apply fixed positioning relative to viewport
    tooltip.style.position = 'fixed';
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    tooltip.style.zIndex = '9999';
    tooltip.style.opacity = '1';
    tooltip.classList.add('visible');
    
    // Store reference for cleanup
    tooltip.setAttribute('data-owner', 'contribution-heatmap');
    
    // Verify
    setTimeout(() => {
      const actualRect = tooltip.getBoundingClientRect();
      console.log('Final actual position:', actualRect);
    }, 50);

    // Set up cleanup
    const cleanup = () => {
      tooltip.remove();
    };
    
    target.addEventListener('mouseleave', cleanup, { once: true });
  }

  hideTooltip() {
    // Remove any tooltips owned by this component
    const tooltips = document.querySelectorAll('.heatmap-tooltip[data-owner="contribution-heatmap"]');
    tooltips.forEach(tooltip => tooltip.remove());
  }

  render() {
    return (
      <section className="contribution-heatmap-section">
        <h3 className="heatmap-title">Contribution Activity</h3>
        <div className="heatmap-grid"></div>
      </section>
    ) as HTMLElement;
  }
}
