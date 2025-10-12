/**
 * GitHub API integration utilities
 * Handles fetching, caching, and error handling for GitHub data
 */

export const GITHUB_USERNAME = 'H1ghBre4k3r';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
const GITHUB_API_BASE = 'https://api.github.com';

// Type definitions
export interface GitHubRepo {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  language: string | null;
  languages_url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
}

export interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface ContributionDay {
  date: string;
  count: number;
  level: number; // 0-4 intensity level
}

export interface ContributionWeek {
  days: ContributionDay[];
}

export interface CachedData<T> {
  data: T;
  timestamp: number;
}

/**
 * Cache utilities
 */
function getCacheKey(key: string): string {
  return `github_cache_${key}`;
}

function getCachedData<T>(key: string): T | null {
  try {
    const cached = localStorage.getItem(getCacheKey(key));
    if (!cached) return null;

    const { data, timestamp }: CachedData<T> = JSON.parse(cached);
    const age = Date.now() - timestamp;

    if (age > CACHE_DURATION) {
      localStorage.removeItem(getCacheKey(key));
      return null;
    }

    return data;
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
}

function setCachedData<T>(key: string, data: T): void {
  try {
    const cacheData: CachedData<T> = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(getCacheKey(key), JSON.stringify(cacheData));
  } catch (error) {
    console.error('Cache write error:', error);
  }
}

/**
 * Fetch with caching and error handling
 */
async function fetchWithCache<T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<T | null> {
  // Check cache first
  const cached = getCachedData<T>(key);
  if (cached) return cached;

  // Fetch fresh data
  try {
    const data = await fetcher();
    setCachedData(key, data);
    return data;
  } catch (error) {
    console.error(`GitHub API error for ${key}:`, error);
    return null;
  }
}

/**
 * Fetch user profile
 */
export async function fetchGitHubUser(): Promise<GitHubUser | null> {
  return fetchWithCache(`user_${GITHUB_USERNAME}`, async () => {
    const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  });
}

/**
 * Fetch user repositories
 */
export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  const data = await fetchWithCache(`repos_${GITHUB_USERNAME}`, async () => {
    const response = await fetch(
      `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?per_page=100&type=owner&sort=updated`
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  });

  return data || [];
}

/**
 * Fetch languages for a specific repository
 */
export async function fetchRepoLanguages(owner: string, repo: string): Promise<Record<string, number>> {
  const data = await fetchWithCache(`languages_${owner}_${repo}`, async () => {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/languages`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  });

  return data || {};
}

/**
 * Aggregate languages across all repositories
 */
export async function fetchAggregatedLanguages(): Promise<Record<string, number>> {
  const repos = await fetchGitHubRepos();
  const ownRepos = repos.filter(repo => !repo.fork);

  const languageTotals: Record<string, number> = {};

  // Note: This makes many API calls. Consider caching aggressively or using GraphQL
  const languagePromises = ownRepos.map(async repo => {
    const [owner, repoName] = repo.full_name.split('/');
    const languages = await fetchRepoLanguages(owner, repoName);

    Object.entries(languages).forEach(([lang, bytes]) => {
      languageTotals[lang] = (languageTotals[lang] || 0) + bytes;
    });
  });

  await Promise.all(languagePromises);
  return languageTotals;
}

/**
 * Fetch contribution data using GraphQL
 */
export async function fetchContributions(username: string = GITHUB_USERNAME): Promise<ContributionDay[]> {
  const data = await fetchWithCache(`contributions_${username}`, async () => {
    const query = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                  contributionLevel
                }
              }
            }
          }
        }
      }
    `;

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { username }
      })
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    const weeks = result.data?.user?.contributionsCollection?.contributionCalendar?.weeks || [];
    const days: ContributionDay[] = [];

    weeks.forEach((week) => {
      week.contributionDays.forEach((day) => {
        days.push({
          date: day.date,
          count: day.contributionCount,
          level: day.contributionLevel === 'NONE' ? 0 :
            day.contributionLevel === 'FIRST_QUARTILE' ? 1 :
              day.contributionLevel === 'SECOND_QUARTILE' ? 2 :
                day.contributionLevel === 'THIRD_QUARTILE' ? 3 : 4
        });
      });
    });

    return days;
  });

  return data || [];
}

/**
 * Calculate coding streak from contribution data
 */
export function calculateStreak(contributions: ContributionDay[]): {
  current: number;
  longest: number;
} {
  if (contributions.length === 0) return { current: 0, longest: 0 };

  // Sort by date descending (most recent first)
  const sorted = [...contributions].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let foundToday = false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  for (let i = 0; i < sorted.length; i++) {
    const day = sorted[i];
    const date = new Date(day.date);
    date.setHours(0, 0, 0, 0);

    // Check if we have activity today or yesterday (current streak is still valid)
    if (!foundToday && (date.getTime() === today.getTime() || date.getTime() === yesterday.getTime())) {
      foundToday = true;
    }

    if (day.count > 0) {
      tempStreak++;

      if (foundToday && i === 0) {
        currentStreak = tempStreak;
      }

      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      if (foundToday && currentStreak === 0) {
        currentStreak = tempStreak;
      }
      tempStreak = 0;
    }
  }

  // If we found today/yesterday, the current streak should be set
  if (foundToday && currentStreak === 0) {
    currentStreak = tempStreak;
  }

  return { current: currentStreak, longest: longestStreak };
}

/**
 * Get basic GitHub stats (for enhanced stats component)
 */
export async function fetchEnhancedStats() {
  const [user, repos] = await Promise.all([
    fetchGitHubUser(),
    fetchGitHubRepos()
  ]);

  if (!user || !repos) return null;

  const ownRepos = repos.filter(repo => !repo.fork);
  const totalStars = ownRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalForks = ownRepos.reduce((sum, repo) => sum + repo.forks_count, 0);

  // Calculate years of coding (from account creation)
  const accountAge = new Date().getFullYear() - new Date(user.created_at).getFullYear();

  return {
    stars: totalStars,
    repos: ownRepos.length,
    forks: totalForks,
    followers: user.followers,
    yearsCoding: Math.max(accountAge, 1),
    publicRepos: user.public_repos
  };
}

/**
 * Clear all GitHub caches (useful for debugging)
 */
export function clearGitHubCache(): void {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('github_cache_')) {
      localStorage.removeItem(key);
    }
  });
}
