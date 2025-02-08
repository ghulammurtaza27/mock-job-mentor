import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Brain,
  MessageSquare,
  Code2,
  BookOpen,
  Target,
  Send,
  Bot
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  type?: 'text' | 'code' | 'suggestion'
}

const AIMentor = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI mentor. I can help you with coding problems, explain concepts, and provide learning suggestions. What would you like to work on?",
      timestamp: new Date().toISOString(),
      type: 'text'
    }
  ])

  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
      type: 'text'
    }])

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I understand you're interested in learning about that. Let me help you break it down and suggest some resources.",
        timestamp: new Date().toISOString(),
        type: 'text'
      }])
    }, 1000)

    setInput('')
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Mentor</h1>
        <p className="text-muted-foreground">
          Get personalized guidance and support in your learning journey
        </p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="font-semibold mb-4">Learning Focus</h2>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Code2 className="h-4 w-4 mr-2" />
                Programming Concepts
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Target className="h-4 w-4 mr-2" />
                Project Guidance
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="h-4 w-4 mr-2" />
                Learning Path
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-medium mb-4">Mentor Capabilities</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Brain className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Concept Explanation</p>
                  <p className="text-sm text-muted-foreground">
                    Clear explanations of complex topics
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Code2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Code Review</p>
                  <p className="text-sm text-muted-foreground">
                    Get feedback on your code
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Target className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Learning Path</p>
                  <p className="text-sm text-muted-foreground">
                    Personalized learning recommendations
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="col-span-2">
          <Card className="flex flex-col h-[700px]">
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.role === 'assistant' ? '' : 'flex-row-reverse space-x-reverse'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <Avatar>
                      <AvatarFallback>AI</AvatarFallback>
                      <Bot className="h-10 w-10 p-2" />
                    </Avatar>
                  )}
                  <div className={`flex flex-col ${
                    message.role === 'assistant' ? '' : 'items-end'
                  }`}>
                    <div className={`rounded-lg p-4 max-w-[80%] ${
                      message.role === 'assistant' 
                        ? 'bg-muted' 
                        : 'bg-primary text-primary-foreground'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask your mentor anything..."
                  className="flex-1"
                  rows={3}
                />
                <Button 
                  onClick={handleSend}
                  className="self-end"
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AIMentor 