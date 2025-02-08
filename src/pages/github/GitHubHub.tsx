import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import {
  GitBranch,
  GitPullRequest,
  GitCommit,
  GitMerge,
  AlertCircle,
  CheckCircle2,
  Clock,
  Search
} from 'lucide-react'

interface Repository {
  id: string
  name: string
  description: string
  language: string
  stars: number
  forks: number
  issues: number
  pullRequests: number
  lastUpdated: string
  status: 'passing' | 'failing' | 'pending'
}

interface PullRequest {
  id: string
  title: string
  description: string
  branch: string
  status: 'open' | 'merged' | 'closed'
  reviews: number
  comments: number
  createdAt: string
  author: string
}

const GitHubHub = () => {
  const [repositories] = useState<Repository[]>([
    {
      id: '1',
      name: 'feature-optimization',
      description: 'Database query optimization implementation',
      language: 'TypeScript',
      stars: 0,
      forks: 0,
      issues: 2,
      pullRequests: 1,
      lastUpdated: '2024-02-07T20:00:00Z',
      status: 'pending'
    },
    // Add more repositories
  ])

  const [pullRequests] = useState<PullRequest[]>([
    {
      id: '1',
      title: 'Optimize database queries for better performance',
      description: 'Implemented indexing and query caching',
      branch: 'feature/db-optimization',
      status: 'open',
      reviews: 2,
      comments: 5,
      createdAt: '2024-02-07T20:00:00Z',
      author: 'you'
    },
    // Add more PRs
  ])

  const getStatusBadge = (status: Repository['status']) => {
    const colors = {
      passing: 'bg-green-100 text-green-800',
      failing: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    }

    return (
      <Badge className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">GitHub Projects</h1>
        <p className="text-muted-foreground">
          Manage your repositories and pull requests
        </p>
      </div>

      <Tabs defaultValue="repositories" className="space-y-8">
        <TabsList>
          <TabsTrigger value="repositories">
            <GitBranch className="h-4 w-4 mr-2" />
            Repositories
          </TabsTrigger>
          <TabsTrigger value="pull-requests">
            <GitPullRequest className="h-4 w-4 mr-2" />
            Pull Requests
          </TabsTrigger>
          <TabsTrigger value="actions">
            <GitCommit className="h-4 w-4 mr-2" />
            Actions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="repositories">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search repositories..." 
                  className="pl-10"
                />
              </div>
              <Button>
                <GitBranch className="h-4 w-4 mr-2" />
                New Repository
              </Button>
            </div>

            <div className="grid gap-4">
              {repositories.map((repo) => (
                <Card key={repo.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{repo.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {repo.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <Badge variant="outline">{repo.language}</Badge>
                        <span>⭐ {repo.stars}</span>
                        <span>🔀 {repo.forks}</span>
                        <span>Issues: {repo.issues}</span>
                        <span>PRs: {repo.pullRequests}</span>
                      </div>
                    </div>
                    {getStatusBadge(repo.status)}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Updated {new Date(repo.lastUpdated).toLocaleDateString()}
                    </span>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">
                        <GitPullRequest className="h-4 w-4 mr-2" />
                        Pull Requests
                      </Button>
                      <Button variant="outline" size="sm">
                        <GitCommit className="h-4 w-4 mr-2" />
                        Actions
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pull-requests">
          <div className="space-y-4">
            {pullRequests.map((pr) => (
              <Card key={pr.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      {pr.status === 'open' ? (
                        <GitPullRequest className="h-5 w-5 text-green-500" />
                      ) : pr.status === 'merged' ? (
                        <GitMerge className="h-5 w-5 text-purple-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                      <h3 className="font-semibold">{pr.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {pr.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <Badge variant="outline">{pr.branch}</Badge>
                      <span>Reviews: {pr.reviews}</span>
                      <span>Comments: {pr.comments}</span>
                      <span>By: {pr.author}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Add GitHub Actions content */}
      </Tabs>
    </div>
  )
}

export default GitHubHub 