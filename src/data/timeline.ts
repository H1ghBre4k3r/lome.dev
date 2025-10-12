export interface TimelineEntry {
  id: string;
  date: string;
  title: string;
  organization: string;
  type: 'education' | 'work' | 'achievement' | 'opensource';
  description: string;
  tags?: string[];
  link?: string;
  icon?: string;
  details?: string;  // Extended description shown when expanded
  achievements?: string[];  // List of achievements/accomplishments
  skills?: string[];  // Technologies/skills used or learned
}

export const TIMELINE_ENTRIES: TimelineEntry[] = [
  {
    id: 'server-monitoring',
    date: '2025',
    title: 'Server Monitoring Solution',
    organization: 'Personal Project',
    type: 'opensource',
    description: 'Comprehensive Rust-based monitoring solution with distributed agent architecture, real-time metrics collection, and beautiful TUI dashboards.',
    details: 'A production-ready monitoring system featuring actor-based architecture, SQLite persistence, WebSocket streaming, and terminal UI with time-series charts.',
    achievements: [
      'Actor-based architecture with Tokio',
      'Real-time metrics via WebSocket',
      'SQLite-backed time-series storage',
      'TUI dashboard with Ratatui',
      'Service health checks and alerting'
    ],
    skills: ['Rust', 'Tokio', 'Axum', 'SQLite', 'TUI', 'WebSocket'],
    tags: ['Rust', 'Monitoring', 'Distributed Systems'],
    link: 'https://github.com/H1ghBre4k3r/server-monitoring',
    icon: '📊'
  },
  {
    id: 'github-campus-expert',
    date: '2024',
    title: 'GitHub Campus Expert',
    organization: 'GitHub Education',
    type: 'achievement',
    description: 'Selected as a GitHub Campus Expert to lead and grow the developer community at university. Delivered technical workshops on Git and GitHub to empower fellow students.',
    details: 'As a GitHub Campus Expert, I act as a bridge between GitHub and the student developer community at my university. This role involves organizing technical events and fostering an inclusive environment for learning and collaboration.',
    achievements: [
      'Delivered workshops on Git and GitHub workflows',
      'Helped grow campus developer community',
      'Promoted open source contribution culture',
      'Organized tech talks and knowledge sharing sessions'
    ],
    skills: ['Public Speaking', 'Event Organization', 'Community Building', 'Git'],
    tags: ['Community', 'Leadership', 'Education'],
    link: 'https://githubcampus.expert/H1ghBre4k3r/',
    icon: '🎓'
  },
  {
    id: 'lachs-lexer',
    date: '2024',
    title: 'Lachs Lexer Generator',
    organization: 'Open Source',
    type: 'opensource',
    description: 'Built a proc macro-based lexer generator for Rust that automatically generates lexers from enum definitions with regex support.',
    details: 'A lightweight lexer generator that leverages Rust\'s procedural macros to provide zero runtime overhead and type-safe lexer generation.',
    achievements: [
      'Procedural macro-based code generation',
      'Regex support for token matching',
      'Zero runtime overhead',
      'Type-safe lexer API'
    ],
    skills: ['Rust', 'Proc Macros', 'Lexical Analysis', 'Code Generation'],
    tags: ['Rust', 'Proc Macros', 'Compiler Tools'],
    link: 'https://github.com/H1ghBre4k3r/lachs',
    icon: '🔧'
  },
  {
    id: 'atomicity',
    date: '2024',
    title: 'Atomicity Framework',
    organization: 'pesca-dev',
    type: 'opensource',
    description: 'Co-created a lightweight reactive web component library with fine-grained reactivity, JSX support, and zero dependencies.',
    details: 'Built a modern web framework focused on performance and developer experience, featuring signals-based reactivity and native web components.',
    achievements: [
      'Fine-grained reactivity with signals',
      'Zero external dependencies',
      'TypeScript-first design',
      'Native web components support'
    ],
    skills: ['TypeScript', 'Web Components', 'Reactivity', 'JSX'],
    tags: ['TypeScript', 'Framework', 'Web Components'],
    link: 'https://github.com/pesca-dev/atomicity',
    icon: '⚛️'
  },
  {
    id: 'y-lang',
    date: '2023 - Present',
    title: 'Y Programming Language',
    organization: 'Personal Project',
    type: 'opensource',
    description: 'Designed and implemented an expression-centric programming language targeting LLVM. Built complete toolchain including lexer, parser, semantic analyzer, code generator, and LSP server.',
    details: 'Y is an experimental programming language that explores expression-centric design where everything is an expression. The project demonstrates modern compiler engineering practices including multi-stage compilation, IR optimization, and developer tooling integration.',
    achievements: [
      'Implemented full LLVM code generation pipeline via Inkwell',
      'Built Language Server Protocol (LSP) for IDE integration',
      'Created type inference engine with static typing',
      'Developed custom formatter (yfmt) and compiler (yc)',
      'Active development with continuous improvements'
    ],
    skills: ['Rust', 'LLVM', 'Compiler Design', 'Type Systems', 'LSP', 'Parsing'],
    tags: ['Rust', 'LLVM', 'Compiler Design'],
    link: 'https://github.com/H1ghBre4k3r/y-lang',
    icon: '🚀'
  },
  {
    id: 'disruption',
    date: '2022',
    title: 'Disruption Discord API',
    organization: 'Open Source',
    type: 'opensource',
    description: 'Created a featherweight Discord API wrapper in Rust with type-safe abstractions and async/await support.',
    details: 'A lightweight Discord bot library focusing on simplicity, type safety, and performance.',
    skills: ['Rust', 'Async Programming', 'API Design'],
    tags: ['Rust', 'Discord', 'API'],
    link: 'https://github.com/H1ghBre4k3r/disruption',
    icon: '💬'
  },
  {
    id: 'dependory',
    date: '2020',
    title: 'Dependory DI Framework',
    organization: 'Open Source',
    type: 'opensource',
    description: 'Created a lightweight dependency injection framework for TypeScript using decorators. Supports multiple injection patterns, custom registries, and flexible service lifetimes.',
    details: 'A featherweight yet powerful TypeScript dependency injection framework that has gained significant traction in the community with 23+ stars.',
    achievements: [
      'Zero-dependency framework design',
      'Decorator-based injection patterns',
      'Support for singleton and transient lifetimes',
      'Custom registry implementation',
      '23+ GitHub stars'
    ],
    skills: ['TypeScript', 'Decorators', 'Design Patterns', 'Framework Design'],
    tags: ['TypeScript', 'Open Source', 'Framework'],
    link: 'https://github.com/H1ghBre4k3r/dependory',
    icon: '⚡'
  },
  {
    id: 'arctic-vault',
    date: '2020',
    title: 'Arctic Code Vault Contributor',
    organization: 'GitHub Archive Program',
    type: 'achievement',
    description: 'Code preserved in the GitHub Arctic Code Vault as part of the 2020 Archive Program.',
    tags: ['Achievement', 'Open Source'],
    icon: '❄️'
  },
  {
    id: 'cs-student',
    date: '2017 - Present',
    title: 'Computer Science Student',
    organization: 'University of Kiel',
    type: 'education',
    description: 'Pursuing Bachelor\'s degree in Computer Science with focus on compiler design, distributed systems, and programming language theory.',
    details: 'Comprehensive computer science education covering theoretical foundations and practical applications. Strong emphasis on systems programming, algorithm design, and software engineering principles.',
    achievements: [
      'Completed advanced courses in Compiler Construction, Distributed Systems, and Algorithms',
      'Research Assistant on multiple projects',
      'Bachelor\'s Thesis on distributed coordination systems',
      'Active contributor to university open source initiatives'
    ],
    skills: ['Algorithms', 'Data Structures', 'Systems Programming', 'Distributed Systems', 'Theory of Computation'],
    tags: ['Computer Science', 'Kiel'],
    icon: '🎓'
  },
  {
    id: 'coding-start',
    date: '2012',
    title: 'Started Programming Journey',
    organization: 'Self-taught',
    type: 'education',
    description: 'Began learning programming with Python and web development. Discovered passion for creating tools and solving problems with code.',
    details: 'Started the journey into software development at a young age, exploring various programming languages and building foundational skills that would lead to a career in computer science.',
    tags: ['Milestone', 'Self-learning'],
    icon: '💻'
  }
];
