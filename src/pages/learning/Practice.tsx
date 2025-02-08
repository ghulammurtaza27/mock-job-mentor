import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Code2,
  Trophy,
  Star,
  Clock,
  ArrowRight
} from 'lucide-react'

interface PracticeProblem {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  xpReward: number
  completed: boolean
  timeEstimate: string
}

const Practice = () => {
  const [problems] = useState<PracticeProblem[]>([
    {
      id: '1',
      title: 'Two Sum',
      description: 'Find two numbers in an array that add up to a target',
      difficulty: 'easy',
      category: 'Arrays & Hashing',
      xpReward: 50,
      completed: false,
      timeEstimate: '20-30 min'
    },
    {
      id: '2',
      title: 'Valid Parentheses',
      description: 'Check if string has valid parentheses pairs',
      difficulty: 'easy',
      category: 'Stack',
      xpReward: 50,
      completed: false,
      timeEstimate: '15-20 min'
    },
    {
      id: '3',
      title: 'Merge Intervals',
      description: 'Merge overlapping intervals in an array',
      difficulty: 'medium',
      category: 'Arrays & Sorting',
      xpReward: 100,
      completed: false,
      timeEstimate: '30-40 min'
    },
    {
      id: '4',
      title: 'LRU Cache',
      description: 'Implement a Least Recently Used Cache',
      difficulty: 'hard',
      category: 'Design',
      xpReward: 150,
      completed: false,
      timeEstimate: '45-60 min'
    }
  ])

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Practice Problems</h1>
        <p className="text-muted-foreground">
          Improve your coding skills with hands-on practice
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {problems.map(problem => (
          <Card key={problem.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Code2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{problem.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {problem.description}
                  </p>
                </div>
              </div>
              <Badge variant={
                problem.difficulty === 'easy' ? 'success' :
                problem.difficulty === 'medium' ? 'warning' : 'destructive'
              }>
                {problem.difficulty}
              </Badge>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4">
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  {problem.timeEstimate}
                </Badge>
                <Badge variant="secondary">
                  <Star className="h-3 w-3 mr-1" />
                  +{problem.xpReward} XP
                </Badge>
              </div>
              <Button>
                Start Practice
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Practice