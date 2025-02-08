import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Code2,
  BookOpen,
  Target,
  HelpCircle,
  ChevronLeft
} from 'lucide-react'

export const SimplifiedNav = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [showHelp, setShowHelp] = useState(false)

  const mainPaths = [
    {
      title: 'Learn',
      icon: <BookOpen className="h-5 w-5" />,
      path: '/learning',
      description: 'Follow guided tutorials and courses',
      helpText: 'Start here to build your skills step by step'
    },
    {
      title: 'Practice',
      icon: <Code2 className="h-5 w-5" />,
      path: '/practice',
      description: 'Solve coding challenges',
      helpText: 'Apply what you\'ve learned with hands-on practice'
    },
    {
      title: 'Build',
      icon: <Target className="h-5 w-5" />,
      path: '/workspace',
      description: 'Work on real projects',
      helpText: 'Create your own projects with guidance'
    }
  ]

  return (
    <div className="p-4">
      {location.pathname !== '/dashboard' && (
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      )}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">What would you like to do?</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowHelp(!showHelp)}
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4">
        {mainPaths.map(path => (
          <Card
            key={path.path}
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(path.path)}
          >
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                {path.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{path.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {path.description}
                </p>
                {showHelp && (
                  <p className="text-sm text-primary mt-2 bg-primary/5 p-2 rounded">
                    💡 {path.helpText}
                  </p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
} 