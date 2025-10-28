import type { Route } from '@vaadin/router';

export const routes: Route[] = [
  {
    path: '/',
    component: 'website-home',
    action: async () => {
      await import('./pages/home');
    },
  },
  {
    path: '/blog/:slug',
    component: 'website-blog-post',
    action: async () => {
      await import('./blog-post');
    },
  },
  {
    path: '(.*)',
    component: 'website-not-found',
    action: async () => {
      await import('./pages/not-found');
    },
  },
];
