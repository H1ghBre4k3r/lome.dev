# lome.dev Portfolio and Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the approved static Shareware Field Manual portfolio, Markdown blog, and accessible Breakout game at `https://lome.dev`.

**Architecture:** Astro renders every content route at build time from typed local project data and a validated Markdown collection. Semantic Astro components and global CSS own the interface; a small pure JavaScript engine and canvas controller own the only interactive island.

**Tech Stack:** Astro 6, TypeScript, vanilla JavaScript, CSS, npm, Node 24, GitHub Pages.

## Global Constraints

- Preserve the user-approved Shareware Field Manual direction and approved comp topology.
- Use exactly `#DED8C9`, `#171611`, `#B66A20`, `#7B1F29`, and `#182B26` as the core palette.
- Use self-hosted Barlow Condensed and Atkinson Hyperlegible; system monospace only for code and metadata.
- No frontend framework, backend, runtime API, CMS, analytics, comments, contact form, search, dark mode, or third-party game engine.
- All non-game content works without JavaScript; WCAG 2.2 AA, visible focus, reduced motion, and 44px touch targets are required.
- GitHub is the sole public contact destination.

---

### Task 1: Static foundation and content model

**Produces:** Astro configuration, dependencies, shared content helpers, typed project data, Markdown schema, one published article, and generation tests.

- [ ] Add failing Node tests for project ordering, draft filtering, tag normalization, and expected built routes.
- [ ] Confirm failures are caused by missing foundation modules/output.
- [ ] Add the smallest Astro static scaffold, official RSS/sitemap/check integrations, and npm scripts.
- [ ] Implement the project model and six verified entries in the approved order.
- [ ] Implement the Markdown collection schema and “Hello, lome.dev” article.
- [ ] Run tests, type checking, and the build until green.

### Task 2: Tested Breakout engine and controller

**Produces:** Pure game-state functions, persistence helpers, canvas controller, and controls consumed by the homepage.

- [ ] Add focused failing tests for paddle bounds, brick collision/scoring, lost balls/lives, clear state, reset, and corrupt/unavailable storage.
- [ ] Confirm every test fails for the missing behavior.
- [ ] Implement a fixed-resolution 10×5, three-life, one-board engine with minimal exported functions.
- [ ] Implement the canvas loop, keyboard/touch controls, visibility pause, reduced-motion fallback, and `lome.dev.breakout.best.v1` persistence.
- [ ] Run the game tests until green.

### Task 3: Shared visual system and homepage

**Produces:** Root layout, global styles, local fonts/avatar, semantic homepage sections, responsive behavior, and direction contract.

- [ ] Inventory the approved comp and record every major region and implementation medium in the homepage surface brief.
- [ ] Add the direction contract as the first emitted body child.
- [ ] Build the masthead, project dossiers, bundled-demo panel, biography/latest-note close, and GitHub/RSS footer against the approved comp.
- [ ] Add semantic landmarks, skip link, visible focus, fixed media dimensions, reduced motion, and 360px responsive rules.
- [ ] Build and verify the emitted contract and homepage artifacts.

### Task 4: Blog, metadata, and deployment

**Produces:** Blog index, post and tag routes, RSS, sitemap, 404, canonical/OG metadata, favicon/robots, CNAME, and Pages workflow.

- [ ] Add failing artifact assertions for draft exclusion, RSS links, tags, sitemap, metadata, CNAME, and 404.
- [ ] Confirm the assertions fail for missing routes/artifacts.
- [ ] Implement the reading layout and all static routes with newest-first sorting and alphabetical unique tags.
- [ ] Add the official GitHub Pages workflow using Node 24, `site: "https://lome.dev"`, no `base`, and a verification-gated build.
- [ ] Run the complete verification command until green.

### Task 5: Visual QA and finish

**Produces:** Verified desktop/mobile output, detector result, finish-review verdict, and durable design documentation.

- [ ] Run production verification and serve the built site locally.
- [ ] Capture desktop and mobile in one batch; check keyboard, touch, no-JS, reduced motion, contrast, and overflow.
- [ ] Apply one consolidated visual/accessibility fix batch and capture at most one confirmation batch.
- [ ] Run the Impeccable detector once and resolve its mechanical findings.
- [ ] Send screenshots and the approved comp to a fresh finish reviewer; resolve material findings within the two-round budget.
- [ ] Generate `DESIGN.md` and the final homepage surface brief from the shipped implementation.
- [ ] Record the remaining GitHub Pages settings and DNS steps as launch handoff, without claiming they were performed.
