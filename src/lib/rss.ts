/**
 * RSS/Atom feed generation for blog posts
 * Enables readers to subscribe to blog updates
 */

export interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  guid: string;
  categories?: string[];
  content?: string;
}

export interface RSSFeedOptions {
  title: string;
  description: string;
  link: string;
  language?: string;
  copyright?: string;
  managingEditor?: string;
  webMaster?: string;
  lastBuildDate?: string;
  generator?: string;
}

/**
 * Escapes XML special characters
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Converts date to RFC 822 format (required by RSS 2.0)
 */
function toRFC822(dateString: string): string {
  const date = new Date(dateString);
  return date.toUTCString();
}

/**
 * Generates RSS 2.0 feed XML
 */
export function generateRSSFeed(items: RSSItem[], options: RSSFeedOptions): string {
  const lastBuildDate = options.lastBuildDate || new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(options.title)}</title>
    <description>${escapeXml(options.description)}</description>
    <link>${escapeXml(options.link)}</link>
    <atom:link href="${escapeXml(options.link)}/feed.xml" rel="self" type="application/rss+xml"/>
    <language>${options.language || 'en-US'}</language>
    <lastBuildDate>${toRFC822(lastBuildDate)}</lastBuildDate>
    <generator>${options.generator || 'lome.dev custom RSS generator'}</generator>${options.copyright ? `
    <copyright>${escapeXml(options.copyright)}</copyright>` : ''}${options.managingEditor ? `
    <managingEditor>${escapeXml(options.managingEditor)}</managingEditor>` : ''}${options.webMaster ? `
    <webMaster>${escapeXml(options.webMaster)}</webMaster>` : ''}
${items.map(item => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="true">${escapeXml(item.guid)}</guid>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${toRFC822(item.pubDate)}</pubDate>${item.categories?.map(cat => `
      <category>${escapeXml(cat)}</category>`).join('') || ''}${item.content ? `
      <content:encoded><![CDATA[${item.content}]]></content:encoded>` : ''}
    </item>`).join('\n')}
  </channel>
</rss>`;

  return xml;
}

/**
 * Fetches blog posts and generates RSS feed
 * This should be called at build time
 */
export async function buildRSSFeed(baseUrl = 'https://lome.dev'): Promise<string> {
  const items: RSSItem[] = [];

  try {
    // Fetch blog index
    const response = await fetch('http://localhost:5173/blog/index.json');
    if (!response.ok) {
      throw new Error('Could not fetch blog index');
    }

    const postFiles: string[] = await response.json();

    // Fetch each blog post
    for (const filename of postFiles) {
      const slug = filename.replace('.md', '');
      const postResponse = await fetch(`http://localhost:5173/blog/${filename}`);
      const markdown = await postResponse.text();

      // Parse frontmatter
      const frontmatterMatch = markdown.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
      if (!frontmatterMatch) continue;

      const [, frontmatterStr] = frontmatterMatch;

      // Extract metadata
      const titleMatch = frontmatterStr.match(/title:\s*["']?([^"'\n]+)["']?/);
      const dateMatch = frontmatterStr.match(/date:\s*["']?(\d{4}-\d{2}-\d{2})["']?/);
      const excerptMatch = frontmatterStr.match(/excerpt:\s*["']?([^"'\n]+)["']?/);
      const categoryMatch = frontmatterStr.match(/category:\s*["']?([^"'\n]+)["']?/);
      const tagsMatch = frontmatterStr.match(/tags:\s*\[(.*?)\]/s);

      const title = titleMatch ? titleMatch[1] : 'Untitled';
      const pubDate = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];
      const description = excerptMatch ? excerptMatch[1] : '';
      const category = categoryMatch ? categoryMatch[1] : '';

      // Parse tags
      const categories: string[] = [];
      if (category) categories.push(category);
      if (tagsMatch) {
        const tags = tagsMatch[1].split(',').map(t => t.trim().replace(/["']/g, ''));
        categories.push(...tags);
      }

      // Generate full content HTML (optional, for full-text RSS)
      // For now, we'll just use excerpt
      items.push({
        title,
        link: `${baseUrl}/#blog/${slug}`,
        guid: `${baseUrl}/#blog/${slug}`,
        description,
        pubDate,
        categories,
        // Optionally include full content:
        // content: marked(content) as string
      });
    }

    // Sort by date, newest first
    items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  } catch (error) {
    console.error('Error building RSS feed:', error);
    throw error;
  }

  return generateRSSFeed(items, {
    title: 'lome.dev Blog',
    description: 'Technical articles about compilers, Rust, TypeScript, and software engineering by Louis (H1ghBre4k3r)',
    link: baseUrl,
    language: 'en-US',
    copyright: `Copyright ${new Date().getFullYear()} Louis (H1ghBre4k3r)`,
    managingEditor: 'louis@lome.dev (Louis)',
    generator: 'lome.dev custom RSS generator'
  });
}
