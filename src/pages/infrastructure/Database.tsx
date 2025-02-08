import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Database as DatabaseIcon,
  HardDrive,
  Settings,
  Activity,
  Lock,
  Users,
  BarChart
} from 'lucide-react'

interface DatabaseInstance {
  id: string
  name: string
  type: 'postgres' | 'mysql'
  status: 'running' | 'stopped' | 'maintenance'
  size: string
  version: string
  usage: {
    storage: number
    connections: number
    cpu: number
  }
}

const Database = () => {
  const [databases] = useState<DatabaseInstance[]>([
    {
      id: '1',
      name: 'main-db',
      type: 'postgres',
      status: 'running',
      size: 'db.t3.micro',
      version: '13.7',
      usage: {
        storage: 65,
        connections: 42,
        cpu: 28
      }
    }
  ])

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Database Management</h1>
        <p className="text-muted-foreground">
          Manage your database instances and configurations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {databases.map(db => (
          <Card key={db.id} className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <DatabaseIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{db.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {db.type} {db.version}
                  </p>
                </div>
              </div>
              <Badge
                variant={
                  db.status === 'running' ? 'success' :
                  db.status === 'maintenance' ? 'warning' : 'destructive'
                }
              >
                {db.status}
              </Badge>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Storage Usage</span>
                  <span className="text-sm font-medium">{db.usage.storage}%</span>
                </div>
                <Progress value={db.usage.storage} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">Active Connections</span>
                  </div>
                  <p className="text-2xl font-semibold">{db.usage.connections}</p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity className="h-4 w-4" />
                    <span className="text-sm">CPU Usage</span>
                  </div>
                  <p className="text-2xl font-semibold">{db.usage.cpu}%</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
                <Button variant="outline" size="sm">
                  <BarChart className="h-4 w-4 mr-2" />
                  Metrics
                </Button>
                <Button variant="outline" size="sm">
                  <Lock className="h-4 w-4 mr-2" />
                  Security
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Database 