import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DeploymentMonitor } from '@/components/workspace/DeploymentMonitor'
import { DeploymentManager } from '@/components/workspace/DeploymentManager'
import {
  Cloud,
  Server,
  Database,
  Settings,
  Shield
} from 'lucide-react'

const CloudConsole = () => {
  const [activeProject] = useState({
    id: '1',
    name: 'mock-project'
  })

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Cloud Console</h1>
        <p className="text-muted-foreground">
          Manage your cloud resources and deployments
        </p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">
            <Cloud className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="compute">
            <Server className="h-4 w-4 mr-2" />
            Compute
          </TabsTrigger>
          <TabsTrigger value="database">
            <Database className="h-4 w-4 mr-2" />
            Database
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DeploymentMonitor 
              projectId={activeProject.id} 
              environment="production" 
            />
            <DeploymentManager 
              projectId={activeProject.id}
              repoName={activeProject.name}
            />
          </div>
        </TabsContent>

        {/* Add other tab contents */}
      </Tabs>
    </div>
  )
}

export default CloudConsole 