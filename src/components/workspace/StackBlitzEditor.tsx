import { useEffect, useRef } from 'react'
import sdk from '@stackblitz/sdk'
import { Card } from '@/components/ui/card'
import type { Project } from '@stackblitz/sdk'

interface StackBlitzEditorProps {
  project: {
    title: string
    description: string
    files: Record<string, string>
  }
  height?: string
  template?: 'typescript' | 'javascript' | 'node'
  onLoad?: () => void
}

const StackBlitzEditor = ({ 
  project, 
  height = '800px',
  template = 'typescript',
  onLoad 
}: StackBlitzEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mountEditor = async () => {
      if (editorRef.current) {
        try {
          await sdk.embedProject(editorRef.current, {
            title: project.title,
            description: project.description,
            template: 'node',
            files: {
              'index.ts': project.files['src/solution.ts'] || '',
              'package.json': JSON.stringify({
                name: project.title,
                version: '0.0.1',
                description: project.description,
                dependencies: {
                  typescript: "^4.9.0"
                }
              }, null, 2),
              'tsconfig.json': JSON.stringify({
                compilerOptions: {
                  target: "es2017",
                  module: "commonjs",
                  strict: true,
                  esModuleInterop: true,
                  skipLibCheck: true,
                  forceConsistentCasingInFileNames: true
                }
              }, null, 2)
            }
          }, {
            height,
            hideNavigation: false,
            hideDevTools: false,
          })

          onLoad?.()
        } catch (error) {
          console.error('Error mounting StackBlitz editor:', error)
        }
      }
    }

    mountEditor()
  }, [project, height, onLoad])

  return (
    <Card className="overflow-hidden">
      <div 
        ref={editorRef} 
        style={{ height }}
        className="w-full"
      />
    </Card>
  )
}

export default StackBlitzEditor 