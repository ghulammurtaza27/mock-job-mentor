import { useNavigate } from 'react-router-dom'
import GuidedTask from '@/components/dashboard/GuidedTask'
import { SimplifiedNav } from '@/components/navigation/SimplifiedNav'
import { ProgressBar } from '@/components/progress/ProgressBar'
import { useProgress } from '@/contexts/ProgressContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Boxes,
  Cloud,
  Code2,
  Activity,
  GitBranch,
  ArrowRight,
  Settings,
  ChevronDown,
  ChevronUp,
  Bot
} from 'lucide-react'
import { features, categories } from '@/components/dashboard/AllFeatures'
import { useState } from 'react'

const Dashboard = () => {
  const navigate = useNavigate()
  const { progress } = useProgress()
  const [showHelp, setShowHelp] = useState(false)

  const quickActions = [
    {
      title: "Infrastructure",
      description: "Cloud & DevOps",
      icon: <Cloud className="h-5 w-5" />,
      href: "/infrastructure",
      badge: "3 resources",
      onClick: () => navigate('/infrastructure')
    },
    {
      title: "Monitoring",
      description: "System Health",
      icon: <Activity className="h-5 w-5" />,
      href: "/monitoring",
      badge: "All healthy",
      onClick: () => navigate('/monitoring')
    },
    {
      title: "Deployments",
      description: "Release Status",
      icon: <GitBranch className="h-5 w-5" />,
      href: "/deployments",
      badge: "2 pending",
      onClick: () => navigate('/deployments')
    }
  ]

  const handleViewAllActions = () => {
    navigate('/features', { replace: false })
  }

  const handleCustomizeDashboard = () => {
    navigate('/workspace/advanced-dashboard')
  }

  const handleProgressClick = () => {
    navigate('/career') // Navigate to career/progress page
  }

  const handleStreakClick = () => {
    navigate('/learning') // Navigate to learning page to continue streak
  }

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      {/* Welcome Message */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to Your Workspace</h1>
        <p className="text-muted-foreground">
          Follow the steps below to start working on your assigned project
        </p>
      </div>

      {/* Main Workflow */}
      {Object.entries(categories).map(([category, title]) => (
        <div key={category} className="mb-12">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            {title}
            {category === 'setup' && (
              <Badge variant="default" className="ml-2">Active</Badge>
            )}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features
              .filter(feature => feature.category === category)
              .map(feature => (
                <Card
                  key={feature.title}
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(feature.href)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{feature.title}</h3>
                        {feature.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {feature.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      ))}

      {/* Quick Help */}
      <Card className="p-6 bg-muted/50">
        <div className="flex items-start space-x-4">
          <Bot className="h-6 w-6 text-primary" />
          <div>
            <h3 className="font-medium mb-1">Need Help?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your AI Mentor is available 24/7 to help you with:
            </p>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>• Understanding the codebase</li>
              <li>• Git workflow questions</li>
              <li>• Code implementation guidance</li>
              <li>• Best practices and suggestions</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Dashboard
