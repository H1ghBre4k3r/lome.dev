/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Build-time SEO generation script
 * Generates sitemap.xml and feed.xml for production builds
 *
 * Run with: tsx scripts/generate-seo.ts
 */

import { writeFileSync } from 'fs';
import { join } from 'path';

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  tags: string[];
}

interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  guid: string;
  categories?: string[];
}

const BASE_URL = 'https://lome.dev';

/**
 * Parse frontmatter from markdown
 */
function parseFrontmatter(markdown: string): { data: Record<string, unknown>; content: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);

  if (!match) {
    return { data: {}, content: markdown };
  }

  const [, frontmatterStr, content] = match;
  const data: Record<string, any> = {};

  // Parse YAML-like frontmatter
  const lines = frontmatterStr.split('\n');
  let currentKey = '';

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Handle arrays
    if (trimmed.startsWith('-')) {
      const value = trimmed.slice(1).trim().replace(/^["']|["']$/g, '');
      if (currentKey && Array.isArray(data[currentKey])) {
        data[currentKey].push(value);
      }
      continue;
    }

    // Handle key-value pairs
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex > 0) {
      const key = trimmed.slice(0, colonIndex).trim();
      let value = trimmed.slice(colonIndex + 1).trim();

      // Remove quotes
      value = value.replace(/^["']|["']$/g, '');

      // Check if next values might be an array
      if (value === '' || value === '[') {
        data[key] = [];
        currentKey = key;
      } else if (value.startsWith('[') && value.endsWith(']')) {
        // Inline array
        data[key] = value.slice(1, -1).split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
        currentKey = '';
      } else {
        data[key] = value;
        currentKey = '';
      }
    }
  }

  return { data, content };
}

/**
 * Load blog posts from public/blog directory
 */
async function loadBlogPosts(): Promise<BlogPost[]> {
  const { readFileSync, readdirSync } = await import('fs');
  const { join } = await import('path');

  const blogDir = join(process.cwd(), 'public', 'blog');
  const files = readdirSync(blogDir).filter(f => f.endsWith('.md') && f !== 'README.md');

  const posts: BlogPost[] = [];

  for (const file of files) {
    const content = readFileSync(join(blogDir, file), 'utf-8');
    const { data } = parseFrontmatter(content);
    const slug = file.replace('.md', '');

    posts.push({
      slug,
      title: data.title || 'Untitled',
      date: data.date || new Date().toISOString().split('T')[0],
      category: data.category || '',
      excerpt: data.excerpt || '',
      tags: data.tags || []
    });
  }

  // Sort by date, newest first
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Generate sitemap.xml
 */
function generateSitemap(posts: BlogPost[]): string {
  const now = new Date().toISOString();

  const entries: SitemapEntry[] = [
    // Homepage - highest priority
    { loc: '/', lastmod: now, changefreq: 'weekly', priority: 1.0 },

    // Main sections
    { loc: '/#about', changefreq: 'monthly', priority: 0.8 },
    { loc: '/#skills', changefreq: 'monthly', priority: 0.8 },
    { loc: '/#timeline', changefreq: 'monthly', priority: 0.8 },
    { loc: '/#projects', changefreq: 'weekly', priority: 0.9 },
    { loc: '/#blog', changefreq: 'weekly', priority: 0.9 },
    { loc: '/#contact', changefreq: 'yearly', priority: 0.7 },
  ];

  // Add blog posts
  for (const post of posts) {
    entries.push({
      loc: `/#blog/${post.slug}`,
      lastmod: post.date,
      changefreq: 'monthly',
      priority: 0.7
    });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(entry => `  <url>
    <loc>${BASE_URL}${entry.loc}</loc>${entry.lastmod ? `
    <lastmod>${entry.lastmod}</lastmod>` : ''}${entry.changefreq ? `
    <changefreq>${entry.changefreq}</changefreq>` : ''}${entry.priority !== undefined ? `
    <priority>${entry.priority.toFixed(1)}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return xml;
}

/**
 * Generate RSS feed
 */
function generateRSSFeed(posts: BlogPost[]): string {
  const now = new Date();

  const escapeXml = (str: string) => str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

  const toRFC822 = (dateStr: string) => new Date(dateStr).toUTCString();

  const items: RSSItem[] = posts.map(post => ({
    title: post.title,
    link: `${BASE_URL}/#blog/${post.slug}`,
    guid: `${BASE_URL}/#blog/${post.slug}`,
    description: post.excerpt,
    pubDate: post.date,
    categories: [post.category, ...post.tags].filter(Boolean)
  }));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>lome.dev Blog</title>
    <description>Technical articles about compilers, Rust, TypeScript, and software engineering by Louis (H1ghBre4k3r)</description>
    <link>${BASE_URL}</link>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <language>en-US</language>
    <lastBuildDate>${now.toUTCString()}</lastBuildDate>
    <generator>lome.dev custom RSS generator</generator>
    <copyright>Copyright ${now.getFullYear()} Louis (H1ghBre4k3r)</copyright>
    <managingEditor>louis@lome.dev (Louis)</managingEditor>
${items.map(item => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="true">${escapeXml(item.guid)}</guid>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${toRFC822(item.pubDate)}</pubDate>${item.categories?.map(cat => `
      <category>${escapeXml(cat)}</category>`).join('') || ''}
    </item>`).join('\n')}
  </channel>
</rss>`;

  return xml;
}

/**
 * Main execution
 */
async function main() {
  console.log('🔍 Generating SEO files...\n');

  try {
    // Load blog posts
    console.log('📚 Loading blog posts...');
    const posts = await loadBlogPosts();
    console.log(`   Found ${posts.length} blog posts\n`);

    // Generate sitemap
    console.log('🗺️  Generating sitemap.xml...');
    const sitemap = generateSitemap(posts);
    writeFileSync(join(process.cwd(), 'public', 'sitemap.xml'), sitemap, 'utf-8');
    console.log('   ✅ sitemap.xml generated\n');

    // Generate RSS feed
    console.log('📡 Generating RSS feed...');
    const rss = generateRSSFeed(posts);
    writeFileSync(join(process.cwd(), 'public', 'feed.xml'), rss, 'utf-8');
    console.log('   ✅ feed.xml generated\n');

    console.log('✨ SEO files generated successfully!\n');
    console.log('Files created:');
    console.log('  - public/sitemap.xml');
    console.log('  - public/feed.xml');
    console.log('  - public/robots.txt (already exists)');
    console.log('  - public/humans.txt (already exists)');

  } catch (error) {
    console.error('❌ Error generating SEO files:', error);
    process.exit(1);
  }
}

main();
