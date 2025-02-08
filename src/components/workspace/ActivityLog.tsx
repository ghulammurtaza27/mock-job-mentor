import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import { 
  MessageSquare, 
  GitCommit, 
  ArrowRight, 
  Check, 
  AlertCircle 
} from 'lucide-react'

interface Activity {
  id: string
  type: 'comment' | 'status_change' | 'commit' | 'review' | 'subtask'
  user: {
    id: string
    name: string
    avatar?: string
  }
  timestamp: Date
  content: string
  metadata?: Record<string, any>
}

interface ActivityLogProps {
  ticketId: string
}

const ActivityLog = ({ ticketId }: ActivityLogProps) => {
  const [activities, setActivities] = useState<Activity[]>([])

  const activityIcons = {
    comment: <MessageSquare className="w-4 h-4" />,
    status_change: <ArrowRight className="w-4 h-4" />,
    commit: <GitCommit className="w-4 h-4" />,
    review: <Check className="w-4 h-4" />,
    subtask: <AlertCircle className="w-4 h-4" />
  }

  useEffect(() => {
    const fetchActivities = async () => {
      const { data, error } = await supabase
        .from('activities')
        .select(`
          *,
          users (
            id,
            name,
            avatar_url
          )
        `)
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching activities:', error)
        return
      }

      setActivities(data)
    }

    fetchActivities()

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`ticket-${ticketId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'activities',
        filter: `ticket_id=eq.${ticketId}`
      }, (payload) => {
        setActivities(prev => [payload.new as Activity, ...prev])
      })
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [ticketId])

  return (
    <Card className="p-4">
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={activity.user.avatar} />
                <AvatarFallback>
                  {activity.user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{activity.user.name}</span>
                  <span className="text-muted-foreground text-sm">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </span>
                  {activityIcons[activity.type]}
                </div>
                <p className="text-sm mt-1">{activity.content}</p>
                {activity.metadata && activity.type === 'status_change' && (
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <span>{activity.metadata.from}</span>
                    <ArrowRight className="w-4 h-4" />
                    <span>{activity.metadata.to}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  )
}

export default ActivityLog 