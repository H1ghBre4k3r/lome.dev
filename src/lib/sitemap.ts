/**
 * Sitemap generation utilities for lome.dev
 * Generates XML sitemap for better SEO and search engine indexing
 */

export interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

/**
 * Generates XML sitemap from entries
 */
export function generateSitemap(entries: SitemapEntry[], baseUrl: string): string {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(entry => `  <url>
    <loc>${baseUrl}${entry.loc}</loc>${entry.lastmod ? `
    <lastmod>${entry.lastmod}</lastmod>` : ''}${entry.changefreq ? `
    <changefreq>${entry.changefreq}</changefreq>` : ''}${entry.priority !== undefined ? `
    <priority>${entry.priority.toFixed(1)}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return xml;
}

/**
 * Get all sitemap entries for the website
 * This should be called at build time to generate sitemap.xml
 */
export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [];
  const now = new Date().toISOString();

  // Homepage - highest priority, changes frequently
  entries.push({
    loc: '/',
    lastmod: now,
    changefreq: 'weekly',
    priority: 1.0
  });

  // Main sections - high priority
  entries.push(
    {
      loc: '/#about',
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: '/#skills',
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: '/#timeline',
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: '/#projects',
      changefreq: 'weekly',
      priority: 0.9
    },
    {
      loc: '/#blog',
      changefreq: 'weekly',
      priority: 0.9
    },
    {
      loc: '/#contact',
      changefreq: 'yearly',
      priority: 0.7
    }
  );

  // Blog posts - fetch from index.json
  try {
    const response = await fetch('http://localhost:5173/blog/index.json');
    if (response.ok) {
      const postFiles: string[] = await response.json();

      for (const filename of postFiles) {
        const slug = filename.replace('.md', '');

        // Fetch the post to get its date
        const postResponse = await fetch(`http://localhost:5173/blog/${filename}`);
        const markdown = await postResponse.text();

        // Extract date from frontmatter
        const dateMatch = markdown.match(/^---\s*\n[\s\S]*?date:\s*["']?(\d{4}-\d{2}-\d{2})["']?/m);
        const postDate = dateMatch ? dateMatch[1] : now;

        entries.push({
          loc: `/#blog/${slug}`,
          lastmod: postDate,
          changefreq: 'monthly',
          priority: 0.7
        });
      }
    }
  } catch (error) {
    console.warn('Could not fetch blog posts for sitemap:', error);
  }

  return entries;
}

/**
 * Generate and write sitemap.xml to public directory
 * This should be called during build process
 */
export async function buildSitemap(baseUrl = 'https://lome.dev'): Promise<string> {
  const entries = await getSitemapEntries();
  return generateSitemap(entries, baseUrl);
}
