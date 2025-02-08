import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, ArrowRight, PlayCircle } from 'lucide-react'

const Lesson = () => {
  const { moduleId, lessonId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('content')

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" onClick={() => navigate(`/learning/${moduleId}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Module
        </Button>
        <div className="flex space-x-4">
          <Button variant="outline">
            Previous Lesson
          </Button>
          <Button>
            Next Lesson
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <Card className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="content">Lesson Content</TabsTrigger>
                <TabsTrigger value="exercise">Exercise</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>

              <TabsContent value="content">
                <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                  <PlayCircle className="h-12 w-12 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Introduction to HTML</h2>
                <div className="prose max-w-none">
                  <p>
                    HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser...
                  </p>
                  {/* Add more content */}
                </div>
              </TabsContent>

              <TabsContent value="exercise">
                <div className="prose max-w-none">
                  <h3>Practice Exercise</h3>
                  <p>Create a simple HTML page with the following elements:</p>
                  <ul>
                    <li>A main heading</li>
                    <li>A paragraph of text</li>
                    <li>An image</li>
                    <li>A link to another page</li>
                  </ul>
                  {/* Add code editor component here */}
                </div>
              </TabsContent>

              <TabsContent value="resources">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Additional Resources</h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="#" className="text-primary hover:underline">
                        MDN Web Docs - HTML Basics
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-primary hover:underline">
                        W3Schools HTML Tutorial
                      </a>
                    </li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-2">Your Progress</h3>
            <p className="text-sm text-muted-foreground">
              Complete this lesson to move forward in the module.
            </p>
            <Button className="w-full mt-4">
              Mark as Complete
            </Button>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <p className="text-sm text-muted-foreground">
              Get stuck? Ask for help in our community forum or schedule a mentoring session.
            </p>
            <div className="space-y-2 mt-4">
              <Button variant="outline" className="w-full">
                Visit Forum
              </Button>
              <Button variant="outline" className="w-full">
                Schedule Mentoring
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Lesson 