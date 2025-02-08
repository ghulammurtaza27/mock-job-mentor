import { useNavigate } from 'react-router-dom'
import { useNotifications } from '@/contexts/NotificationContext'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  GitPullRequest,
  Ticket,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Bell
} from 'lucide-react'
import { NotificationType } from '@/types/notifications'

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'ticket_assigned':
      return <Ticket className="h-4 w-4" />
    case 'pr_review':
    case 'pr_approved':
    case 'pr_changes':
      return <GitPullRequest className="h-4 w-4" />
    case 'mention':
      return <MessageSquare className="h-4 w-4" />
    default:
      return <Bell className="h-4 w-4" />
  }
}

export const NotificationList = () => {
  const navigate = useNavigate()
  const { notifications, markAsRead, markAllAsRead, clearNotification } = useNotifications()

  const handleClick = async (notification: any) => {
    await markAsRead(notification.id)
    if (notification.link) {
      navigate(notification.link)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between p-4 border-b">
        <h4 className="font-semibold">Notifications</h4>
        {notifications.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => markAllAsRead()}
          >
            Mark all as read
          </Button>
        )}
      </div>

      <ScrollArea className="h-[400px]">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
            <Bell className="h-8 w-8 mb-2" />
            <p>No notifications</p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-muted/50 cursor-pointer ${
                  !notification.read ? 'bg-muted/20' : ''
                }`}
                onClick={() => handleClick(notification)}
              >
                <div className="flex items-start space-x-4">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {notification.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      clearNotification(notification.id)
                    }}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
} 