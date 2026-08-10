// @ts-check

/**
 * @typedef {Object} Project
 * @property {string} slug
 * @property {string} name
 * @property {string} description
 * @property {string} repository
 * @property {string} language
 * @property {boolean} archived
 * @property {string[]} tags
 * @property {string | undefined} demo
 */

/** @type {readonly Project[]} */
export const projects = Object.freeze([
  {
    slug: 'disruption',
    name: 'disruption',
    description: 'Featherweight wrapper around the Discord-API written in Rust.',
    repository: 'https://github.com/H1ghBre4k3r/disruption',
    language: 'Rust',
    archived: false,
    tags: ['api', 'discord', 'rust', 'wrapper'],
    demo: undefined,
  },
  {
    slug: 'algorithm-visualization',
    name: 'algorithm-visualization',
    description: 'Interactive algorithm and data structure visualizations to make learning computer science intuitive.',
    repository: 'https://github.com/H1ghBre4k3r/algorithm-visualization',
    language: 'Rust',
    archived: false,
    tags: ['algorithms', 'visualization'],
    demo: 'http://algo-viz.lome.dev/',
  },
  {
    slug: 'eventer',
    name: 'eventer',
    description: 'A tool to plan events for an arbitrary amount of participants.',
    repository: 'https://github.com/H1ghBre4k3r/eventer',
    language: 'TypeScript',
    archived: false,
    tags: ['events', 'typescript'],
    demo: 'https://eventer.lome.dev',
  },
  {
    slug: 'dependory',
    name: 'dependory',
    description: 'A featherweight yet powerful dependency injection framework.',
    repository: 'https://github.com/H1ghBre4k3r/dependory',
    language: 'TypeScript',
    archived: false,
    tags: ['dependency-injection', 'typescript'],
    demo: undefined,
  },
  {
    slug: 'moneyboy',
    name: 'MoneyBoy',
    description: 'MoneyBoy.',
    repository: 'https://github.com/H1ghBre4k3r/MoneyBoy',
    language: 'Unknown',
    archived: false,
    tags: ['moneyboy'],
    demo: undefined,
  },
  {
    slug: 'y-lang-v0',
    name: 'y-lang-v0',
    description: 'Compiler for the (rather new and very experimental) Y programming language.',
    repository: 'https://github.com/H1ghBre4k3r/y-lang-v0',
    language: 'Rust',
    archived: true,
    tags: ['compiler', 'nasm-assembly', 'programming-language', 'rust'],
    demo: undefined,
  },
]);
