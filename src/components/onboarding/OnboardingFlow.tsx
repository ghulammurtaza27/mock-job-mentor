import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  BookOpen,
  Code2,
  Target,
  Rocket,
  ArrowRight,
  ArrowLeft
} from 'lucide-react'

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  action?: {
    label: string
    href: string
  }
}

const steps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Mock Job Mentor',
    description: 'Your journey to becoming a better developer starts here. We\'ll guide you through everything you need to know.',
    icon: <Rocket className="h-6 w-6" />
  },
  {
    id: 'learning',
    title: 'Personalized Learning Path',
    description: 'Follow structured learning paths tailored to your goals. Complete lessons, earn XP, and level up your skills.',
    icon: <BookOpen className="h-6 w-6" />,
    action: {
      label: 'View Learning Paths',
      href: '/learning'
    }
  },
  {
    id: 'practice',
    title: 'Real-World Practice',
    description: 'Work on realistic projects, get AI code reviews, and build a professional portfolio.',
    icon: <Code2 className="h-6 w-6" />,
    action: {
      label: 'Start Coding',
      href: '/workspace'
    }
  },
  {
    id: 'goals',
    title: 'Set Your Goals',
    description: 'Track your progress, earn achievements, and reach your career objectives.',
    icon: <Target className="h-6 w-6" />,
    action: {
      label: 'Set Goals',
      href: '/career'
    }
  }
]

export const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-full max-w-2xl p-6">
        <div className="mb-8">
          <Progress 
            value={(currentStep / (steps.length - 1)) * 100} 
            className="h-1"
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                {steps[currentStep].icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{steps[currentStep].title}</h2>
                <p className="text-muted-foreground">
                  {steps[currentStep].description}
                </p>
              </div>
            </div>

            {steps[currentStep].action && (
              <Button 
                variant="secondary"
                className="w-full"
                onClick={() => window.location.href = steps[currentStep].action!.href}
              >
                {steps[currentStep].action.label}
              </Button>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  )
} 