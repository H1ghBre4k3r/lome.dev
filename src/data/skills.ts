export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Skill {
  name: string;
  level: SkillLevel;
  icon?: string;
  color?: string;
  projects?: string[]; // Links or names of projects using this skill
}

export interface SkillCategory {
  title: string;
  icon: string;
  skills: Skill[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Languages',
    icon: '💻',
    skills: [
      {
        name: 'TypeScript',
        level: 'expert',
        color: '#3178c6',
        projects: ['Dependory', 'lome.dev', 'Portfolio']
      },
      {
        name: 'Rust',
        level: 'advanced',
        color: '#ce412b',
        projects: ['Y-Lang', 'Lachs', 'Disruption']
      },
      {
        name: 'JavaScript',
        level: 'expert',
        color: '#f7df1e'
      },
      {
        name: 'Python',
        level: 'intermediate',
        color: '#3776ab'
      },
      {
        name: 'C/C++',
        level: 'intermediate',
        color: '#00599c'
      },
      {
        name: 'Go',
        level: 'intermediate',
        color: '#00add8'
      }
    ]
  },
  {
    title: 'Frameworks & Libraries',
    icon: '⚡',
    skills: [
      {
        name: 'React',
        level: 'advanced',
        color: '#61dafb'
      },
      {
        name: 'Node.js',
        level: 'advanced',
        color: '#339933'
      },
      {
        name: 'Vite',
        level: 'advanced',
        color: '#646cff'
      },
      {
        name: 'Express',
        level: 'advanced',
        color: '#000000'
      },
      {
        name: 'Atomicity',
        level: 'advanced',
        color: '#667eea',
        projects: ['lome.dev']
      }
    ]
  },
  {
    title: 'Tools & DevOps',
    icon: '🛠️',
    skills: [
      {
        name: 'Git',
        level: 'expert',
        color: '#f05032'
      },
      {
        name: 'Docker',
        level: 'advanced',
        color: '#2496ed'
      },
      {
        name: 'Kubernetes',
        level: 'intermediate',
        color: '#326ce5'
      },
      {
        name: 'GitHub Actions',
        level: 'advanced',
        color: '#2088ff'
      },
      {
        name: 'Neovim',
        level: 'advanced',
        color: '#57a143'
      },
      {
        name: 'Linux',
        level: 'advanced',
        color: '#fcc624'
      }
    ]
  },
  {
    title: 'Specialized',
    icon: '🚀',
    skills: [
      {
        name: 'Compilers',
        level: 'advanced',
        projects: ['Y-Lang', 'Lachs']
      },
      {
        name: 'LLVM',
        level: 'intermediate',
        projects: ['Y-Lang']
      },
      {
        name: 'LSP',
        level: 'advanced',
        projects: ['Y-Lang LSP']
      },
      {
        name: 'Proc Macros',
        level: 'advanced',
        projects: ['Lachs']
      },
      {
        name: 'DI/IoC',
        level: 'expert',
        projects: ['Dependory']
      },
      {
        name: 'Distributed Systems',
        level: 'intermediate'
      }
    ]
  },
  {
    title: 'Databases',
    icon: '🗄️',
    skills: [
      {
        name: 'PostgreSQL',
        level: 'intermediate',
        color: '#336791'
      },
      {
        name: 'MongoDB',
        level: 'intermediate',
        color: '#47a248'
      },
      {
        name: 'Redis',
        level: 'intermediate',
        color: '#dc382d'
      },
      {
        name: 'SQLite',
        level: 'intermediate',
        color: '#003b57'
      }
    ]
  }
];

export const CURRENTLY_LEARNING: string[] = [
  'Embedded Rust (ESP32)',
  'Matter/HomeKit Protocol',
  'LLVM IR & Compiler Optimization',
  'Rust 2024 Edition Features'
];

export const SOFT_SKILLS: string[] = [
  'Technical Writing',
  'Community Leadership',
  'Public Speaking',
  'Mentoring',
  'Project Management',
  'Collaboration'
];

export function getSkillLevelPercentage(level: SkillLevel): number {
  switch (level) {
    case 'beginner':
      return 25;
    case 'intermediate':
      return 50;
    case 'advanced':
      return 75;
    case 'expert':
      return 95;
  }
}

export function getSkillLevelColor(level: SkillLevel): string {
  switch (level) {
    case 'beginner':
      return '#60a5fa'; // blue
    case 'intermediate':
      return '#34d399'; // green
    case 'advanced':
      return '#f59e0b'; // orange
    case 'expert':
      return '#a855f7'; // purple
  }
}
