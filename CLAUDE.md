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

### File Organization
```
src/
├── main.tsx          # Root application component
├── header.tsx        # Header component with personal info
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