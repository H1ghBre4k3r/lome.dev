import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const built = (path) => readFileSync(join('dist', path), 'utf8');
const blogIndex = built('blog/index.html');
const article = built('blog/hello-lome-dev/index.html');
const homepage = built('index.html');
const tagIndex = built('blog/tags/lome-dev/index.html');
const sitemapIndex = built('sitemap-index.xml');
const sitemap = built('sitemap-0.xml');
const rss = built('rss.xml');

const enumerateFiles = (root) => readdirSync(root, { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => join(entry.parentPath, entry.name))
  .sort();
const enumeratedSourceInputs = [
  ...enumerateFiles('src'),
  ...enumerateFiles('public'),
  'astro.config.mjs',
  'package.json',
  'package-lock.json',
  '.github/workflows/deploy.yml',
  ...enumerateFiles('test'),
].sort();
const distOutputs = [
  'dist/index.html',
  'dist/404.html',
  'dist/blog/index.html',
  'dist/blog/hello-lome-dev/index.html',
  'dist/blog/tags/lome-dev/index.html',
  'dist/blog/tags/rust/index.html',
  'dist/blog/tags/web/index.html',
  'dist/rss.xml',
  'dist/sitemap-0.xml',
  'dist/CNAME',
  'dist/favicon.svg',
  'dist/robots.txt',
];

test('artifact assertions refuse stale generated output', () => {
  const newestSource = Math.max(...enumeratedSourceInputs.map((path) => statSync(path).mtimeMs));
  const oldestOutput = Math.min(...distOutputs.map((path) => statSync(path).mtimeMs));
  assert.ok(oldestOutput >= newestSource, 'dist is stale; run npm run build before artifact tests');
});

test('published blog artifacts are sorted, tagged, and exclude the named draft fixture', () => {
  assert.ok(existsSync('src/content/blog/task-4-draft-fixture.md'));
  const helloSource = read('../src/content/blog/hello-lome-dev.md');
  const sourceTags = [...helloSource.matchAll(/^\s+-\s+([a-z0-9-]+)$/gm)].map((match) => match[1]);
  assert.deepEqual(sourceTags, ['web', 'lome-dev', 'rust']);
  assert.match(blogIndex, /Hello, lome\.dev/);
  assert.doesNotMatch(blogIndex, /Task 4 draft fixture/);
  assert.ok(existsSync('dist/blog/hello-lome-dev/index.html'));
  assert.equal(existsSync('dist/blog/task-4-draft-fixture/index.html'), false);

  const directory = blogIndex.slice(blogIndex.indexOf('tag-directory'));
  const tags = [...directory.matchAll(/href="\/blog\/tags\/([^/]+)\//g)].map((match) => match[1]);
  assert.deepEqual(tags, [...tags].sort());
  assert.deepEqual([...new Set(tags)], ['lome-dev', 'rust', 'web']);

  const card = blogIndex.match(/<li class="post-list-item">[\s\S]*?<ul class="tag-list"[\s\S]*?<\/ul>/)?.[0] ?? '';
  const cardTags = [...card.matchAll(/href="\/blog\/tags\/([^/]+)\//g)].map((match) => match[1]);
  assert.deepEqual(cardTags, ['lome-dev', 'rust', 'web']);
});

test('published tag routes contain only matching published posts', () => {
  for (const tag of ['lome-dev', 'rust', 'web']) {
    const route = `blog/tags/${tag}/index.html`;
    assert.ok(existsSync(join('dist', route)), `missing tag route: ${route}`);
    const html = built(route);
    assert.match(html, /Hello, lome\.dev/);
    assert.doesNotMatch(html, /Task 4 draft fixture/);
  }
  assert.equal(existsSync('dist/blog/tags/task-4-draft/index.html'), false);
});

test('RSS emits canonical post links and each published tag as a category', () => {
  assert.match(rss, /https:\/\/lome\.dev\/blog\/hello-lome-dev\//);
  const categories = [...rss.matchAll(/<category>([^<]+)<\/category>/g)].map((match) => match[1]);
  assert.deepEqual(categories, ['lome-dev', 'rust', 'web']);
  assert.doesNotMatch(rss, /task-4-draft-fixture|Task 4 draft fixture/);
});

test('sitemap contains blog and tag routes but no draft route', () => {
  assert.match(sitemapIndex, /sitemap-0\.xml/);
  for (const route of ['blog/', 'blog/hello-lome-dev/', 'blog/tags/lome-dev/', 'blog/tags/rust/', 'blog/tags/web/']) {
    assert.match(sitemap, new RegExp(`https:\/\/lome\\.dev\/${route.replaceAll('/', '\\/')}`));
  }
  assert.doesNotMatch(sitemap, /task-4-draft-fixture/);
});

test('shared and article metadata emit canonical, social, RSS, theme, and article date tags', () => {
  for (const html of [built('index.html'), article]) {
    assert.match(html, /<link rel="canonical" href="https:\/\/lome\.dev\//);
    assert.match(html, /<meta property="og:title"/);
    assert.match(html, /<meta property="og:description"/);
    assert.match(html, /<meta property="og:url"/);
    assert.match(html, /<meta name="twitter:card" content="summary_large_image"/);
    assert.match(html, /<link rel="alternate" type="application\/rss\+xml"/);
    assert.match(html, /<meta name="theme-color" content="#DED8C9"/);
    assert.match(html, /<link rel="icon" href="\/favicon\.svg"/);
  }
  assert.match(homepage, /<link rel="canonical" href="https:\/\/lome\.dev\/"/);
  assert.match(article, /<link rel="canonical" href="https:\/\/lome\.dev\/blog\/hello-lome-dev\/"/);
  assert.match(tagIndex, /<link rel="canonical" href="https:\/\/lome\.dev\/blog\/tags\/lome-dev\/"/);
  assert.match(article, /<meta property="og:type" content="article"/);
  assert.match(article, /<meta property="article:published_time" content="2026-08-10/);
  assert.match(article, /<meta property="article:modified_time" content="2026-08-11T00:00:00\.000Z"/);
});

test('article route exposes calm reading layout, updated date support, tags, and home/blog navigation', () => {
  assert.match(article, /<body class="reading-page">/);
  assert.match(article, /class="reading-layout"/);
  assert.match(article, /datetime="2026-08-10/);
  assert.match(article, /Updated 11\/08\/2026/);
  assert.match(article, /href="\/blog\/tags\/lome-dev\//);
  assert.match(article, /href="\/blog\/"/);
  assert.match(article, /href="\/"/);
  const styles = read('../src/styles/global.css');
  assert.match(styles, /\.reading-layout\s*{[^}]*max-inline-size:\s*70ch/s);
  assert.match(styles, /\.reading-page\s*{[^}]*background-image:\s*none/s);
  assert.match(styles, /\.post-list-item\s*>\s*a\s*{[^}]*display:\s*inline-flex[^}]*align-items:\s*center[^}]*min-block-size:\s*44px/s);
  assert.match(blogIndex, /<nav class="reading-nav" aria-label="Blog navigation">/);
  assert.match(article, /<nav class="reading-nav" aria-label="Article footer">/);
  assert.match(built('blog/tags/lome-dev/index.html'), /<nav class="reading-nav" aria-label="Tag footer">/);
  for (const page of [blogIndex, article, built('blog/tags/lome-dev/index.html'), built('404.html')]) {
    assert.doesNotMatch(page, /class="eyebrow"/);
  }
  assert.doesNotMatch(styles, /\.eyebrow\s*{/);
});

test('static branding and deployment files are present and verification-gated', () => {
  assert.match(read('../astro.config.mjs'), /site:\s*['"]https:\/\/lome\.dev['"]/);
  assert.doesNotMatch(read('../astro.config.mjs'), /base\s*:/);
  assert.equal(readFileSync('dist/CNAME', 'utf8').trim(), 'lome.dev');
  assert.match(readFileSync('dist/favicon.svg', 'utf8'), /<svg[\s>]/);
  assert.match(readFileSync('dist/robots.txt', 'utf8'), /Sitemap:\s*https:\/\/lome\.dev\/sitemap-index\.xml/);
  const notFound = built('404.html');
  assert.match(notFound, /Not found|Page not found/);
  assert.match(notFound, /lome\.dev/);
  assert.match(notFound, /<meta name="robots" content="noindex"/);
  assert.doesNotMatch(notFound, /<link rel="canonical"/);
  assert.match(read('../package.json'), /"verify":\s*"npm run check && npm test"/);
  const workflow = read('../.github/workflows/deploy.yml');
  assert.match(workflow, /actions\/checkout@v7/);
  assert.match(workflow, /withastro\/action@v6/);
  assert.match(workflow, /node-version:\s*24/);
  assert.match(workflow, /build-cmd:\s*npm run verify/);
  assert.match(workflow, /actions\/deploy-pages@v5/);
  assert.match(workflow, /pages:\s*write/);
  assert.match(workflow, /id-token:\s*write/);
  assert.match(workflow, /name:\s*github-pages/);
});
