import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  GitBranch,
  Code2,
  MessagesSquare,
  GitPullRequest,
  Ticket,
  Bot,
  Terminal
} from 'lucide-react'

export interface Feature {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  badge?: string
  category: 'setup' | 'work' | 'review'
}

export const features: Feature[] = [
  // Initial Setup
  {
    title: "Project Setup",
    description: "Clone repository and set up your local environment",
    icon: <Terminal className="h-5 w-5" />,
    href: "/setup",
    category: 'setup',
    badge: "Start Here"
  },
  {
    title: "Git Workflow",
    description: "Learn the git workflow for this project",
    icon: <GitBranch className="h-5 w-5" />,
    href: "/git-workflow",
    category: 'setup'
  },

  // Daily Work
  {
    title: "My Tickets",
    description: "View and work on assigned tasks",
    icon: <Ticket className="h-5 w-5" />,
    href: "/tickets",
    category: 'work',
    badge: "3 Active"
  },
  {
    title: "Code Editor",
    description: "Write and test your code",
    icon: <Code2 className="h-5 w-5" />,
    href: "/editor",
    category: 'work'
  },
  {
    title: "AI Mentor",
    description: "Get help with code or project questions",
    icon: <Bot className="h-5 w-5" />,
    href: "/mentor",
    category: 'work',
    badge: "24/7 Support"
  },

  // Review & Submit
  {
    title: "Pull Requests",
    description: "Create and manage your PRs",
    icon: <GitPullRequest className="h-5 w-5" />,
    href: "/pull-requests",
    category: 'review',
    badge: "2 Pending"
  },
  {
    title: "Code Review",
    description: "Get AI feedback on your code",
    icon: <MessagesSquare className="h-5 w-5" />,
    href: "/code-review",
    category: 'review'
  }
]

export const categories = {
  setup: "1. Get Started",
  work: "2. Daily Work",
  review: "3. Review & Submit"
} 