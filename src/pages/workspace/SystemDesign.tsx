import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import EnhancedCodeEditor from '@/components/workspace/EnhancedCodeEditor'
import {
  Boxes,
  Database,
  Network,
  Server,
  Settings,
  Users,
  MessageSquare,
  LayoutGrid,
  Code2
} from 'lucide-react'

interface Challenge {
  id: string
  title: string
  description: string
  requirements: string[]
  constraints: string[]
  starterCode: string
  solution?: string
  hints: string[]
  difficulty: 'easy' | 'medium' | 'hard'
}

const SystemDesign = () => {
  const [activeChallenge] = useState<Challenge>({
    id: '1',
    title: 'Design a URL Shortener',
    description: `
      Design a URL shortening service like TinyURL. This service will provide short aliases for long URLs.
      
      Example:
      Long URL: https://www.example.com/very/long/path/to/resource
      Short URL: http://short.url/abc123
    `,
    requirements: [
      'Users should be able to enter a long URL and get a shortened URL',
      'Users should be redirected to the original URL when they access the short URL',
      'Short URLs should be unique and hard to guess',
      'System should be highly available',
      'URL redirection should happen in real-time with minimal latency'
    ],
    constraints: [
      'Maximum URL length is 2048 characters',
      'System should handle high traffic (millions of redirections per day)',
      'Short URLs should expire after a default timespan',
      'System should track basic analytics (clicks, referrers)'
    ],
    starterCode: `// System Design: URL Shortener

// 1. API Design
interface URLShortener {
  // TODO: Define the API methods
}

// 2. Database Schema
interface URLMapping {
  // TODO: Define the database schema
}

// 3. Core Components
class URLShortenerService {
  // TODO: Implement the service
}

// 4. Scalability Considerations
// TODO: Add comments about scaling strategies

// 5. Analytics Tracking
// TODO: Implement analytics tracking
`,
    hints: [
      'Consider using a hash function for generating short URLs',
      'Think about caching strategies for frequently accessed URLs',
      'Consider using a distributed system for better scalability'
    ],
    difficulty: 'medium'
  })

  const [activeTab, setActiveTab] = useState('requirements')

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{activeChallenge.title}</h1>
        <p className="text-muted-foreground">System Design Challenge</p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Challenge Details</h2>
            <p className="whitespace-pre-wrap mb-4">{activeChallenge.description}</p>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Requirements</h3>
                <ul className="list-disc list-inside space-y-1">
                  {activeChallenge.requirements.map((req, index) => (
                    <li key={index} className="text-sm">{req}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">Constraints</h3>
                <ul className="list-disc list-inside space-y-1">
                  {activeChallenge.constraints.map((constraint, index) => (
                    <li key={index} className="text-sm">{constraint}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-medium mb-4">Hints</h3>
            <div className="space-y-2">
              {activeChallenge.hints.map((hint, index) => (
                <p key={index} className="text-sm text-muted-foreground">
                  {index + 1}. {hint}
                </p>
              ))}
            </div>
          </Card>
        </div>

        <div className="col-span-2">
          <Card className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="requirements">
                  <LayoutGrid className="h-4 w-4 mr-2" />
                  Design
                </TabsTrigger>
                <TabsTrigger value="implementation">
                  <Code2 className="h-4 w-4 mr-2" />
                  Implementation
                </TabsTrigger>
                <TabsTrigger value="discussion">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Discussion
                </TabsTrigger>
              </TabsList>

              <TabsContent value="requirements">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">System Components</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Server className="h-4 w-4" />
                          <span className="font-medium">Application Servers</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Handle URL shortening and redirection requests
                        </p>
                      </Card>
                      <Card className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Database className="h-4 w-4" />
                          <span className="font-medium">Database</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Store URL mappings and analytics data
                        </p>
                      </Card>
                      <Card className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Network className="h-4 w-4" />
                          <span className="font-medium">Load Balancer</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Distribute traffic across servers
                        </p>
                      </Card>
                      <Card className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Boxes className="h-4 w-4" />
                          <span className="font-medium">Cache Layer</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Cache frequently accessed URLs
                        </p>
                      </Card>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="implementation">
                <EnhancedCodeEditor
                  language="typescript"
                  initialValue={activeChallenge.starterCode}
                />
              </TabsContent>

              <TabsContent value="discussion">
                <div className="space-y-4">
                  <h3 className="font-medium">Discussion Topics</h3>
                  <ul className="space-y-2">
                    <li className="text-sm">• How would you handle URL collisions?</li>
                    <li className="text-sm">• What's your strategy for data partitioning?</li>
                    <li className="text-sm">• How would you implement analytics tracking?</li>
                    <li className="text-sm">• Discuss caching strategies and their trade-offs</li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default SystemDesign 