import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Boxes,
  Cloud,
  Code2,
  GitBranch,
  Terminal,
  Settings,
  RefreshCw
} from 'lucide-react'

interface InfrastructureResource {
  id: string
  name: string
  type: string
  status: string
  region: string
  lastUpdated: string
}

const Infrastructure = () => {
  const [resources] = useState<InfrastructureResource[]>([
    {
      id: '1',
      name: 'prod-cluster',
      type: 'eks',
      status: 'active',
      region: 'us-west-2',
      lastUpdated: new Date().toISOString()
    }
  ])

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Infrastructure</h1>
        <p className="text-muted-foreground">
          Manage your infrastructure as code
        </p>
      </div>

      <Tabs defaultValue="resources">
        <TabsList>
          <TabsTrigger value="resources">
            <Cloud className="h-4 w-4 mr-2" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="terraform">
            <Code2 className="h-4 w-4 mr-2" />
            Terraform
          </TabsTrigger>
          <TabsTrigger value="templates">
            <Boxes className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resources">
          <div className="space-y-6">
            {resources.map(resource => (
              <Card key={resource.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{resource.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Type: {resource.type}
                    </p>
                  </div>
                  <Badge>{resource.status}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Region</span>
                    <p className="font-medium">{resource.region}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Last Updated</span>
                    <p className="font-medium">
                      {new Date(resource.lastUpdated).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Terminal className="h-4 w-4 mr-2" />
                    View State
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                  <Button variant="outline" size="sm">
                    <GitBranch className="h-4 w-4 mr-2" />
                    View Changes
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="terraform">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Terraform Configuration</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code>{`
provider "aws" {
  region = "us-west-2"
}

module "vpc" {
  source = "./modules/vpc"
  # ...
}

module "eks" {
  source = "./modules/eks"
  # ...
}
              `}</code>
            </pre>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-2">EKS Cluster</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Deploy a production-ready Kubernetes cluster
              </p>
              <Button variant="outline" size="sm">
                Use Template
              </Button>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-2">RDS Database</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Deploy a managed PostgreSQL database
              </p>
              <Button variant="outline" size="sm">
                Use Template
              </Button>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Infrastructure 