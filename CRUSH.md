# Development Commands

## Core Development
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production (runs SEO generation, TypeScript compilation, then Vite build)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code linting
- `npm run generate:seo` - Generate SEO metadata (sitemap, RSS, robots.txt)

## Testing
No test framework configured - use Vitest for future testing setup

## Easter Eggs
- **Konami Code**: ↑↑↓↓←→←→BA activates readable LeetSpeak mode
- **URL Activation**: `?leet=true` parameter for auto-activation
- **Controls**: ESC to exit LeetSpeak mode, re-enter code to toggle
- **Effects**: Subtle text transformation (1337 style), particle burst, screen shake, visual indicator

# Code Style Guidelines

## Project Status & Architecture
**Current Phase**: Phase 4.3 - Error Handling & Resilience (see ROADMAP.md)
- ✅ Phase 1-3 Complete (Content, GitHub Integration, Design Polish)
- ✅ Phase 4.1-4.2 Complete (SEO Foundation, Performance Optimization)
- ✅ CSS Architecture Refactoring Complete (Atomic Design with cascade layers)
- 🔄 Current: Error boundaries, loading states, graceful degradation

## Component Architecture
- Use `@Component("tag-name")` decorator for all custom elements
- Components extend `AbstractElement` from `@pesca-dev/atomicity`
- JSX factory: `a` function (configured in tsconfig.json: `jsxFactory: "a"`)
- Component registration patterns defined in `src/global.d.ts` for all custom elements
- Performance: Critical components load immediately, others lazy-loaded via `requestIdleCallback`

## CSS Architecture (Layered Atomic Design)
**Structure**: `src/css/{atoms,molecules,organisms,utilities}/`
**Import**: Single entry point via `src/css/index.css`

### Layer Hierarchy (enforced with @layer):
1. **Atoms** - Foundation: variables, resets, typography, spacing
2. **Molecules** - Reusable components: buttons, badges, cards, inputs
3. **Organisms** - Complex sections: hero, projects, blog, about, etc.
4. **Utilities** - Helpers: animations, effects, utility classes

### Best Practices:
- **Molecules vs Organisms**: Used in multiple places? → Molecule. Section-specific? → Organism
- **No duplication**: Use existing molecules (`.btn`, `.tag`, `.card`) with scoping for variants
- **Scoping pattern**: `.hero .btn { /* hero-specific overrides */ }`
- **Responsive**: Keep media queries close to components they affect
- See `CSS_ARCHITECTURE.md` for complete guidelines

## Import Organization
```typescript
// 1. External libraries
import { a, AbstractElement, atom } from "@pesca-dev/atomicity";
import { siGithub } from "simple-icons";

// 2. Internal components (relative imports)
import { Component } from "./component";
import { svg } from "./utils";

// 3. Type imports use `import type` when possible
import type { GitHubData } from "./lib/github";
```

## Performance Guidelines
- **Bundle Splitting**: Configure in `vite.config.ts` with manual chunks
- **Lazy Loading**: Use `requestIdleCallback` for non-critical components (see `src/index.ts`)
- **Code Splitting**: Blog dependencies, syntax highlighting separated into chunks
- **CSS**: Centralized import enables better bundler optimization
- **Current bundle size**: 29.35 KB JS (9.64 KB gzipped), 18.07 KB CSS (4.61 KB gzipped)

## Naming Conventions
- **Component classes**: PascalCase (e.g., `WebsiteHeader`)
- **Custom element tags**: kebab-case with prefix (e.g., `website-header`)
- **Private methods**: camelCase with descriptive names
- **CSS classes**: kebab-case following BEM-like patterns
- **Files**: kebab-case for components, camelCase for utilities

## TypeScript Configuration
- Strict mode enabled, but `noImplicitAny: false` for flexibility
- JSX: React with custom factory `a`, decorators enabled
- Module resolution: bundler mode with ESNext target
- Global types: All custom elements declared in `src/global.d.ts`

## Data Patterns
- **Static data**: `src/data/` directory (projects.ts, skills.ts, timeline.ts)
- **API integration**: `src/lib/` directory (github.ts, blog.ts, rss.ts, sitemap.ts)
- **Markdown**: Blog posts in `public/blog/` with frontmatter
- **SVG icons**: Use `simple-icons` library with `svg()` utility function

## ESLint Rules
- Unused variable `a` ignored (JSX factory function)
- TypeScript ESLint rules for type safety
- Browser globals configured for DOM APIs
- Current status: ✅ No errors

## Error Handling Patterns
- **Event cleanup**: Use `disconnectedCallback()` to remove event listeners
- **Method binding**: Bind methods in `connectedCallback()` to maintain context
- **GitHub API**: Add retry logic and error boundaries (current priority)
- **Loading states**: Implement skeleton screens for all async content

## Build & Deployment
- **Docker**: Multi-stage build with nginx serving static content
- **Kubernetes**: Manifests in `manifests/` directory
- **SEO**: Dynamic sitemap.xml, robots.txt, RSS feed generation
- **CI/CD**: GitHub workflows for build and deployment

## Development Workflow
1. Work in feature branches
2. Run `npm run lint` before commits
3. Test on multiple screen sizes
4. Update ROADMAP.md for completed features
5. Follow CSS architecture patterns for new styles
6. Use lazy loading for new non-critical components