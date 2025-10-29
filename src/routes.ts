import type { Route } from '@vaadin/router';

// Helper to trigger page transition animation
const triggerPageTransition = () => {
  const outlet = document.getElementById('outlet');
  if (outlet) {
    // Remove and re-add animation to retrigger fade-in
    outlet.style.animation = 'none';
    // Force reflow
    void outlet.offsetWidth;
    outlet.style.animation = '';
  }
};

export const routes: Route[] = [
  {
    path: '/',
    component: 'website-home',
    action: async () => {
      await import('./pages/home');
      triggerPageTransition();
    },
  },
  {
    path: '/blog/:slug',
    component: 'website-blog-post',
    action: async () => {
      await import('./blog-post');
      triggerPageTransition();
    },
  },
  {
    path: '(.*)',
    component: 'website-not-found',
    action: async () => {
      await import('./pages/not-found');
      triggerPageTransition();
    },
  },
];
