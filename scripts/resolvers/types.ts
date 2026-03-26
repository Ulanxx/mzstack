export type Host = 'claude' | 'codex';

export interface HostPaths {
  skillRoot: string;
  localSkillRoot: string;
  binDir: string;
  browseDir: string;
}

export const HOST_PATHS: Record<Host, HostPaths> = {
  claude: {
    skillRoot: '~/.claude/skills/mzstack',
    localSkillRoot: '.claude/skills/mzstack',
    binDir: '~/.claude/skills/mzstack/bin',
    browseDir: '~/.claude/skills/mzstack/browse/dist',
  },
  codex: {
    skillRoot: '$GSTACK_ROOT',
    localSkillRoot: '.agents/skills/mzstack',
    binDir: '$GSTACK_BIN',
    browseDir: '$GSTACK_BROWSE',
  },
};

export interface TemplateContext {
  skillName: string;
  tmplPath: string;
  benefitsFrom?: string[];
  host: Host;
  paths: HostPaths;
  preambleTier?: number;  // 1-4, controls which preamble sections are included
}
