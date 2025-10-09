# Blog Routing System

This website uses hash-based routing to handle individual blog post pages without requiring server-side routing or multiple HTML files.

## How It Works

### URL Structure

- **Blog List**: `/#blog` or `/#` (shows list of blog posts)
- **Individual Post**: `/#blog/post-slug` (shows full blog post)

### Components

1. **`blog-router.tsx`** - Main routing component
   - Listens for hash changes
   - Shows/hides blog list vs blog post
   - Manages navigation state

2. **`blog.tsx`** - Blog list component
   - Displays blog post cards
   - Cards are clickable and navigate to `#blog/slug`

3. **`blog-post.tsx`** - Blog post viewer
   - Loads and displays full markdown content
   - Converts markdown to HTML
   - Shows back button to return to blog list

### User Flow

1. User clicks on a blog card
2. URL changes to `#blog/post-slug`
3. Router detects hash change
4. Router hides blog list, shows blog post viewer
5. Blog post viewer loads markdown and displays content
6. User clicks "Back to Articles"
7. URL changes to `#blog`
8. Router shows blog list again

### Benefits

✅ **No server configuration** - Works with static hosting  
✅ **Fast navigation** - No page reloads  
✅ **Shareable URLs** - Users can link directly to posts  
✅ **Browser history** - Back/forward buttons work  
✅ **Simple deployment** - Single HTML file

### Adding New Posts

Just add a markdown file to `public/blog/` and update `index.json`. The routing automatically works for any slug!

Example:
```markdown
---
title: "My New Post"
date: "2024-10-09"
category: "Tutorial"
excerpt: "Learn something awesome"
tags: ["Tutorial", "Code"]
---

# My New Post

Content goes here...
```

Then navigate to `/#blog/my-new-post` to see it!
