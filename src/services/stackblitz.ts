import sdk from '@stackblitz/sdk'
import type { StackBlitzVM, ProjectConfig } from '@/types/stackblitz'

export class StackBlitzService {
  private vm: StackBlitzVM | null = null
  private containerId: string

  constructor(containerId: string) {
    this.containerId = containerId
  }

  async initialize(config: ProjectConfig): Promise<StackBlitzVM> {
    try {
      const vm = await sdk.embedProject(this.containerId, {
        ...config,
        template: 'create-react-app'
      }, {
        height: 800,
        showSidebar: true,
        sidebarView: 'project',
        openFile: 'src/App.tsx',
        terminalHeight: 32,
        hideDevTools: false,
        devToolsHeight: 200,
        hideNavigation: false,
        view: 'default'
      })

      this.vm = vm as unknown as StackBlitzVM
      return this.vm
    } catch (error) {
      console.error('Failed to initialize StackBlitz:', error)
      throw new Error('Failed to initialize workspace')
    }
  }

  async getFiles(): Promise<Record<string, string>> {
    if (!this.vm) throw new Error('StackBlitz VM not initialized')
    return this.vm.getFsSnapshot()
  }

  async updateFiles(files: Record<string, string>): Promise<void> {
    if (!this.vm) throw new Error('StackBlitz VM not initialized')
    return this.vm.applyFsDiff(files)
  }

  async getCurrentFile(): Promise<string> {
    if (!this.vm) throw new Error('StackBlitz VM not initialized')
    return this.vm.getCurrentFile()
  }

  destroy(): void {
    this.vm = null
  }
} 