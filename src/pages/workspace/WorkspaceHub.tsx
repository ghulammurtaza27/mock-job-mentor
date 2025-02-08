import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import StackBlitzEmbed from '@/components/workspace/StackBlitzEmbed'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Code2, 
  GitPullRequest, 
  Terminal, 
  Users,
  AlertTriangle,
  BarChart 
} from 'lucide-react'

const WorkspaceHub = () => {
  const [activeTab, setActiveTab] = useState('development')

  return (
    <div className="container mx-auto py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="development">
              <Code2 className="mr-2 h-4 w-4" />
              Development
            </TabsTrigger>
            <TabsTrigger value="devops">
              <Terminal className="mr-2 h-4 w-4" />
              DevOps
            </TabsTrigger>
            <TabsTrigger value="team">
              <Users className="mr-2 h-4 w-4" />
              Team
            </TabsTrigger>
            <TabsTrigger value="incidents">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Incidents
            </TabsTrigger>
            <TabsTrigger value="progress">
              <BarChart className="mr-2 h-4 w-4" />
              Progress
            </TabsTrigger>
          </TabsList>

          <Button>
            <GitPullRequest className="mr-2 h-4 w-4" />
            Create PR
          </Button>
        </div>

        <TabsContent value="development" className="space-y-4">
          <div className="grid grid-cols-3 gap-8">
            <div className="space-y-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Current Task</h3>
                {/* Task details */}
              </Card>
              <Card className="p-4">
                <h3 className="font-semibold mb-2">AI Review Feedback</h3>
                {/* AI feedback */}
              </Card>
            </div>

            <div className="col-span-2">
              <StackBlitzEmbed 
                template={{
                  title: 'Current Task',
                  description: 'Working on feature implementation',
                  template: 'node',
                  files: {
                    'index.js': 'console.log("Hello World")',
                  },
                }}
              />
            </div>
          </div>
        </TabsContent>

        {/* Add other tab contents */}
      </Tabs>
    </div>
  )
}

export default WorkspaceHub 