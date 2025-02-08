import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  ArrowRight,
  AlertTriangle,
  Bug,
  GitPullRequest,
  Server,
  CheckCircle2,
  Clock
} from 'lucide-react'
import { useProgress } from '@/contexts/ProgressContext'

interface Task {
  id: string
  type: 'ticket' | 'bug' | 'infra' | 'review'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in_progress'
  dueDate?: string
  xpReward: number
}

const NextSteps = () => {
  const { progress } = useProgress()
  const [priorityTask, setPriorityTask] = useState<Task | null>(null)

  useEffect(() => {
    // In a real app, fetch from API
    setPriorityTask({
      id: '1',
      type: 'ticket',
      title: 'Implement User Authentication',
      description: 'Add OAuth integration for social login',
      priority: 'high',
      status: 'pending',
      dueDate: new Date(Date.now() + 86400000).toISOString(),
      xpReward: 100
    })
  }, [])

  const getTaskIcon = (type: Task['type']) => {
    switch (type) {
      case 'ticket':
        return <GitPullRequest className="h-5 w-5" />
      case 'bug':
        return <Bug className="h-5 w-5" />
      case 'infra':
        return <Server className="h-5 w-5" />
      case 'review':
        return <CheckCircle2 className="h-5 w-5" />
    }
  }

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-500'
      case 'medium':
        return 'text-yellow-500'
      case 'low':
        return 'text-green-500'
    }
  }

  if (!priorityTask) return null

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Next Step</h2>
        <Badge variant="outline">
          <Clock className="h-4 w-4 mr-1" />
          {new Date(priorityTask.dueDate!).toLocaleDateString()}
        </Badge>
      </div>

      <div className="space-y-6">
        <div className="flex items-start space-x-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            {getTaskIcon(priorityTask.type)}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold">{priorityTask.title}</h3>
              <Badge className={getPriorityColor(priorityTask.priority)}>
                {priorityTask.priority}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {priorityTask.description}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Daily Progress</span>
            <span className="font-medium">{progress?.completedTasks || 0} / 5 tasks</span>
          </div>
          <Progress value={((progress?.completedTasks || 0) / 5) * 100} />
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="secondary">
            +{priorityTask.xpReward} XP
          </Badge>
          <Button>
            Start Task
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default NextSteps 