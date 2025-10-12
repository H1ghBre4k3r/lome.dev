export type Theme = 'light' | 'dark' | 'auto';

const THEME_STORAGE_KEY = 'lome-dev-theme';
const THEME_ATTRIBUTE = 'data-theme';

/**
 * Gets the current theme from localStorage
 */
export function getStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'auto') {
      return stored;
    }
  } catch (error) {
    console.error('Failed to get stored theme:', error);
  }
  return null;
}

/**
 * Saves the theme to localStorage
 */
export function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.error('Failed to save theme:', error);
  }
}

/**
 * Gets the system's preferred color scheme
 */
export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark';

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

/**
 * Resolves the effective theme (light or dark) from a theme setting
 */
export function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'auto') {
    return getSystemTheme();
  }
  return theme;
}

/**
 * Applies the theme to the document
 */
export function applyTheme(theme: Theme): void {
  const effectiveTheme = resolveTheme(theme);

  // Set data attribute on document element
  document.documentElement.setAttribute(THEME_ATTRIBUTE, effectiveTheme);

  // Also set class for CSS compatibility
  document.documentElement.classList.remove('light-theme', 'dark-theme');
  document.documentElement.classList.add(`${effectiveTheme}-theme`);
}

/**
 * Initializes theme on page load
 */
export function initializeTheme(): Theme {
  // Get stored theme or default to 'auto'
  const storedTheme = getStoredTheme() || 'auto';

  // Apply the theme immediately to prevent flash
  applyTheme(storedTheme);

  return storedTheme;
}

/**
 * Sets up a listener for system theme changes (only relevant when theme is 'auto')
 */
export function setupSystemThemeListener(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handler = () => {
    const currentTheme = getStoredTheme();
    if (currentTheme === 'auto' || currentTheme === null) {
      applyTheme('auto');
      callback();
    }
  };

  // Modern browsers
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }

  // Legacy browsers
  mediaQuery.addListener(handler);
  return () => mediaQuery.removeListener(handler);
}

/**
 * Cycles to the next theme in the sequence: auto → light → dark → auto
 */
export function cycleTheme(currentTheme: Theme): Theme {
  const themes: Theme[] = ['auto', 'light', 'dark'];
  const currentIndex = themes.indexOf(currentTheme);
  const nextIndex = (currentIndex + 1) % themes.length;
  return themes[nextIndex];
}

/**
 * Sets the theme and saves it
 */
export function setTheme(theme: Theme): void {
  saveTheme(theme);
  applyTheme(theme);

  // Dispatch custom event for components to react to theme changes
  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
}
