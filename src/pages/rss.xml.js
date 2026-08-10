import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { filterPublishedPosts, sortPostsNewestFirst } from '../lib/content.js';

export async function GET(context) {
  const posts = sortPostsNewestFirst(filterPublishedPosts(await getCollection('blog')));

  return rss({
    title: 'lome.dev writing',
    description: 'Writing by Louis / H1ghBre4k3r.',
    site: context.site ?? 'https://lome.dev',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: `/blog/${post.id}/`,
    })),
  });
}
