import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
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

test('keeps verified MoneyBoy metadata and the archived Y language state', async () => {
  const { projects } = await loadProjects();
  const moneyboy = projects.find(({ slug }) => slug === 'moneyboy');
  const yLang = projects.find(({ slug }) => slug === 'y-lang-v0');

  assert.deepEqual(
    {
      repositoryUrl: moneyboy.repositoryUrl,
      description: moneyboy.description,
      language: moneyboy.language,
      homepageUrl: moneyboy.homepageUrl,
      status: moneyboy.status,
    },
    {
      repositoryUrl: 'https://github.com/pesca-dev/moneyboy-app',
      description: 'The mobile app for MoneyBoy - a tool to track spendings between different people.',
      language: 'TypeScript',
      homepageUrl: 'https://pesca-dev.github.io/moneyboy-app',
      status: 'active',
    },
  );
  assert.equal(yLang.status, 'archived');
  assert.equal(yLang.archived, true);
});

test('does not advertise the unavailable Eventer deployment as a live demo', async () => {
  const { projects } = await loadProjects();
  const eventer = projects.find(({ slug }) => slug === 'eventer');

  assert.equal(eventer.homepageUrl, undefined);
  assert.equal(eventer.demo, undefined);
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

test('sorts synthetic posts newest first', async () => {
  const { sortPostsNewestFirst } = await loadContentHelpers();
  const posts = [
    { id: 'older', data: { publishDate: new Date('2026-08-01') } },
    { id: 'newer', data: { publishDate: new Date('2026-08-11') } },
  ];

  assert.deepEqual(sortPostsNewestFirst(posts).map(({ id }) => id), ['newer', 'older']);
});

test('filters synthetic tag posts, sorts them, and canonicalizes duplicate tags', async () => {
  const { getPostsForTag } = await loadContentHelpers();
  const posts = [
    {
      id: 'older-rust',
      data: { publishDate: new Date('2026-08-01'), tags: ['Rust', 'rust', 'Web Development'] },
    },
    {
      id: 'draft-rust',
      data: { draft: true, publishDate: new Date('2026-08-12'), tags: ['rust'] },
    },
    {
      id: 'newer-rust',
      data: { publishDate: new Date('2026-08-11'), tags: ['rust', 'Rust'] },
    },
    {
      id: 'web-only',
      data: { publishDate: new Date('2026-08-10'), tags: ['web'] },
    },
  ];

  const matches = getPostsForTag(posts, 'RUST');
  assert.deepEqual(matches.map(({ id }) => id), ['newer-rust', 'older-rust']);
  assert.deepEqual(matches.map(({ data }) => data.tags), [['rust'], ['rust', 'web-development']]);
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
