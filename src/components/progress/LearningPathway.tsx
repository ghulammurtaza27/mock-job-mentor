import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Lock, ArrowRight } from 'lucide-react'
import type { LearningPath, LearningStep } from '@/types/gamification'

interface LearningPathwayProps {
  path: LearningPath
  currentStep?: string
  onStepSelect: (stepId: string) => void
}

export const LearningPathway = ({ path, currentStep, onStepSelect }: LearningPathwayProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{path.title}</h2>
          <p className="text-muted-foreground">{path.description}</p>
        </div>
        <Badge variant="secondary">
          {path.steps.filter(step => step.status === 'completed').length} / {path.steps.length} Steps
        </Badge>
      </div>

      <div className="relative">
        {/* Progress line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-muted" />

        {/* Steps */}
        <div className="space-y-4">
          {path.steps.map((step, index) => (
            <Card 
              key={step.id}
              className={`p-4 ml-12 relative ${
                currentStep === step.id ? 'ring-2 ring-primary' : ''
              }`}
            >
              {/* Step indicator */}
              <div className={`absolute -left-12 w-8 h-8 rounded-full flex items-center justify-center ${
                step.status === 'completed' ? 'bg-green-500' :
                step.status === 'locked' ? 'bg-muted' : 'bg-primary'
              }`}>
                {step.status === 'completed' ? (
                  <CheckCircle2 className="h-5 w-5 text-white" />
                ) : step.status === 'locked' ? (
                  <Lock className="h-4 w-4" />
                ) : (
                  <span className="text-white font-medium">{index + 1}</span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="outline">{step.duration}</Badge>
                  <Badge variant="secondary">+{step.xpReward} XP</Badge>
                  {step.status !== 'locked' && (
                    <Button 
                      size="sm"
                      onClick={() => onStepSelect(step.id)}
                      disabled={step.status === 'locked'}
                    >
                      {step.status === 'completed' ? 'Review' : 'Continue'}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 