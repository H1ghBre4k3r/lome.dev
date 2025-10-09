# Routing System

This website uses **proper URL-based routing** (not hash-based) with the HTML5 History API.

## URL Structure

- **Home/Blog List**: `/` or `/blog`
- **Individual Post**: `/blog/y-lang-design`, `/blog/lexer-proc-macros`, etc.

## How It Works

### Client-Side (SPA Routing)

The app uses the History API (`pushState` and `popstate`) for navigation:

1. **User clicks blog card** → `history.pushState()` updates URL to `/blog/slug`
2. **Router detects change** → Listens to `popstate` events
3. **Content updates** → Shows blog post, hides other sections
4. **Back button works** → Browser back/forward buttons trigger `popstate`

### Server-Side (nginx)

For clean URLs to work, the server must serve `index.html` for all routes:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

This ensures that visiting `/blog/y-lang-design` directly (or refreshing the page) serves the SPA.

## Deployment Configurations

### Docker/nginx (Current Setup)

The included `nginx.conf` is automatically used in the Docker image:

```dockerfile
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

Features:
- SPA routing with fallback to index.html
- Gzip compression
- Static asset caching (1 year)
- Security headers
- Blog markdown file serving

### Netlify/Vercel

The `public/_redirects` file handles routing:

```
/*    /index.html   200
```

This is automatically picked up by Netlify and Vercel.

### Other Static Hosts

For other hosts, you need to configure them to:
1. Serve `index.html` for all routes
2. Set proper cache headers for assets
3. Serve blog markdown files with `text/markdown` content type

## Benefits of This Approach

✅ **Clean URLs** - `/blog/post-name` instead of `/#blog/post-name`  
✅ **Better SEO** - Search engines can crawl proper URLs  
✅ **Shareable links** - URLs work when shared directly  
✅ **Browser history** - Back/forward buttons work correctly  
✅ **Page titles** - Dynamic titles update per page  
✅ **No page reloads** - Fast SPA navigation

## Components Involved

### `blog-router.tsx`
- Listens to `popstate` events
- Parses `window.location.pathname`
- Shows/hides blog list vs blog post
- Manages section visibility

### `blog.tsx`
- Blog cards use `history.pushState()` on click
- Triggers `popstate` event after pushState

### `blog-post.tsx`
- Back link uses `history.pushState()` to return home
- Updates document title with post title
- Returns post data for title updates

## Testing Locally

When running `npm run dev` (Vite dev server), the routing works automatically because Vite has built-in SPA fallback.

When testing the production build:
```bash
npm run build
npm run preview
```

## Adding New Routes

To add new routes (e.g., `/about-me`):

1. Update `blog-router.tsx` `handleRouteChange()` to detect the new path
2. Create show/hide methods for the new route
3. Update navigation links to use `pushState`
4. No server configuration changes needed!

## Important Notes

- **Hash navigation still works** for in-page anchors (e.g., `#contact`)
- **External links** work normally with regular `<a href>`
- **Blog markdown files** are served from `/blog/*.md`
- **Assets** are cached for 1 year (immutable)
