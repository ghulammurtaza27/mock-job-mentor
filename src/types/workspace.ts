export interface Ticket {
  id: string
  title: string
  description: string
  status: 'todo' | 'in_progress' | 'review' | 'done'
  priority: 'low' | 'medium' | 'high'
  type: 'bug' | 'feature' | 'improvement'
  assignee?: string
  createdAt: Date
  dueDate?: Date
  points: number
  tags: string[]
  progress: number
  subtasks: SubTask[]
}

export interface SubTask {
  id: string
  title: string
  completed: boolean
}

export interface WorkspaceMetrics {
  completedTickets: number
  totalPoints: number
  completedPoints: number
  avgTimeToComplete: number // in hours
  ticketsByStatus: Record<Ticket['status'], number>
  ticketsByType: Record<Ticket['type'], number>
} 