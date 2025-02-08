import { useState } from 'react'
import type { DropResult } from '@hello-pangea/dnd'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, MoreVertical, Clock, AlertCircle } from 'lucide-react'

type TicketStatus = 'todo' | 'in-progress' | 'review' | 'done'
type TicketPriority = 'low' | 'medium' | 'high'

interface Ticket {
  id: string
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  points: number
  assignee?: string
}

interface Column {
  title: string
  tickets: Ticket[]
}

interface Columns {
  [key: string]: Column
}

const SprintPlanning = () => {
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: '1',
      title: 'Implement user authentication',
      description: 'Add login and signup functionality using Supabase Auth',
      status: 'todo',
      priority: 'high',
      points: 5,
    },
    // Add more sample tickets
  ])

  const [newTicket, setNewTicket] = useState<Partial<Ticket>>({
    title: '',
    description: '',
    priority: 'medium',
    points: 3,
    status: 'todo',
  })

  const columns: Columns = {
    todo: {
      title: 'To Do',
      tickets: tickets.filter(t => t.status === 'todo'),
    },
    'in-progress': {
      title: 'In Progress',
      tickets: tickets.filter(t => t.status === 'in-progress'),
    },
    review: {
      title: 'Review',
      tickets: tickets.filter(t => t.status === 'review'),
    },
    done: {
      title: 'Done',
      tickets: tickets.filter(t => t.status === 'done'),
    },
  }

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result

    // Dropped outside the list
    if (!destination) return

    // Find the ticket that was dragged
    const ticket = tickets.find(t => t.id === result.draggableId)
    if (!ticket) return

    // Update the ticket's status
    const newStatus = destination.droppableId as TicketStatus
    
    setTickets(prevTickets => 
      prevTickets.map(t => 
        t.id === ticket.id 
          ? { ...t, status: newStatus }
          : t
      )
    )
  }

  const addNewTicket = () => {
    if (!newTicket.title) return

    setTickets(prev => [
      ...prev,
      {
        ...newTicket,
        id: crypto.randomUUID(),
        status: 'todo',
      } as Ticket,
    ])

    setNewTicket({
      title: '',
      description: '',
      priority: 'medium',
      points: 3,
      status: 'todo',
    })
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Sprint Planning</h1>
          <p className="text-muted-foreground">
            Plan and track your development tasks for the current sprint
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Ticket
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Ticket</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="Ticket title"
                  value={newTicket.title}
                  onChange={e => setNewTicket(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div>
                <Textarea
                  placeholder="Description"
                  value={newTicket.description}
                  onChange={e => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Select
                    value={newTicket.priority}
                    onValueChange={value => setNewTicket(prev => ({ ...prev, priority: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="Story Points"
                    value={newTicket.points}
                    onChange={e => setNewTicket(prev => ({ ...prev, points: parseInt(e.target.value) }))}
                  />
                </div>
              </div>
              <Button onClick={addNewTicket} className="w-full">
                Create Ticket
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          {Object.entries(columns).map(([columnId, column]) => (
            <div key={columnId} className="bg-muted rounded-lg p-4">
              <h3 className="font-semibold mb-4">{column.title}</h3>
              <Droppable droppableId={columnId}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {column.tickets.map((ticket, index) => (
                      <Draggable
                        key={ticket.id}
                        draggableId={ticket.id}
                        index={index}
                      >
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="p-4 space-y-2"
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">{ticket.title}</h4>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {ticket.description}
                            </p>
                            <div className="flex items-center gap-2 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                ticket.priority === 'high' 
                                  ? 'bg-red-100 text-red-800'
                                  : ticket.priority === 'medium'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {ticket.priority}
                              </span>
                              <span className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {ticket.points} points
                              </span>
                            </div>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </DragDropContext>
      </div>
    </div>
  )
}

export default SprintPlanning 