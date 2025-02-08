import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Server,
  Activity,
  Terminal,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

interface DeploymentLog {
  id: string
  timestamp: string
  level: 'info' | 'warning' | 'error'
  message: string
}

interface ResourceMetrics {
  cpu: number
  memory: number
  requests: number
  errors: number
}

interface DeploymentMonitorProps {
  projectId: string
  environment: 'development' | 'staging' | 'production'
}

export const DeploymentMonitor = ({ projectId, environment }: DeploymentMonitorProps) => {
  const [metrics, setMetrics] = useState<ResourceMetrics>({
    cpu: 0,
    memory: 0,
    requests: 0,
    errors: 0
  })

  const { data: deploymentLogs, isLoading } = useQuery({
    queryKey: ['deploymentLogs', projectId, environment],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_deployments')
        .select('*')
        .eq('project_id', projectId)
        .eq('environment', environment)
        .order('deployed_at', { ascending: false })
        .limit(1)
        .single()

      if (error) throw error
      return data
    }
  })

  // Simulate real-time metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
        requests: Math.floor(Math.random() * 1000),
        errors: Math.floor(Math.random() * 10)
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getHealthStatus = () => {
    if (metrics.errors > 5) return 'critical'
    if (metrics.errors > 0) return 'warning'
    return 'healthy'
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Deployment Status</h3>
          <p className="text-sm text-muted-foreground">
            Environment: {environment}
          </p>
        </div>
        <Badge
          variant={
            getHealthStatus() === 'healthy' ? 'success' :
            getHealthStatus() === 'warning' ? 'warning' : 'destructive'
          }
        >
          {getHealthStatus()}
        </Badge>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">
            <Activity className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="logs">
            <Terminal className="h-4 w-4 mr-2" />
            Logs
          </TabsTrigger>
          <TabsTrigger value="metrics">
            <Server className="h-4 w-4 mr-2" />
            Metrics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  <span>CPU Usage</span>
                </div>
                <span className="font-medium">{metrics.cpu.toFixed(1)}%</span>
              </div>
              <div className="mt-2 bg-secondary h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full transition-all duration-500"
                  style={{ width: `${metrics.cpu}%` }}
                />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Server className="h-5 w-5 text-purple-500" />
                  <span>Memory Usage</span>
                </div>
                <span className="font-medium">{metrics.memory.toFixed(1)}%</span>
              </div>
              <div className="mt-2 bg-secondary h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-purple-500 h-full transition-all duration-500"
                  style={{ width: `${metrics.memory}%` }}
                />
              </div>
            </Card>
          </div>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Recent Activity</h4>
              <Badge variant="outline">
                <Clock className="h-3 w-3 mr-1" />
                Last 24h
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Requests</span>
                <span className="font-medium">{metrics.requests}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Error Rate</span>
                <span className="font-medium text-red-500">
                  {(metrics.errors / metrics.requests * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card className="p-4 bg-muted">
            <pre className="text-sm font-mono whitespace-pre-wrap">
              {deploymentLogs?.logs || 'No logs available'}
            </pre>
          </Card>
        </TabsContent>

        <TabsContent value="metrics">
          <div className="space-y-4">
            {/* Add detailed metrics charts here */}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
} 