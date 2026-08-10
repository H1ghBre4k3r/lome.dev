/**
 * Convert a user-facing tag into the canonical URL and metadata form.
 * @param {string} tag
 * @returns {string}
 */
export function normalizeTag(tag) {
  if (typeof tag !== 'string') {
    throw new TypeError('tag must be a string');
  }

  return tag
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Normalize, deduplicate, and sort tags for stable output.
 * @param {readonly string[]} tags
 * @returns {string[]}
 */
export function normalizeTags(tags) {
  if (!Array.isArray(tags)) {
    throw new TypeError('tags must be an array');
  }

  return [...new Set(tags.map(normalizeTag))].filter(Boolean).sort();
}

/**
 * Production content is the subset without an explicit draft flag.
 * @template {{ data?: { draft?: boolean } }} T
 * @param {readonly T[]} entries
 * @returns {T[]}
 */
export function filterPublishedPosts(entries) {
  return entries.filter((entry) => entry.data?.draft !== true);
}

/**
 * @template {{ data: { publishDate: Date } }} T
 * @param {readonly T[]} entries
 * @returns {T[]}
 */
export function sortPostsNewestFirst(entries) {
  return [...entries].sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf(),
  );
}
