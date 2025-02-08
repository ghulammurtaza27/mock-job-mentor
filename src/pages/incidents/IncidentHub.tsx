import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertTriangle,
  Bell,
  Clock,
  Terminal,
  CheckCircle2,
  XCircle,
  AlertOctagon
} from 'lucide-react'

interface Incident {
  id: string
  title: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  status: 'active' | 'investigating' | 'resolved'
  timestamp: string
  description: string
  affectedServices: string[]
  logs: string[]
}

const IncidentHub = () => {
  const [incidents] = useState<Incident[]>([
    {
      id: '1',
      title: 'Database Connection Timeout',
      severity: 'high',
      status: 'active',
      timestamp: '2024-02-07T20:00:00Z',
      description: 'Multiple users reporting slow response times and connection failures',
      affectedServices: ['API Server', 'Database'],
      logs: [
        '20:00:00 - Alert triggered: High latency detected',
        '20:01:00 - Database connections exceeding threshold',
        '20:02:00 - Initiating investigation'
      ]
    },
    // Add more incidents
  ])

  const getSeverityBadge = (severity: Incident['severity']) => {
    const colors = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    }

    return (
      <Badge className={colors[severity]}>
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </Badge>
    )
  }

  const getStatusIcon = (status: Incident['status']) => {
    switch (status) {
      case 'active':
        return <AlertOctagon className="h-5 w-5 text-red-500" />
      case 'investigating':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'resolved':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Incident Response</h1>
        <p className="text-muted-foreground">
          Monitor and respond to production incidents
        </p>
      </div>

      <Tabs defaultValue="active" className="space-y-8">
        <TabsList>
          <TabsTrigger value="active">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Active Incidents
          </TabsTrigger>
          <TabsTrigger value="alerts">
            <Bell className="h-4 w-4 mr-2" />
            Alert Rules
          </TabsTrigger>
          <TabsTrigger value="runbooks">
            <Terminal className="h-4 w-4 mr-2" />
            Runbooks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="space-y-4">
            {incidents.map((incident) => (
              <Card key={incident.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      {getStatusIcon(incident.status)}
                      <h3 className="font-semibold text-lg">{incident.title}</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getSeverityBadge(incident.severity)}
                      <span className="text-sm text-muted-foreground">
                        {new Date(incident.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Take Action
                  </Button>
                </div>

                <p className="text-sm mb-4">{incident.description}</p>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Affected Services</h4>
                    <div className="flex gap-2">
                      {incident.affectedServices.map((service) => (
                        <Badge key={service} variant="outline">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Incident Logs</h4>
                    <div className="bg-muted p-4 rounded-lg">
                      <pre className="text-sm whitespace-pre-wrap">
                        {incident.logs.join('\n')}
                      </pre>
                    </div>
                  </div>
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

export default IncidentHub 