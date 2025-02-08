import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Ticket,
  Clock,
  MessageSquare,
  ArrowRight
} from 'lucide-react'

interface TicketStatus {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  status: 'todo' | 'in_progress' | 'review' | 'done'
  dueDate: string
  comments: number
}

const TicketList = () => {
  const navigate = useNavigate()
  const [tickets] = useState<TicketStatus[]>([
    {
      id: 'PROJ-123',
      title: 'Implement User Authentication',
      description: 'Add OAuth integration with Google and GitHub',
      priority: 'high',
      status: 'in_progress',
      dueDate: '2024-03-25',
      comments: 3
    },
    // Add more tickets...
  ])

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Tickets</h1>
          <p className="text-muted-foreground">View and manage your assigned tasks</p>
        </div>
        <Button>Create Ticket</Button>
      </div>

      <div className="space-y-4">
        {tickets.map((ticket) => (
          <Card 
            key={ticket.id}
            className="p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/tickets/${ticket.id}`)}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{ticket.id}</Badge>
                  <Badge 
                    variant={ticket.priority === 'high' ? 'destructive' : 'default'}
                  >
                    {ticket.priority}
                  </Badge>
                </div>
                <h2 className="text-xl font-semibold">{ticket.title}</h2>
                <p className="text-muted-foreground">{ticket.description}</p>
              </div>
              <Button variant="ghost" size="icon">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Due {new Date(ticket.dueDate).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                {ticket.comments} comments
              </div>
              <Badge variant="secondary">{ticket.status}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default TicketList 