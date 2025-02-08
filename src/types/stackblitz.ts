export interface StackBlitzVM {
  getFsSnapshot: () => Promise<Record<string, string>>
  applyFsDiff: (diff: Record<string, string>) => Promise<void>
  setCurrentFile: (path: string) => Promise<void>
  getCurrentFile: () => Promise<string>
}

export interface ReplFile {
  file_path: string
  content: string
}

export interface ProjectConfig {
  title: string
  description: string
  template: string
  files: Record<string, string>
} 