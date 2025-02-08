import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Cloud,
  Server,
  GitBranch,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react'

interface Deployment {
  id: string
  environment: string
  status: 'success' | 'failed' | 'in_progress'
  timestamp: string
  version: string
  commit: string
}

const Deployments = () => {
  const [deployments] = useState<Deployment[]>([
    {
      id: '1',
      environment: 'production',
      status: 'success',
      timestamp: new Date().toISOString(),
      version: 'v1.0.0',
      commit: 'abc123'
    }
  ])

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Deployments</h1>
        <p className="text-muted-foreground">
          Monitor and manage your deployments
        </p>
      </div>

      <div className="space-y-6">
        {deployments.map(deployment => (
          <Card key={deployment.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Server className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">
                    Deployment to {deployment.environment}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Version: {deployment.version}
                  </p>
                </div>
              </div>
              <Badge
                variant={
                  deployment.status === 'success' ? 'success' :
                  deployment.status === 'failed' ? 'destructive' : 'default'
                }
              >
                {deployment.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>{new Date(deployment.timestamp).toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <GitBranch className="h-4 w-4" />
                <span>Commit: {deployment.commit}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Deployments 