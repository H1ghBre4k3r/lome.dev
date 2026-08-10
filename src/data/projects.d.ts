export interface Project {
  readonly slug: string;
  readonly name: string;
  readonly description: string;
  readonly repository: string;
  readonly language: string;
  readonly archived: boolean;
  readonly tags: readonly string[];
  readonly demo?: string;
}

export const projects: readonly Project[];
