import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  GitBranch,
  GitCommit,
  GitMerge,
  GitPullRequest,
  Check,
  X
} from 'lucide-react'

interface GitCommand {
  command: string
  description: string
  example?: string
}

interface GitScenario {
  id: string
  title: string
  description: string
  steps: string[]
  commands: GitCommand[]
  solution?: string
}

const GitWorkflow = () => {
  const [activeScenario] = useState<GitScenario>({
    id: '1',
    title: 'Feature Branch Workflow',
    description: 'Practice creating a feature branch, making changes, and submitting a pull request.',
    steps: [
      'Create a new feature branch',
      'Make changes and commit them',
      'Push changes to remote',
      'Create a pull request',
      'Review and merge changes'
    ],
    commands: [
      {
        command: 'git checkout -b feature/new-feature',
        description: 'Create and switch to a new feature branch'
      },
      {
        command: 'git add .',
        description: 'Stage all changes'
      },
      {
        command: 'git commit -m "feat: add new feature"',
        description: 'Commit changes with a descriptive message'
      },
      {
        command: 'git push origin feature/new-feature',
        description: 'Push changes to remote repository'
      }
    ]
  })

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Git Workflow Practice</h1>
        <p className="text-muted-foreground">
          Learn and practice professional Git workflows
        </p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">{activeScenario.title}</h2>
            <p className="text-muted-foreground mb-4">
              {activeScenario.description}
            </p>
            
            <div className="space-y-4">
              <h3 className="font-medium">Steps:</h3>
              <div className="space-y-2">
                {activeScenario.steps.map((step, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                      {index + 1}
                    </div>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-medium mb-4">Common Commands</h3>
            <div className="space-y-4">
              {activeScenario.commands.map((cmd, index) => (
                <div key={index} className="space-y-1">
                  <code className="bg-muted px-2 py-1 rounded text-sm">
                    {cmd.command}
                  </code>
                  <p className="text-sm text-muted-foreground">
                    {cmd.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="col-span-2">
          <Card className="p-6">
            <Tabs defaultValue="practice">
              <TabsList>
                <TabsTrigger value="practice">
                  <GitBranch className="h-4 w-4 mr-2" />
                  Practice
                </TabsTrigger>
                <TabsTrigger value="visualization">
                  <GitCommit className="h-4 w-4 mr-2" />
                  Visualization
                </TabsTrigger>
              </TabsList>

              <TabsContent value="practice">
                {/* Add interactive Git practice component */}
              </TabsContent>

              <TabsContent value="visualization">
                {/* Add Git graph visualization */}
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default GitWorkflow 