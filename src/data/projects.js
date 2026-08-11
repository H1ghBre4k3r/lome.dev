// @ts-check

/**
 * @typedef {Object} Project
 * @property {string} slug
 * @property {string} name
 * @property {string} description
 * @property {string} repositoryUrl
 * @property {string | undefined} homepageUrl
 * @property {'active' | 'archived'} status
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
    repositoryUrl: 'https://github.com/H1ghBre4k3r/disruption',
    homepageUrl: undefined,
    status: 'active',
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
    repositoryUrl: 'https://github.com/H1ghBre4k3r/algorithm-visualization',
    homepageUrl: 'http://algo-viz.lome.dev/',
    status: 'active',
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
    repositoryUrl: 'https://github.com/H1ghBre4k3r/eventer',
    homepageUrl: undefined,
    status: 'active',
    repository: 'https://github.com/H1ghBre4k3r/eventer',
    language: 'TypeScript',
    archived: false,
    tags: ['events', 'typescript'],
    demo: undefined,
  },
  {
    slug: 'dependory',
    name: 'dependory',
    description: 'A featherweight yet powerful dependency injection framework.',
    repositoryUrl: 'https://github.com/H1ghBre4k3r/dependory',
    homepageUrl: undefined,
    status: 'active',
    repository: 'https://github.com/H1ghBre4k3r/dependory',
    language: 'TypeScript',
    archived: false,
    tags: ['dependency-injection', 'typescript'],
    demo: undefined,
  },
  {
    slug: 'moneyboy',
    name: 'MoneyBoy',
    description: 'The mobile app for MoneyBoy - a tool to track spendings between different people.',
    repositoryUrl: 'https://github.com/pesca-dev/moneyboy-app',
    homepageUrl: 'https://pesca-dev.github.io/moneyboy-app',
    status: 'active',
    repository: 'https://github.com/pesca-dev/moneyboy-app',
    language: 'TypeScript',
    archived: false,
    tags: ['moneyboy'],
    demo: 'https://pesca-dev.github.io/moneyboy-app',
  },
  {
    slug: 'y-lang-v0',
    name: 'y-lang-v0',
    description: 'Compiler for the (rather new and very experimental) Y programming language.',
    repositoryUrl: 'https://github.com/H1ghBre4k3r/y-lang-v0',
    homepageUrl: undefined,
    status: 'archived',
    repository: 'https://github.com/H1ghBre4k3r/y-lang-v0',
    language: 'Rust',
    archived: true,
    tags: ['compiler', 'nasm-assembly', 'programming-language', 'rust'],
    demo: undefined,
  },
]);
