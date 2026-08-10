# lome.dev Portfolio and Blog Design

## Product and audience

Build a fully static personal portfolio for Louis / H1ghBre4k3r. The primary visitor explores real work; GitHub and writing are the next steps. The first viewport must identify Louis as a Computer Science student, Rust and web developer, and GitHub Campus Expert.

## Experience structure

The homepage is issue 01 of a software field manual. It opens with the identity masthead, thesis, proof labels, GitHub portrait, and project action; continues through six curated project dossiers; presents Breakout as a bundled demo; closes with biography, latest writing, GitHub, and RSS. Projects and biography stay on the homepage. Separate routes cover the blog index, articles, tags, RSS, sitemap, and 404.

Projects appear in this order: disruption, algorithm-visualization, eventer, dependory, MoneyBoy, and archived y-lang-v0. The first two are lead dossiers and the archive is labeled honestly.

## Visual world

The user approved “Shareware Field Manual.” Use warm paper `#DED8C9`, charcoal `#171611`, rust orange `#B66A20`, burgundy `#7B1F29`, and moss `#182B26`. Barlow Condensed carries mastheads; Atkinson Hyperlegible carries body and interface text; system monospace is reserved for metadata and code. Use hard rules, editorial columns, utility labels, print registration, and nondestructive halftone treatment of the real avatar. Avoid gradients, glass, glow, rounded bento cards, and dark mode.

Desktop uses a 12-column editorial grid. Mobile becomes a readable single-column field guide. Article pages inherit the materials but reduce texture and ornament around a 65–70 character reading measure.

## Interaction

Motion is sparse: one print-registration entrance, tactile focus/hover states, and the game. Content is visible by default and motion respects `prefers-reduced-motion`.

Breakout uses a responsive canvas with a fixed logical resolution, 10×5 bricks, three lives, score, local best score, one board, win/loss states, and Start/Pause/Restart. It supports arrows or A/D and 44px touch controls, pauses when the document is hidden, and provides an accessible text fallback. No audio or extra levels ship in v1.

## Content and routes

Blog frontmatter requires `title`, `description`, `publishDate`, and lower-case kebab-case `tags`; `updatedDate` is optional and `draft` defaults false. Filenames provide stable IDs. Production excludes drafts everywhere. The initial published article is “Hello, lome.dev,” using only confirmed facts and describing the intended Rust, web, and community writing.

Public routes are `/`, `/blog/`, `/blog/[id]/`, `/blog/tags/[tag]/`, `/rss.xml`, `/sitemap-index.xml`, and `404.html`. GitHub is the only contact link.

## Architecture and quality

Use Astro 6 static output, npm, and Node 24 without a frontend framework or server adapter. Project data is a typed ordered local module. Only Breakout ships client JavaScript. Deploy through the official Astro GitHub Pages action with `site: "https://lome.dev"`, no `base`, and `public/CNAME`.

Verification requires Astro type checking, a production build, Node built-in tests for the game and generated artifacts, JavaScript-disabled checks, keyboard/touch/reduced-motion checks, desktop/mobile screenshots, one Impeccable detector pass, a fresh finish review, and final `DESIGN.md` documentation.
