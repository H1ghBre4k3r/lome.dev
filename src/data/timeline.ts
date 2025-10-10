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
}

export const TIMELINE_ENTRIES: TimelineEntry[] = [
  {
    id: 'github-campus-expert',
    date: '2024',
    title: 'GitHub Campus Expert',
    organization: 'GitHub Education',
    type: 'achievement',
    description: 'Selected as a GitHub Campus Expert to lead and grow the developer community at university. Organizing workshops, hackathons, and tech talks to empower fellow students.',
    tags: ['Community', 'Leadership', 'Education'],
    link: 'https://githubcampus.expert/H1ghBre4k3r/',
    icon: '🎓'
  },
  {
    id: 'cs-student',
    date: '2020 - Present',
    title: 'Computer Science Student',
    organization: 'University of Kiel',
    type: 'education',
    description: 'Pursuing Bachelor\'s degree in Computer Science with focus on compiler design, distributed systems, and programming language theory.',
    tags: ['Computer Science', 'Kiel'],
    icon: '🎓'
  },
  {
    id: 'y-lang',
    date: '2024',
    title: 'Y Programming Language',
    organization: 'Personal Project',
    type: 'opensource',
    description: 'Designed and implemented an expression-centric programming language targeting LLVM. Built complete toolchain including lexer, parser, semantic analyzer, code generator, and LSP server.',
    tags: ['Rust', 'LLVM', 'Compiler Design'],
    link: 'https://github.com/H1ghBre4k3r/y-lang',
    icon: '🚀'
  },
  {
    id: 'dependory',
    date: '2023',
    title: 'Dependory DI Framework',
    organization: 'Open Source',
    type: 'opensource',
    description: 'Created a lightweight dependency injection framework for TypeScript using decorators. Supports multiple injection patterns, custom registries, and flexible service lifetimes.',
    tags: ['TypeScript', 'Open Source', 'Framework'],
    link: 'https://github.com/H1ghBre4k3r/dependory',
    icon: '⚡'
  },
  {
    id: 'lachs-lexer',
    date: '2023',
    title: 'Lachs Lexer Generator',
    organization: 'Open Source',
    type: 'opensource',
    description: 'Built a proc macro-based lexer generator for Rust that automatically generates lexers from enum definitions with regex support.',
    tags: ['Rust', 'Proc Macros', 'Compiler Tools'],
    link: 'https://github.com/H1ghBre4k3r/lachs',
    icon: '🔧'
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
    id: 'coding-start',
    date: '2017',
    title: 'Started Programming Journey',
    organization: 'Self-taught',
    type: 'education',
    description: 'Began learning programming with Python and web development. Discovered passion for creating tools and solving problems with code.',
    tags: ['Milestone', 'Self-learning'],
    icon: '💻'
  }
];
