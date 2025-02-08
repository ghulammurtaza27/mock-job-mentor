import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Bell,
  AlertTriangle,
  Settings,
  Mail,
  MessageSquare,
  Smartphone
} from 'lucide-react'

interface Alert {
  id: string
  name: string
  description: string
  type: 'error' | 'warning' | 'info'
  enabled: boolean
  channels: ('email' | 'sms' | 'slack')[]
}

const Alerts = () => {
  const [alerts] = useState<Alert[]>([
    {
      id: '1',
      name: 'High CPU Usage',
      description: 'Alert when CPU usage exceeds 80% for 5 minutes',
      type: 'warning',
      enabled: true,
      channels: ['email', 'slack']
    },
    {
      id: '2',
      name: 'API Error Rate',
      description: 'Alert when error rate exceeds 5% in last 15 minutes',
      type: 'error',
      enabled: true,
      channels: ['email', 'sms', 'slack']
    }
  ])

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Alert Configuration</h1>
        <p className="text-muted-foreground">
          Manage your monitoring alerts and notifications
        </p>
      </div>

      <div className="space-y-6">
        {alerts.map(alert => (
          <Card key={alert.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  alert.type === 'error' ? 'bg-red-500/10' :
                  alert.type === 'warning' ? 'bg-yellow-500/10' : 'bg-blue-500/10'
                }`}>
                  <AlertTriangle className={`h-5 w-5 ${
                    alert.type === 'error' ? 'text-red-500' :
                    alert.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                  }`} />
                </div>
                <div>
                  <h3 className="font-semibold">{alert.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {alert.description}
                  </p>
                </div>
              </div>
              <Switch checked={alert.enabled} />
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="flex items-center space-x-1">
                <Mail className="h-3 w-3" />
                <span>Email</span>
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-1">
                <Smartphone className="h-3 w-3" />
                <span>SMS</span>
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-1">
                <MessageSquare className="h-3 w-3" />
                <span>Slack</span>
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Alerts 