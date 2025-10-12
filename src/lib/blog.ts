import { marked } from 'marked';
export function estimateReadingTime(text: string) {
  const words = (text || '').trim().split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js/lib/core';

// Import only the languages we need
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import rust from 'highlight.js/lib/languages/rust';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';
import yaml from 'highlight.js/lib/languages/yaml';
import markdown from 'highlight.js/lib/languages/markdown';
import xml from 'highlight.js/lib/languages/xml'; // For HTML

// Register languages
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('rust', rust);
hljs.registerLanguage('json', json);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('sh', bash);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('html', xml);

// Configure marked to use highlight.js
marked.use(markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    // Return plain code if language not found
    return code;
  }
}));

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  tags: string[];
  content?: string;
}

// In-memory cache for blog posts
let cachedPosts: BlogPost[] | null = null;

/**
 * Simple frontmatter parser for browser use
 */
function parseFrontmatter(markdown: string): { data: Record<string, unknown>; content: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);
  
  if (!match) {
    return { data: {}, content: markdown };
  }
  
  const [, frontmatterStr, content] = match;
  const data: Record<string, unknown> = {};
  
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
        (data[currentKey] as string[]).push(value);
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
 * Fetches and parses all blog posts from the /blog directory
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  if (cachedPosts) {
    return cachedPosts;
  }

  try {
    // Fetch the blog index file which lists all available posts
    const response = await fetch('/blog/index.json');
    if (!response.ok) {
      console.warn('No blog index found, returning empty array');
      return [];
    }
    
    const postFiles: string[] = await response.json();
    
    const posts = await Promise.all(
      postFiles.map(async (filename) => {
        const slug = filename.replace('.md', '');
        const response = await fetch(`/blog/${filename}`);
        const markdown = await response.text();
        
        const { data, content } = parseFrontmatter(markdown);
        
        return {
          slug,
          title: (data.title as string) || 'Untitled',
          date: (data.date as string) || new Date().toISOString(),
          category: (data.category as string) || 'Uncategorized',
          excerpt: (data.excerpt as string) || '',
          tags: (data.tags as string[]) || [],
          content,
        };
      })
    );
    
    // Sort by date, newest first
    cachedPosts = posts.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    return cachedPosts;
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
}

/**
 * Gets a single blog post by slug
 */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find(post => post.slug === slug) || null;
}

/**
 * Converts markdown content to HTML
 */
export function markdownToHtml(markdown: string): string {
  return marked(markdown) as string;
}

/**
 * Formats a date string to a readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Calculates similarity score between two blog posts
 */
function calculateSimilarity(post1: BlogPost, post2: BlogPost): number {
  let score = 0;

  // Same category = 3 points
  if (post1.category === post2.category) {
    score += 3;
  }

  // Shared tags = 2 points per tag
  const sharedTags = post1.tags.filter(tag => post2.tags.includes(tag));
  score += sharedTags.length * 2;

  // Bonus point if they have any tags in common
  if (sharedTags.length > 0) {
    score += 1;
  }

  return score;
}

/**
 * Gets related blog posts based on tags and category similarity
 * @param currentPost The post to find related articles for
 * @param allPosts All available posts
 * @param limit Maximum number of related posts to return (default: 3)
 */
export function getRelatedPosts(
  currentPost: BlogPost,
  allPosts: BlogPost[],
  limit = 3
): BlogPost[] {
  // Filter out the current post
  const otherPosts = allPosts.filter(post => post.slug !== currentPost.slug);

  // Calculate similarity scores
  const postsWithScores = otherPosts.map(post => ({
    post,
    score: calculateSimilarity(currentPost, post)
  }));

  // Sort by score (descending) and then by date (most recent first)
  postsWithScores.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
  });

  // Return top N posts
  return postsWithScores.slice(0, limit).map(item => item.post);
}
