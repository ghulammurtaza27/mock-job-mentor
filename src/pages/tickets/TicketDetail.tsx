import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Ticket,
  Clock,
  MessageSquare,
  GitBranch,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ListChecks
} from 'lucide-react'

interface TicketStep {
  id: string
  title: string
  description: string
  completed: boolean
  order: number
}

interface TicketComment {
  id: string
  author: string
  content: string
  createdAt: string
}

const TicketDetail = () => {
  const { ticketId } = useParams()
  const navigate = useNavigate()
  const [ticket] = useState({
    id: ticketId,
    title: 'Implement User Authentication',
    description: 'Add OAuth integration with Google and GitHub',
    status: 'in_progress',
    priority: 'high',
    assignee: 'John Doe',
    dueDate: '2024-03-25',
    createdAt: '2024-03-19',
    steps: [
      {
        id: '1',
        title: 'Set up OAuth Providers',
        description: 'Configure Google and GitHub OAuth applications',
        completed: true,
        order: 1
      },
      {
        id: '2',
        title: 'Implement Auth Context',
        description: 'Create AuthContext and provider with necessary methods',
        completed: false,
        order: 2
      },
      {
        id: '3',
        title: 'Add Protected Routes',
        description: 'Implement route protection and authentication checks',
        completed: false,
        order: 3
      }
    ] as TicketStep[],
    comments: [
      {
        id: '1',
        author: 'Jane Smith',
        content: 'Make sure to follow the security best practices for OAuth implementation',
        createdAt: '2024-03-19T10:00:00Z'
      }
    ] as TicketComment[]
  })

  const progress = (ticket.steps.filter(step => step.completed).length / ticket.steps.length) * 100

  return (
    <div className="container mx-auto py-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/tickets')}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Tickets
      </Button>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{ticket.id}</Badge>
                  <Badge 
                    variant={ticket.priority === 'high' ? 'destructive' : 'default'}
                  >
                    {ticket.priority}
                  </Badge>
                </div>
                <h1 className="text-2xl font-bold mb-2">{ticket.title}</h1>
                <p className="text-muted-foreground">{ticket.description}</p>
              </div>
              <Badge variant="secondary">{ticket.status}</Badge>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{progress.toFixed(0)}%</span>
              </div>
              <Progress value={progress} />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
              <div>
                <span className="text-muted-foreground">Assignee</span>
                <p className="font-medium">{ticket.assignee}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Due Date</span>
                <p className="font-medium">{new Date(ticket.dueDate).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Created</span>
                <p className="font-medium">{new Date(ticket.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ListChecks className="h-5 w-5" />
              Implementation Steps
            </h2>
            <div className="space-y-4">
              {ticket.steps.map((step) => (
                <div 
                  key={step.id}
                  className="flex items-start gap-4 p-4 rounded-lg bg-muted/50"
                >
                  <div className="flex-shrink-0">
                    {step.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Comments
            </h2>
            <div className="space-y-4">
              {ticket.comments.map((comment) => (
                <div key={comment.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{comment.author}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="font-semibold mb-4">Actions</h2>
            <div className="space-y-2">
              <Button className="w-full">
                <GitBranch className="h-4 w-4 mr-2" />
                Create Branch
              </Button>
              <Button variant="outline" className="w-full">
                Start Working
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold mb-4">Related Resources</h2>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                📄 OAuth Implementation Guide
              </Button>
              <Button variant="outline" className="w-full justify-start">
                🔐 Security Best Practices
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default TicketDetail 