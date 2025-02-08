import { useEffect, useRef } from 'react'
import sdk from '@stackblitz/sdk'
import type { Project } from '@stackblitz/sdk'
import { Card } from '@/components/ui/card'

interface StackBlitzEmbedProps {
  projectId?: string
  template?: Project
  height?: string
  onReady?: () => void
}

const StackBlitzEmbed = ({ 
  projectId, 
  template, 
  height = '600px',
  onReady 
}: StackBlitzEmbedProps) => {
  const embedRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!embedRef.current) return

    const initializeProject = async () => {
      try {
        if (projectId) {
          await sdk.embedProjectId(embedRef.current, projectId, {
            height,
            clickToLoad: false,
            terminalHeight: 50,
            showSidebar: true,
          })
        } else if (template) {
          await sdk.embedProject(embedRef.current, template, {
            height,
            clickToLoad: false,
            terminalHeight: 50,
            showSidebar: true,
          })
        }
        onReady?.()
      } catch (error) {
        console.error('StackBlitz embedding error:', error)
      }
    }

    initializeProject()
  }, [projectId, template, height, onReady])

  return (
    <Card className="overflow-hidden">
      <div ref={embedRef} />
    </Card>
  )
}

export default StackBlitzEmbed 