import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Ticket,
  Clock,
  MessageSquare,
  GitBranch,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'

interface TicketStatus {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  status: 'todo' | 'in_progress' | 'review' | 'done'
  dueDate: string
  comments: number
  branch?: string
}

const tickets: TicketStatus[] = [
  {
    id: 'PROJ-123',
    title: 'Implement User Authentication',
    description: 'Add OAuth integration with Google and GitHub',
    priority: 'high',
    status: 'todo',
    dueDate: '2024-03-20',
    comments: 3
  },
  {
    id: 'PROJ-124',
    title: 'Fix Navigation Bug',
    description: 'Mobile menu not closing on route change',
    priority: 'medium',
    status: 'in_progress',
    dueDate: '2024-03-18',
    comments: 2,
    branch: 'fix/mobile-nav'
  }
]

const TicketWorkspace = () => {
  const [activeTicket, setActiveTicket] = useState<string | null>(null)

  const getPriorityColor = (priority: TicketStatus['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-green-500'
    }
  }

  const getStatusBadge = (status: TicketStatus['status']) => {
    switch (status) {
      case 'todo': return <Badge variant="outline">To Do</Badge>
      case 'in_progress': return <Badge variant="default">In Progress</Badge>
      case 'review': return <Badge variant="secondary">In Review</Badge>
      case 'done': return <Badge variant="success">Done</Badge>
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Tickets</h1>
        <p className="text-muted-foreground">
          View and manage your assigned tasks
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {tickets.map(ticket => (
            <Card
              key={ticket.id}
              className={`p-6 cursor-pointer hover:shadow-md transition-shadow ${
                activeTicket === ticket.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setActiveTicket(ticket.id)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-mono text-muted-foreground">
                      {ticket.id}
                    </span>
                    {getStatusBadge(ticket.status)}
                    <Badge 
                      variant="outline" 
                      className={getPriorityColor(ticket.priority)}
                    >
                      {ticket.priority}
                    </Badge>
                  </div>
                  <h3 className="font-semibold mb-1">{ticket.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {ticket.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {new Date(ticket.dueDate).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  {ticket.comments} comments
                </div>
                {ticket.branch && (
                  <div className="flex items-center">
                    <GitBranch className="h-4 w-4 mr-1" />
                    {ticket.branch}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Start New Ticket
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <AlertCircle className="h-4 w-4 mr-2" />
                Report Issue
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Statistics</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Completed This Week
                </div>
                <div className="text-2xl font-bold">3/5</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Average Completion Time
                </div>
                <div className="text-2xl font-bold">2.3 days</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default TicketWorkspace 