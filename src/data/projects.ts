export type ProjectCategory = 'Compiler' | 'Framework' | 'Tool' | 'Library' | 'API' | 'Application' | 'IoT';
export type ProjectStatus = 'active' | 'maintained' | 'archived';

export interface Project {
  slug: string;
  title: string;
  description: string;
  repo: string;  // GitHub repository in format "username/repo"
  category: ProjectCategory;
  technologies: string[];
  status: ProjectStatus;
  featured: boolean;
  liveDemo?: string;
  highlights?: string[];
}

export const PROJECTS: Project[] = [
  {
    slug: 'y-lang',
    title: 'Y Programming Language',
    description: 'An experimental, expression-centric programming language targeting LLVM. Features static typing with inference, first-class functions, and a complete LSP implementation with formatter.',
    repo: 'H1ghBre4k3r/y-lang',
    category: 'Compiler',
    technologies: ['Rust', 'LLVM', 'LSP'],
    status: 'active',
    featured: true,
    highlights: [
      'LLVM-based code generation via Inkwell',
      'Full Language Server Protocol support',
      'Type inference and static typing',
      'Built-in formatter (yfmt) and compiler (yc)'
    ]
  },
  {
    slug: 'disruption',
    title: 'Disruption',
    description: 'Featherweight wrapper around the Discord API written in Rust. Clean, type-safe abstraction for building Discord bots with focus on simplicity and performance.',
    repo: 'H1ghBre4k3r/disruption',
    category: 'Library',
    technologies: ['Rust', 'Discord API', 'Async'],
    status: 'active',
    featured: true,
    highlights: [
      'Type-safe Discord API wrapper',
      'Async/await support',
      'Minimal dependencies',
      'Easy bot development'
    ]
  },
  {
    slug: 'lachs',
    title: 'Lachs',
    description: 'Lightweight lexer generator for Rust written in Rust. Automatically generates lexers from enum definitions with terminals and regex-based literals using proc macros.',
    repo: 'H1ghBre4k3r/lachs',
    category: 'Tool',
    technologies: ['Rust', 'Proc Macros', 'Lexer'],
    status: 'maintained',
    featured: true,
    highlights: [
      'Procedural macro-based generation',
      'Regex support for tokens',
      'Zero runtime overhead',
      'Type-safe lexer generation'
    ]
  },
  {
    slug: 'atomicity',
    title: 'Atomicity',
    description: 'Lightweight reactive web component library with fine-grained reactivity, JSX support, and zero dependencies. Built for modern web development with TypeScript-first design.',
    repo: 'pesca-dev/atomicity',
    category: 'Framework',
    technologies: ['TypeScript', 'Web Components', 'JSX', 'Signals'],
    status: 'active',
    featured: true,
    highlights: [
      'Fine-grained reactivity with signals',
      'Native web components',
      'Zero dependencies',
      'TypeScript-first'
    ]
  },
  {
    slug: 'server-monitoring',
    title: 'Server Monitoring',
    description: 'Comprehensive Rust-based server monitoring solution with distributed agent architecture, real-time metrics collection, service health checks, and beautiful TUI dashboards.',
    repo: 'H1ghBre4k3r/server-monitoring',
    category: 'Tool',
    technologies: ['Rust', 'Tokio', 'Axum', 'SQLite', 'TUI'],
    status: 'active',
    featured: true,
    highlights: [
      'Actor-based architecture with distributed agents',
      'Real-time metrics via WebSocket streaming',
      'Service health checks and smart alerting',
      'Terminal UI with time-series charts'
    ]
  },
  {
    slug: 'dependory',
    title: 'Dependory',
    description: 'A featherweight yet powerful dependency injection framework for TypeScript using decorators. Supports singletons, transients, custom registries, and flexible injection patterns.',
    repo: 'H1ghBre4k3r/dependory',
    category: 'Framework',
    technologies: ['TypeScript', 'Decorators', 'DI'],
    status: 'maintained',
    featured: false,
    highlights: [
      'Zero-dependency framework',
      'Decorator-based injection',
      'Singleton and transient lifetimes',
      'Custom registry support'
    ]
  },
  {
    slug: 'hurricane-ics',
    title: 'Hurricane ICS',
    description: 'ICS calendar provider for the Hurricane Festival. Generates iCalendar files from festival lineups, allowing attendees to import their favorite artist schedules.',
    repo: 'H1ghBre4k3r/hurricane-ics',
    category: 'Tool',
    technologies: ['TypeScript', 'iCalendar', 'Web Scraping'],
    status: 'maintained',
    featured: false,
    highlights: [
      'Festival lineup scraping',
      'iCalendar generation',
      'Schedule export',
      'Artist-based filtering'
    ]
  },
  {
    slug: 'lighthouse-js',
    title: 'lighthouse.js',
    description: 'A simple and easy-to-use JavaScript wrapper around the CAU Lighthouse API. Control the lighthouse display with a clean, type-safe interface.',
    repo: 'H1ghBre4k3r/lighthouse.js',
    category: 'Library',
    technologies: ['TypeScript', 'API', 'WebSocket'],
    status: 'maintained',
    featured: false,
    highlights: [
      'Type-safe API wrapper',
      'Real-time lighthouse control',
      'Event-based updates',
      'Easy integration'
    ]
  },
];

/**
 * Get all projects
 */
export function getAllProjects(): Project[] {
  return PROJECTS;
}

/**
 * Get only featured projects (default 4)
 */
export function getFeaturedProjects(limit = 4): Project[] {
  return PROJECTS.filter(p => p.featured).slice(0, limit);
}

/**
 * Get project by slug
 */
export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find(p => p.slug === slug);
}

/**
 * Get unique list of all technologies across projects
 */
export function getAllTechnologies(): string[] {
  const techSet = new Set<string>();
  PROJECTS.forEach(project => {
    project.technologies.forEach(tech => techSet.add(tech));
  });
  return Array.from(techSet).sort();
}

/**
 * Get unique list of all categories
 */
export function getAllCategories(): ProjectCategory[] {
  const categorySet = new Set<ProjectCategory>();
  PROJECTS.forEach(project => categorySet.add(project.category));
  return Array.from(categorySet).sort();
}

/**
 * Filter projects by criteria
 */
export function filterProjects(
  projects: Project[],
  filters: {
    technology?: string;
    category?: string;
    status?: string;
    search?: string;
  }
): Project[] {
  return projects.filter(project => {
    // Technology filter
    if (filters.technology && filters.technology !== 'all') {
      if (!project.technologies.includes(filters.technology)) {
        return false;
      }
    }

    // Category filter
    if (filters.category && filters.category !== 'all') {
      if (project.category !== filters.category) {
        return false;
      }
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      if (project.status !== filters.status) {
        return false;
      }
    }

    // Search filter
    if (filters.search && filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      const matchesTitle = project.title.toLowerCase().includes(searchLower);
      const matchesDescription = project.description.toLowerCase().includes(searchLower);
      const matchesTech = project.technologies.some(tech =>
        tech.toLowerCase().includes(searchLower)
      );

      if (!matchesTitle && !matchesDescription && !matchesTech) {
        return false;
      }
    }

    return true;
  });
}
