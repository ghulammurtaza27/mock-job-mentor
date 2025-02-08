export type NotificationType = 
  | 'ticket_assigned'
  | 'pr_review'
  | 'pr_approved'
  | 'pr_changes'
  | 'mention'
  | 'system'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  link?: string
  read: boolean
  createdAt: string
  metadata?: {
    ticketId?: string
    prId?: string
    userId?: string
  }
} 