import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Terminal,
  Server,
  Activity,
  Database,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw
} from 'lucide-react'

interface ServiceHealth {
  name: string
  status: 'healthy' | 'warning' | 'error'
  uptime: number
  latency: number
  cpu: number
  memory: number
}

interface Deployment {
  id: string
  service: string
  version: string
  status: 'pending' | 'in-progress' | 'completed' | 'failed'
  timestamp: string
  logs: string[]
}

const DevOpsHub = () => {
  const [services] = useState<ServiceHealth[]>([
    {
      name: 'API Server',
      status: 'healthy',
      uptime: 99.99,
      latency: 120,
      cpu: 45,
      memory: 60
    },
    {
      name: 'Database',
      status: 'warning',
      uptime: 99.95,
      latency: 200,
      cpu: 75,
      memory: 80
    },
    // Add more services
  ])

  const [deployments] = useState<Deployment[]>([
    {
      id: '1',
      service: 'API Server',
      version: 'v1.2.3',
      status: 'completed',
      timestamp: '2024-02-07T20:00:00Z',
      logs: ['Starting deployment...', 'Running migrations...', 'Deployment successful']
    },
    // Add more deployments
  ])

  const getStatusIcon = (status: ServiceHealth['status']) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">DevOps Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and manage your infrastructure
        </p>
      </div>

      <Tabs defaultValue="monitoring" className="space-y-8">
        <TabsList>
          <TabsTrigger value="monitoring">
            <Activity className="h-4 w-4 mr-2" />
            Monitoring
          </TabsTrigger>
          <TabsTrigger value="deployments">
            <Terminal className="h-4 w-4 mr-2" />
            Deployments
          </TabsTrigger>
          <TabsTrigger value="infrastructure">
            <Server className="h-4 w-4 mr-2" />
            Infrastructure
          </TabsTrigger>
          <TabsTrigger value="database">
            <Database className="h-4 w-4 mr-2" />
            Database
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monitoring">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => (
              <Card key={service.name} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{service.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Uptime: {service.uptime}% | Latency: {service.latency}ms
                    </p>
                  </div>
                  {getStatusIcon(service.status)}
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>CPU Usage</span>
                      <span>{service.cpu}%</span>
                    </div>
                    <Progress value={service.cpu} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Memory Usage</span>
                      <span>{service.memory}%</span>
                    </div>
                    <Progress value={service.memory} />
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="deployments">
          <div className="space-y-4">
            {deployments.map((deployment) => (
              <Card key={deployment.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold">{deployment.service}</h3>
                    <p className="text-sm text-muted-foreground">
                      Version: {deployment.version}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">View Logs</Button>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm">
                    {deployment.logs.join('\n')}
                  </pre>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Add other tab contents */}
      </Tabs>
    </div>
  )
}

export default DevOpsHub 