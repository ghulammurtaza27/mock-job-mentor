import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  CheckCircle2,
  ChevronRight,
  HelpCircle
} from 'lucide-react'

interface Step {
  id: string
  title: string
  description: string
  completed: boolean
  helpText?: string
}

const GuidedTask = () => {
  const [showHelp, setShowHelp] = useState(false)
  const [currentTask] = useState<{
    title: string
    description: string
    steps: Step[]
  }>({
    title: "Set Up Your Development Environment",
    description: "Let's get your workspace ready for coding",
    steps: [
      {
        id: '1',
        title: 'Open Workspace',
        description: 'Go to your personal development workspace',
        completed: false,
        helpText: 'Click on "Workspace" in the sidebar to access your coding environment'
      },
      {
        id: '2',
        title: 'Choose a Project',
        description: 'Select a starter project that interests you',
        completed: false,
        helpText: 'Browse through available projects and pick one that matches your skill level'
      },
      {
        id: '3',
        title: 'Run the Project',
        description: 'Start the development server',
        completed: false,
        helpText: 'Click the "Run" button to start your project locally'
      }
    ]
  })

  const progress = (currentTask.steps.filter(s => s.completed).length / currentTask.steps.length) * 100

  return (
    <Card className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">{currentTask.title}</h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowHelp(!showHelp)}
          >
            <HelpCircle className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-muted-foreground">{currentTask.description}</p>
        <Progress value={progress} className="mt-4" />
      </div>

      <div className="space-y-4">
        {currentTask.steps.map((step, index) => (
          <div 
            key={step.id}
            className={`p-4 rounded-lg border ${
              step.completed ? 'bg-primary/5 border-primary/20' : 'bg-card border-border'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                step.completed ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
              }`}>
                {step.completed ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
                {showHelp && step.helpText && (
                  <p className="text-sm text-primary mt-2 bg-primary/5 p-2 rounded">
                    💡 {step.helpText}
                  </p>
                )}
              </div>
              <Button variant="ghost" size="sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default GuidedTask