import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { CollaborationService } from '@/services/collaboration'
import type { User } from '@/types/supabase'

interface CollaboratorsListProps {
  ticketId: string
}

const CollaboratorsList = ({ ticketId }: CollaboratorsListProps) => {
  const [collaborators, setCollaborators] = useState<User[]>([])
  
  useEffect(() => {
    const collaborationService = new CollaborationService(
      ticketId,
      (presences) => {
        const activeUsers = presences.map(p => p.user)
        setCollaborators(activeUsers)
      }
    )

    collaborationService.initialize()
    return () => collaborationService.destroy()
  }, [ticketId])

  return (
    <div className="flex -space-x-2">
      {collaborators.map((user) => (
        <Tooltip key={user.id}>
          <TooltipTrigger>
            <Avatar className="w-8 h-8 border-2 border-background">
              <AvatarImage src={user.avatar_url} />
              <AvatarFallback>
                {user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>
            <p>{user.name}</p>
            {user.current_file && (
              <p className="text-sm text-muted-foreground">
                Working on: {user.current_file}
              </p>
            )}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  )
}

export default CollaboratorsList 