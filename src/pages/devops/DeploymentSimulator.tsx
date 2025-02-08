import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Play,
  Terminal,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Server,
  Database
} from 'lucide-react'

interface Stage {
  id: string
  name: string
  status: 'pending' | 'running' | 'success' | 'failed'
  logs: string[]
  duration?: number
}

interface Pipeline {
  id: string
  name: string
  stages: Stage[]
  environment: 'development' | 'staging' | 'production'
  status: 'pending' | 'running' | 'success' | 'failed'
  startedAt?: string
  completedAt?: string
}

const DeploymentSimulator = () => {
  const [pipeline, setPipeline] = useState<Pipeline>({
    id: '1',
    name: 'Main Deployment Pipeline',
    environment: 'development',
    status: 'pending',
    stages: [
      {
        id: 'build',
        name: 'Build',
        status: 'pending',
        logs: []
      },
      {
        id: 'test',
        name: 'Test',
        status: 'pending',
        logs: []
      },
      {
        id: 'security',
        name: 'Security Scan',
        status: 'pending',
        logs: []
      },
      {
        id: 'deploy',
        name: 'Deploy',
        status: 'pending',
        logs: []
      }
    ]
  })

  const simulateStage = async (stageId: string) => {
    setPipeline(prev => ({
      ...prev,
      stages: prev.stages.map(stage => 
        stage.id === stageId 
          ? { ...stage, status: 'running' }
          : stage
      )
    }))

    // Simulate stage execution
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Random success/failure
    const success = Math.random() > 0.3

    setPipeline(prev => ({
      ...prev,
      stages: prev.stages.map(stage => 
        stage.id === stageId 
          ? { 
              ...stage, 
              status: success ? 'success' : 'failed',
              logs: [
                ...stage.logs,
                success 
                  ? `${stage.name} completed successfully`
                  : `${stage.name} failed: Error in execution`
              ]
            }
          : stage
      )
    }))

    return success
  }

  const runPipeline = async () => {
    setPipeline(prev => ({
      ...prev,
      status: 'running',
      startedAt: new Date().toISOString()
    }))

    for (const stage of pipeline.stages) {
      const success = await simulateStage(stage.id)
      if (!success) {
        setPipeline(prev => ({
          ...prev,
          status: 'failed',
          completedAt: new Date().toISOString()
        }))
        return
      }
    }

    setPipeline(prev => ({
      ...prev,
      status: 'success',
      completedAt: new Date().toISOString()
    }))
  }

  const getStageIcon = (status: Stage['status']) => {
    switch (status) {
      case 'pending':
        return <RefreshCw className="h-5 w-5 text-muted-foreground" />
      case 'running':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Deployment Pipeline</h1>
        <p className="text-muted-foreground">
          Simulate and monitor your deployment process
        </p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold mb-1">{pipeline.name}</h2>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{pipeline.environment}</Badge>
                  <Badge 
                    variant={
                      pipeline.status === 'success' 
                        ? 'success' 
                        : pipeline.status === 'failed'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {pipeline.status}
                  </Badge>
                </div>
              </div>
              <Button 
                onClick={runPipeline}
                disabled={pipeline.status === 'running'}
              >
                <Play className="h-4 w-4 mr-2" />
                Run Pipeline
              </Button>
            </div>

            <div className="space-y-6">
              {pipeline.stages.map((stage, index) => (
                <div key={stage.id} className="relative">
                  {index > 0 && (
                    <div className="absolute top-0 left-6 -mt-6 w-0.5 h-6 bg-border" />
                  )}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      {getStageIcon(stage.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{stage.name}</h3>
                        {stage.duration && (
                          <span className="text-sm text-muted-foreground">
                            {stage.duration}s
                          </span>
                        )}
                      </div>
                      {stage.logs.length > 0 && (
                        <div className="bg-muted p-4 rounded-lg">
                          <pre className="text-sm whitespace-pre-wrap">
                            {stage.logs.join('\n')}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Environment Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Server className="h-4 w-4" />
                  <span>Application Server</span>
                </div>
                <Badge variant="outline">Healthy</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Database className="h-4 w-4" />
                  <span>Database</span>
                </div>
                <Badge variant="outline">Healthy</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-4">Recent Deployments</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">v1.2.3</span>
                <Badge variant="success">Success</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">v1.2.2</span>
                <Badge variant="success">Success</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">v1.2.1</span>
                <Badge variant="destructive">Failed</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DeploymentSimulator 