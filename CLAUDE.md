# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production (runs TypeScript compilation then Vite build)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code linting

### Docker & Deployment
- `docker build . -t lome.dev` - Build Docker image using multi-stage Dockerfile
- Kubernetes manifests are available in `manifests/` directory for deployment

## Architecture Overview

### Framework & Stack
- **Frontend Framework**: Custom web components using `@pesca-dev/atomicity` library
- **Routing**: Vaadin Router for client-side navigation
- **Build Tool**: Vite with TypeScript
- **Styling**: Plain CSS with custom fonts (FliegeMono family)
- **Icons**: Simple Icons library for social/tech icons
- **Deployment**: Docker multi-stage build with nginx serving static content

### Core Architecture Pattern
The application uses a **custom component decorator pattern** built on web components:

1. **Component Registration** (`src/component.ts`):
   - `@Component(tag)` decorator that extends `AbstractElement`
   - Automatically registers custom elements with the browser

2. **Main Application Structure**:
   - `index.html` serves the entry point with `<website-main>` custom element
   - `src/index.ts` imports all components to register them
   - `src/main.tsx` contains the main `<website-main>` component
   - Components use JSX-like syntax with the `a` function from atomicity

3. **Key Components**:
   - `WebsiteMain` (`src/main.tsx`): Root component that renders header
   - `WebsiteHeader` (`src/header.tsx`): Header with personal info and social links

### Custom Tooling
- **SVG Utils** (`src/utils.ts`): Utility function to convert SVG strings to DOM elements
- **Font System**: Custom FliegeMono font family served from `public/fonts/`
- **TypeScript Configuration**: React JSX with custom factory (`jsxFactory: "a"`), decorators enabled

### Routing System
The application uses **Vaadin Router** for client-side navigation:

1. **Route Configuration** (`src/routes.ts`):
   - Centralized route definitions
   - Lazy-loaded components via dynamic imports
   - Routes: `/` (home), `/blog/:slug` (blog posts), `(.*)` (404)

2. **Router Initialization** (`src/main.tsx`):
   - Initialized in `connectedCallback()`
   - Outlet-based rendering: `<div id="outlet"></div>`
   - Hash navigation support for section scrolling (#about, #blog, etc.)

3. **Component Lifecycle Hooks** (`src/blog-post.tsx`):
   - `onBeforeEnter(location)`: Called before route is rendered
   - `connectedCallback()`: Loads content after component is in DOM
   - Proper timing ensures all elements exist before manipulation

4. **Navigation Patterns**:
   - Standard anchor tags: `<a href="/blog/post-slug">`
   - Vaadin Router automatically intercepts and handles navigation
   - No manual `pushState` or `popstate` events needed

### File Organization
```
src/
├── main.tsx          # Root application component with router
├── routes.ts         # Centralized route configuration
├── pages/
│   ├── home.tsx      # Home page wrapper (all sections)
│   └── not-found.tsx # 404 error page
├── header.tsx        # Header component with navigation
├── blog.tsx          # Blog list component
├── blog-post.tsx     # Blog post viewer with lifecycle hooks
├── component.ts      # Component decorator factory
├── utils.ts          # Utility functions (SVG handling)
├── index.ts          # Component imports/registration
└── *.css             # Component and global styles

public/
├── fonts/            # FliegeMono font family files
└── styles/           # Global stylesheets
```

### ESLint Configuration
- TypeScript ESLint rules with browser globals
- Special rule to ignore unused variable `a` (the JSX factory function)
- Strict type checking enabled

### Deployment Pipeline
1. **Build Stage**: TypeScript compilation → Vite bundling → Static files
2. **Production**: nginx serves static files from `/usr/share/nginx/html`
3. **Kubernetes**: Service, Ingress, and Deployment manifests provided

## Development Notes

- The JSX factory function `a` is imported from `@pesca-dev/atomicity` and is used throughout components
- All components extend `AbstractElement` and use the `@Component` decorator for registration
- The app uses custom fonts loaded from the public directory
- No traditional React/Vue/Angular - this is a custom web components implementation
- Routing is handled by Vaadin Router - add new routes in `src/routes.ts`

### Adding New Routes

To add a new route:
1. Create component in `src/pages/` or appropriate directory
2. Add route to `src/routes.ts`:
   ```typescript
   {
     path: '/new-page',
     component: 'website-new-page',
     action: async () => {
       await import('./pages/new-page');
     }
   }
   ```
3. Navigation links automatically work: `<a href="/new-page">Link</a>`


## Atomicity usage quick reference
- Import `a`, `AbstractElement`, signals from `@pesca-dev/atomicity`. Set tsconfig: "jsx": "react", "jsxFactory": "a".
- JSX -> `createElement(tag, props, ...children)`. Props: `on*` = listeners, `className` -> `class`, string = attribute, function = reactive attribute.
- Children may be functions (signals). Returning an array from that function renders lists; passing the function reference enables reactivity.

Example: functional-children list rendering (as used in achievements)
```tsx
import { a, AbstractElement } from "@pesca-dev/atomicity";
import { Component } from "./component";

@Component("x-achievements")
export class Achievements extends AbstractElement {
  badges = () => BADGES.map(b => (
    <div className="badge" title={b.desc}>
      <div className="badge-medal"></div>
      <div className="badge-title">{b.title}</div>
    </div>
  ));
  render() {
    return (
      <section className="achievements">
        <div className="achievements-grid">{this.badges}</div>
      </section>
    ) as HTMLElement;
  }
}
```
Notes
- Pass `{this.badges}` (do not call it). Atomicity treats function children as signals, calls them, and re-renders when their dependencies (atoms) change. Arrays are supported natively.
- For typed attributes: extend `AbstractElement<Attrs>` and call `super({ key: [fromString, default] }, useShadow?)`; declare `static get observedAttributes()` accordingly. Access via `this.attrs.key()` / `.get()`; update with `.set()`.
