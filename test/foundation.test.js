import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

async function loadProjects() {
  try {
    return await import('../src/data/projects.js');
  } catch (error) {
    assert.fail(`foundation module unavailable: ${error.code ?? error.message}`);
  }
}

async function loadContentHelpers() {
  try {
    return await import('../src/lib/content.js');
  } catch (error) {
    assert.fail(`foundation module unavailable: ${error.code ?? error.message}`);
  }
}

test('keeps the curated projects in the approved order', async () => {
  const { projects } = await loadProjects();

  assert.deepEqual(
    projects.map(({ slug }) => slug),
    [
      'disruption',
      'algorithm-visualization',
      'eventer',
      'dependory',
      'moneyboy',
      'y-lang-v0',
    ],
  );
});

test('filters draft posts from published content', async () => {
  const { filterPublishedPosts } = await loadContentHelpers();
  const entries = [
    { id: 'published', data: { draft: false } },
    { id: 'implicit-published', data: {} },
    { id: 'draft', data: { draft: true } },
  ];

  assert.deepEqual(
    filterPublishedPosts(entries).map(({ id }) => id),
    ['published', 'implicit-published'],
  );
});

test('normalizes tags to unique lower-case kebab-case values', async () => {
  const { normalizeTags } = await loadContentHelpers();

  assert.deepEqual(
    normalizeTags(['Rust', 'web development', 'rust', 'Web_Development']),
    ['rust', 'web-development'],
  );
});

test('builds the expected static route artifacts', () => {
  const expectedRoutes = [
    'index.html',
    'blog/index.html',
    'blog/hello-lome-dev/index.html',
    'rss.xml',
    'sitemap-index.xml',
    '404.html',
  ];

  for (const route of expectedRoutes) {
    assert.ok(existsSync(join('dist', route)), `missing built route: ${route}`);
  }
});
