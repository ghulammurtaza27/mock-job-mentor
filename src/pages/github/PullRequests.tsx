import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  GitPullRequest,
  GitBranch,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Clock,
  ArrowUpRight
} from 'lucide-react'

interface PullRequest {
  id: string
  title: string
  description: string
  status: 'open' | 'merged' | 'closed'
  branch: string
  baseBranch: string
  comments: number
  createdAt: string
  updatedAt: string
  reviewStatus?: 'approved' | 'changes_requested' | 'pending'
}

const pullRequests: PullRequest[] = [
  {
    id: 'PR-456',
    title: 'Add User Authentication',
    description: 'Implements OAuth with Google and GitHub providers',
    status: 'open',
    branch: 'feature/auth',
    baseBranch: 'main',
    comments: 5,
    createdAt: '2024-03-15',
    updatedAt: '2024-03-16',
    reviewStatus: 'changes_requested'
  },
  {
    id: 'PR-457',
    title: 'Fix Mobile Navigation',
    description: 'Resolves issue with menu not closing on route change',
    status: 'open',
    branch: 'fix/mobile-nav',
    baseBranch: 'main',
    comments: 2,
    createdAt: '2024-03-16',
    updatedAt: '2024-03-16',
    reviewStatus: 'pending'
  }
]

const PullRequests = () => {
  const [activePR, setActivePR] = useState<string | null>(null)

  const getStatusBadge = (status: PullRequest['status'], reviewStatus?: PullRequest['reviewStatus']) => {
    if (status === 'merged') {
      return <Badge variant="success">Merged</Badge>
    }
    if (status === 'closed') {
      return <Badge variant="destructive">Closed</Badge>
    }
    if (reviewStatus === 'approved') {
      return <Badge variant="success">Approved</Badge>
    }
    if (reviewStatus === 'changes_requested') {
      return <Badge variant="destructive">Changes Requested</Badge>
    }
    return <Badge variant="secondary">Review Pending</Badge>
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Pull Requests</h1>
        <p className="text-muted-foreground">
          Manage and review your code changes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {pullRequests.map(pr => (
            <Card
              key={pr.id}
              className={`p-6 cursor-pointer hover:shadow-md transition-shadow ${
                activePR === pr.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setActivePR(pr.id)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-mono text-muted-foreground">
                      {pr.id}
                    </span>
                    {getStatusBadge(pr.status, pr.reviewStatus)}
                  </div>
                  <h3 className="font-semibold mb-1">{pr.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {pr.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <GitBranch className="h-4 w-4 mr-1" />
                  {pr.branch} → {pr.baseBranch}
                </div>
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  {pr.comments} comments
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Updated {new Date(pr.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                <GitPullRequest className="h-4 w-4 mr-2" />
                Create New PR
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => window.open('https://github.com')}
              >
                <ArrowUpRight className="h-4 w-4 mr-2" />
                View on GitHub
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">PR Statistics</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Open PRs
                </div>
                <div className="text-2xl font-bold">2</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Average Review Time
                </div>
                <div className="text-2xl font-bold">1.5 days</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default PullRequests 