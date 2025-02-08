import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import StackBlitzEditor from '@/components/workspace/StackBlitzEditor'
import {
  Brain,
  MessageSquare,
  Code2,
  Timer,
  CheckCircle2,
  XCircle,
  Lightbulb,
  RefreshCw
} from 'lucide-react'

interface InterviewQuestion {
  id: string
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: 'algorithms' | 'system-design' | 'behavioral'
  description: string
  hints: string[]
  starterCode?: string
  solution?: string
  timeLimit?: number
}

const InterviewPrep = () => {
  const [activeQuestion] = useState<InterviewQuestion>({
    id: '1',
    title: 'Two Sum',
    difficulty: 'easy',
    category: 'algorithms',
    description: `
      Given an array of integers nums and an integer target, return indices of the two numbers in nums such that they add up to target.
      You may assume that each input would have exactly one solution, and you may not use the same element twice.
    `,
    hints: [
      'Consider using a hash map to store numbers you\'ve seen',
      'For each number, check if its complement (target - num) exists in the map'
    ],
    starterCode: `function twoSum(nums: number[], target: number): number[] {
  // Your code here
}

// Test cases
console.log(twoSum([2, 7, 11, 15], 9)) // Expected: [0, 1]
console.log(twoSum([3, 2, 4], 6))      // Expected: [1, 2]
`,
    timeLimit: 20
  })

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Interview Practice</h1>
        <p className="text-muted-foreground">
          Practice technical interviews with AI feedback
        </p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{activeQuestion.title}</h2>
              <Badge variant={
                activeQuestion.difficulty === 'easy' ? 'success' :
                activeQuestion.difficulty === 'medium' ? 'warning' : 'destructive'
              }>
                {activeQuestion.difficulty}
              </Badge>
            </div>
            
            <p className="whitespace-pre-wrap mb-4">
              {activeQuestion.description}
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Hints:</h3>
                <div className="space-y-2">
                  {activeQuestion.hints.map((hint, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <p className="text-sm text-muted-foreground">{hint}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-medium mb-4">Interview Tips</h3>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                • Think out loud and explain your thought process
              </p>
              <p className="text-sm text-muted-foreground">
                • Start with a brute force solution, then optimize
              </p>
              <p className="text-sm text-muted-foreground">
                • Consider edge cases and test your solution
              </p>
              <p className="text-sm text-muted-foreground">
                • Ask clarifying questions when needed
              </p>
            </div>
          </Card>
        </div>

        <div className="col-span-2">
          <Card className="p-6">
            <Tabs defaultValue="code">
              <TabsList className="mb-4">
                <TabsTrigger value="code">
                  <Code2 className="h-4 w-4 mr-2" />
                  Code
                </TabsTrigger>
                <TabsTrigger value="feedback">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  AI Feedback
                </TabsTrigger>
              </TabsList>

              <TabsContent value="code">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Timer className="h-4 w-4" />
                      <span className="text-sm">Time Remaining: 20:00</span>
                    </div>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                      <Button size="sm">
                        Submit Solution
                      </Button>
                    </div>
                  </div>

                  <StackBlitzEditor
                    project={{
                      title: 'Interview Question',
                      description: 'Coding interview practice',
                      files: {
                        'src/solution.ts': `// Two Sum Problem

function twoSum(nums: number[], target: number): number[] {
  // Your solution here
  return [];
}

// Test cases
console.log(twoSum([2, 7, 11, 15], 9)); // Expected: [0, 1]
console.log(twoSum([3, 2, 4], 6));      // Expected: [1, 2]
`
                      }
                    }}
                    height="600px"
                  />
                </div>
              </TabsContent>

              <TabsContent value="feedback">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-green-500">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-medium">Time Complexity: O(n)</span>
                  </div>
                  <div className="flex items-center space-x-2 text-green-500">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-medium">Space Complexity: O(n)</span>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">AI Feedback:</h4>
                    <p className="text-sm text-muted-foreground">
                      Your solution effectively uses a hash map to achieve O(n) time complexity.
                      Consider adding input validation and error handling.
                      The variable names are clear and the code is well-structured.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default InterviewPrep 