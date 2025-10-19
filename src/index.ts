// Critical CSS - load immediately (new layered architecture)
import "./css/index.css";

// Critical above-the-fold components - load immediately
import "./particle-background";
import "./scroll-progress";
import "./main";
import "./header";
import "./terminal-typing";
import "./interactive-terminal";
import "./hero";
import "./konami-code";

// Lazy load below-the-fold components after initial render
// This reduces initial bundle size and improves Time to Interactive
const lazyLoadComponents = async () => {
  // Use requestIdleCallback for better performance, fallback to setTimeout
  const loadWhenIdle = (callback: () => void) => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(callback, { timeout: 2000 });
    } else {
      setTimeout(callback, 1);
    }
  };

  // Load core sections first (higher priority)
  loadWhenIdle(async () => {
    await Promise.all([
      import("./about"),
      import("./timeline"),
      import("./skills"),
    ]);
  });

  // Load blog components (medium priority)
  loadWhenIdle(async () => {
    await Promise.all([
      import("./blog"),
      import("./blog-post"),
      import("./blog-toc"),
      import("./blog-related"),
      import("./blog-router"),
    ]);
  });

  // Load projects and contact (medium priority)
  loadWhenIdle(async () => {
    await Promise.all([
      import("./projects"),
      import("./contact"),
    ]);
  });

  // Load GitHub stats components (lower priority - data-heavy)
  loadWhenIdle(async () => {
    await Promise.all([
      import("./github-stats"),
      import("./contribution-heatmap"),
      import("./language-chart"),
      import("./coding-streak"),
      import("./achievements"),
    ]);
  });
};

// Start lazy loading after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', lazyLoadComponents);
} else {
  lazyLoadComponents();
}
