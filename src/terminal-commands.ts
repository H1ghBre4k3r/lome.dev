/**
 * Terminal command registry and implementations
 */

export interface CommandOutput {
  lines: string[];
  className?: string;
}

export type CommandFunction = (args: string[]) => CommandOutput | Promise<CommandOutput>;

export interface Command {
  name: string;
  description: string;
  usage?: string;
  execute: CommandFunction;
  hidden?: boolean;
}


// Compact ASCII Art (fits terminal width)
const NEOFETCH_ART_COMPACT = `
┌──────────────────────┐
│     H1ghBre4k3r      │
└──────────────────────┘`;

export const commands: Command[] = [
  {
    name: 'help',
    description: 'Show available commands',
    execute: () => {
      const visibleCommands = commands.filter(cmd => !cmd.hidden);
      const lines = [
        'Available commands:',
        '',
        ...visibleCommands.map(cmd => `  ${cmd.name.padEnd(15)} - ${cmd.description}`)
      ];
      return { lines };
    }
  },
  {
    name: 'whoami',
    description: 'Display user information',
    execute: () => ({
      lines: [
        'H1ghBre4k3r',
        'Computer Science Student',
        'GitHub Campus Expert 🎓',
        'TypeScript & Rust enthusiast',
        'Building compilers, frameworks & tools'
      ]
    })
  },
  {
    name: 'pwd',
    description: 'Print working directory',
    execute: () => ({
      lines: ['📍 Kiel, Germany']
    })
  },
  {
    name: 'ls',
    description: 'List projects',
    usage: 'ls [directory]',
    execute: (args) => {
      const target = args[0] || '';

      if (target === 'projects' || target === '') {
        return {
          lines: [
            'Projects:',
            '',
            '  📁 y-lang/              - Programming language + LLVM compiler',
            '  📁 dependory/           - DI framework for TypeScript',
            '  📁 lachs/               - Lexer generator for Rust',
            '  📁 disruption/          - Discord API wrapper in Rust',
            '  📁 server-monitoring/   - Monitoring from outer space',
            '  📁 moneyboy/            - Payment tracking mobile app',
            '',
            'Use: cat <project>/README.md for details'
          ]
        };
      }

      return {
        lines: [`ls: cannot access '${target}': No such file or directory`],
        className: 'error'
      };
    }
  },
  {
    name: 'cat',
    description: 'Display file contents',
    usage: 'cat <file>',
    execute: (args) => {
      if (!args[0]) {
        return {
          lines: ['cat: missing file operand'],
          className: 'error'
        };
      }

      const file = args[0].toLowerCase();

      if (file === 'skills.txt' || file === 'expertise.txt') {
        return {
          lines: [
            '╔══════════════════════════════════════╗',
            '║        Technical Expertise           ║',
            '╠══════════════════════════════════════╣',
            '║ Languages:                           ║',
            '║   • TypeScript  ████████████ Expert  ║',
            '║   • Rust        ██████████   Expert  ║',
            '║   • JavaScript  ███████████  Expert  ║',
            '║                                      ║',
            '║ Technologies:                        ║',
            '║   • React/Web Components             ║',
            '║   • Node.js/Deno                     ║',
            '║   • Docker & Kubernetes              ║',
            '║   • LLVM & Compilers                 ║',
            '║                                      ║',
            '║ Interests:                           ║',
            '║   • IoT Systems                      ║',
            '║   • Distributed Systems              ║',
            '║   • Programming Language Design      ║',
            '║   • Developer Tools                  ║',
            '╚══════════════════════════════════════╝'
          ]
        };
      }

      if (file.includes('readme')) {
        return {
          lines: [
            'Check out my projects:',
            '',
            'Y-Lang: Expression-centric language with LLVM backend',
            'Dependory: Lightweight DI for TypeScript',
            'Lachs: Lexer generator using Rust proc macros',
            '',
            'Visit: https://github.com/H1ghBre4k3r'
          ]
        };
      }

      return {
        lines: [`cat: ${args[0]}: No such file or directory`],
        className: 'error'
      };
    }
  },
  {
    name: 'neofetch',
    description: 'Display system information',
    execute: () => ({
      lines: [
        NEOFETCH_ART_COMPACT,
        '  ├─ User:        H1ghBre4k3r',
        '  ├─ Role:        CS Student & GitHub Campus Expert',
        '  ├─ Location:    Kiel, Germany 🇩🇪',
        '  ├─ Languages:   TypeScript, Rust, JavaScript',
        '  ├─ Focus:       IoT, Distributed Systems, Compilers',
        '  ├─ Projects:    6+ active projects',
        '  ├─ GitHub:      github.com/H1ghBre4k3r',
        '  └─ Website:     lome.dev',
        ''
      ],
      className: 'pre'
    })
  },
  {
    name: 'clear',
    description: 'Clear the terminal',
    execute: () => ({ lines: ['CLEAR_SCREEN'] })
  },
  {
    name: 'history',
    description: 'Show command history',
    execute: () => ({ lines: ['SHOW_HISTORY'] })
  },
  {
    name: 'contact',
    description: 'Display contact information',
    execute: () => ({
      lines: [
        '📧 Contact Information:',
        '',
        '  GitHub:    https://github.com/H1ghBre4k3r',
        '  Twitter:   https://twitter.com/h1ghbre4k3r',
        '  Bluesky:   https://bsky.app/profile/h1ghbre4k3r.bsky.social',
        '  Campus:    https://githubcampus.expert/H1ghBre4k3r/',
        ''
      ]
    })
  },
  {
    name: 'sudo',
    description: 'Execute command as superuser',
    hidden: true,
    execute: (args) => {
      const cmd = args.join(' ');

      if (cmd.includes('rm -rf /') || cmd.includes('rm -rf /*')) {
        return {
          lines: [
            '[sudo] password for H1ghBre4k3r: ',
            'Nice try! 😄',
            '',
            'Just kidding - this terminal is read-only.',
            'Your filesystem is safe! 🛡️'
          ],
          className: 'gradient'
        };
      }

      return {
        lines: ['[sudo] This terminal does not support sudo operations'],
        className: 'error'
      };
    }
  },
  {
    name: 'hack',
    description: 'Initialize hacking sequence',
    hidden: true,
    execute: () => ({
      lines: [
        '[ INITIALIZING HACK SEQUENCE ]',
        '',
        'Connecting to mainframe... ✓',
        'Bypassing firewall... ✓',
        'Cracking encryption... ✓',
        'Accessing database... ✓',
        '',
        'HACK COMPLETE! 😎',
        '',
        '(Just kidding, nothing was actually hacked)',
      ],
      className: 'accent'
    })
  },
  {
    name: 'matrix',
    description: 'Enter the Matrix',
    hidden: true,
    execute: () => ({
      lines: [
        'Wake up, Neo...',
        'The Matrix has you...',
        'Follow the white rabbit. 🐰',
        '',
        'Knock, knock.'
      ],
      className: 'highlight'
    })
  },
  {
    name: 'coffee',
    description: 'Brew some coffee',
    hidden: true,
    execute: () => ({
      lines: [
        '     ) )',
        '    ( (',
        '  ..........',
        '  |       |]',
        '  \\       /',
        '   `-----\'',
        '',
        '☕ Coffee brewing... Developer fuel activated!'
      ]
    })
  }
];

export function findCommand(name: string): Command | undefined {
  return commands.find(cmd => cmd.name === name);
}

export function executeCommand(input: string): CommandOutput | Promise<CommandOutput> {
  const parts = input.trim().split(/\s+/);
  const commandName = parts[0].toLowerCase();
  const args = parts.slice(1);

  const command = findCommand(commandName);

  if (!command) {
    return {
      lines: [`Command not found: ${commandName}. Type 'help' for available commands.`],
      className: 'error'
    };
  }

  return command.execute(args);
}
