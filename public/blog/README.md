# Blog System

This directory contains blog articles written in Markdown with frontmatter metadata.

## Adding a New Blog Post

1. Create a new `.md` file in this directory (e.g., `my-article.md`)

2. Add frontmatter at the top of the file:

```markdown
---
title: "Your Article Title"
date: "2024-01-15"
category: "Category Name"
excerpt: "A brief description of your article that appears in the blog list."
tags: ["Tag1", "Tag2", "Tag3"]
---

# Your Article Title

Your article content here...
```

3. Update `index.json` to include your new file:

```json
["y-lang-design.md", "lexer-proc-macros.md", "dependency-injection.md", "my-article.md"]
```

## Frontmatter Fields

- **title**: The article title (required)
- **date**: Publication date in YYYY-MM-DD format (required)
- **category**: A category badge (e.g., "Compilers", "Rust", "TypeScript")
- **excerpt**: Short description shown in the blog list
- **tags**: Array of technology/topic tags (max 4 displayed)

## Markdown Support

The blog system uses `marked` for Markdown parsing, which supports:

- Headers
- Code blocks with syntax highlighting
- Lists (ordered and unordered)
- Links and images
- Blockquotes
- Tables
- And more!

## Example

See the existing files in this directory for examples:
- `y-lang-design.md`
- `lexer-proc-macros.md`
- `dependency-injection.md`
