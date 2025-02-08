import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Terminal,
  GitBranch,
  CheckCircle2,
  ExternalLink,
  Copy,
  ChevronRight
} from 'lucide-react'

const steps = [
  {
    id: 1,
    title: 'Clone Repository',
    description: 'Clone the project repository to your local machine',
    command: 'git clone https://github.com/your-org/project-name.git',
    completed: false
  },
  {
    id: 2,
    title: 'Install Dependencies',
    description: 'Install required project dependencies',
    command: 'npm install',
    completed: false
  },
  {
    id: 3,
    title: 'Configure Environment',
    description: 'Set up your local environment variables',
    command: 'cp .env.example .env',
    completed: false
  },
  {
    id: 4,
    title: 'Start Development Server',
    description: 'Run the project locally',
    command: 'npm run dev',
    completed: false
  }
]

const ProjectSetup = () => {
  const [activeStep, setActiveStep] = useState(1)
  const progress = (activeStep - 1) / steps.length * 100

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Project Setup</h1>
        <p className="text-muted-foreground">
          Follow these steps to set up your development environment
        </p>
      </div>

      <div className="space-y-6">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Terminal className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Setup Progress</h2>
            </div>
            <Progress value={progress} className="w-1/3" />
          </div>
        </Card>

        {steps.map((step) => (
          <Card 
            key={step.id}
            className={`p-6 ${activeStep === step.id ? 'ring-2 ring-primary' : ''}`}
          >
            <div className="flex items-start space-x-4">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                step.id < activeStep ? 'bg-primary text-primary-foreground' : 
                step.id === activeStep ? 'bg-primary/10 text-primary' : 
                'bg-muted text-muted-foreground'
              }`}>
                {step.id < activeStep ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <span>{step.id}</span>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{step.title}</h3>
                  {step.id === activeStep && (
                    <Badge>Current Step</Badge>
                  )}
                </div>
                <p className="text-muted-foreground mt-1">
                  {step.description}
                </p>

                {step.command && (
                  <div className="mt-4 bg-muted p-3 rounded-lg flex items-center justify-between">
                    <code className="text-sm">{step.command}</code>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(step.command)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {step.id === activeStep && (
                  <div className="mt-4 flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open('https://docs.github.com/en/get-started/quickstart')}
                    >
                      View Docs <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => setActiveStep(prev => Math.min(prev + 1, steps.length))}
                    >
                      Next Step <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ProjectSetup 