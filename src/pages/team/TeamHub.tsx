import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Users,
  MessageSquare,
  Calendar,
  GitPullRequest,
  Bot
} from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  role: string
  avatar?: string
  isAI: boolean
  status: 'online' | 'busy' | 'offline'
}

interface Message {
  id: string
  senderId: string
  content: string
  timestamp: string
  type: 'chat' | 'code-review' | 'system'
}

const TeamHub = () => {
  const [teamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'AI Senior Dev',
      role: 'Senior Developer',
      isAI: true,
      status: 'online'
    },
    {
      id: '2',
      name: 'AI Product Manager',
      role: 'Product Manager',
      isAI: true,
      status: 'online'
    },
    // Add more team members
  ])

  const [messages] = useState<Message[]>([
    {
      id: '1',
      senderId: '1',
      content: "I've reviewed your code. Let's discuss the database optimization approach.",
      timestamp: '2024-02-07T20:00:00Z',
      type: 'chat'
    },
    // Add more messages
  ])

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Team Collaboration</h1>
        <p className="text-muted-foreground">
          Work with your AI team members on projects
        </p>
      </div>

      <div className="grid grid-cols-4 gap-8">
        <div className="col-span-1">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Team Members</h3>
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>
                      {member.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium">{member.name}</span>
                      {member.isAI && (
                        <Bot className="h-4 w-4 ml-1 text-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {member.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="col-span-3">
          <Tabs defaultValue="chat">
            <TabsList>
              <TabsTrigger value="chat">
                <MessageSquare className="h-4 w-4 mr-2" />
                Team Chat
              </TabsTrigger>
              <TabsTrigger value="reviews">
                <GitPullRequest className="h-4 w-4 mr-2" />
                Code Reviews
              </TabsTrigger>
              <TabsTrigger value="meetings">
                <Calendar className="h-4 w-4 mr-2" />
                Meetings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat">
              <Card className="p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="flex space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          {teamMembers.find(m => m.id === message.senderId)?.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">
                            {teamMembers.find(m => m.id === message.senderId)?.name}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="mt-1">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Add other tab contents */}
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default TeamHub 