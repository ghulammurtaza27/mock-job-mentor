import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle2, 
  ThumbsUp,
  FileCode,
  GitPullRequest
} from 'lucide-react'
import { CodeReviewService, AutomatedReviewResult, CodeReviewComment } from '@/services/codeReview'

interface CodeReviewPanelProps {
  ticketId: string
  files: Record<string, string>
}

const CodeReviewPanel = ({ ticketId, files }: CodeReviewPanelProps) => {
  const [review, setReview] = useState<AutomatedReviewResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('comments')

  const handleRunReview = async () => {
    setIsLoading(true)
    try {
      const result = await CodeReviewService.runAutomatedReview(ticketId, files)
      setReview(result)
    } catch (error) {
      console.error('Error running review:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getSeverityColor = (severity?: string) => {
    const colors = {
      high: 'bg-red-500',
      medium: 'bg-yellow-500',
      low: 'bg-blue-500'
    }
    return colors[severity as keyof typeof colors] || 'bg-gray-500'
  }

  const getCommentIcon = (type: string) => {
    const icons = {
      suggestion: <MessageSquare className="w-4 h-4" />,
      issue: <AlertTriangle className="w-4 h-4" />,
      praise: <ThumbsUp className="w-4 h-4" />
    }
    return icons[type as keyof typeof icons] || <MessageSquare className="w-4 h-4" />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Code Review</h2>
        <Button 
          onClick={handleRunReview}
          disabled={isLoading}
        >
          {isLoading ? 'Running Review...' : 'Run Automated Review'}
        </Button>
      </div>

      {review && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <h3 className="font-medium mb-2">Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Overall Score</span>
                  <Badge variant="outline">{review.summary.overallScore}%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    Issues
                  </span>
                  <span>{review.summary.issues}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4 text-blue-500" />
                    Suggestions
                  </span>
                  <span>{review.summary.suggestions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4 text-green-500" />
                    Praise
                  </span>
                  <span>{review.summary.praise}</span>
                </div>
              </div>
            </Card>

            <Card className="p-4 md:col-span-2">
              <h3 className="font-medium mb-2">Best Practices</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-green-500 mb-2">Followed</h4>
                  <div className="space-y-1">
                    {review.bestPractices.followed.map((practice, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{practice}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-red-500 mb-2">Violations</h4>
                  <div className="space-y-1">
                    {review.bestPractices.violations.map((violation, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <span className="text-sm">{violation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
              </TabsList>

              <TabsContent value="comments">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {review.comments.map((comment) => (
                      <div 
                        key={comment.id}
                        className="flex items-start gap-3 p-3 rounded-lg bg-muted"
                      >
                        <div className="flex-shrink-0">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={comment.author.avatar} />
                            <AvatarFallback>
                              {comment.author.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{comment.author.name}</span>
                            <Badge className={getSeverityColor(comment.severity)}>
                              {comment.severity}
                            </Badge>
                            {getCommentIcon(comment.type)}
                          </div>
                          <p className="mt-1 text-sm">{comment.content}</p>
                          <div className="mt-2 text-sm text-muted-foreground">
                            <FileCode className="w-4 h-4 inline mr-1" />
                            {comment.filePath}:{comment.lineNumber}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="files">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-2">
                    {Object.keys(files).map((filePath) => (
                      <div 
                        key={filePath}
                        className="flex items-center justify-between p-2 rounded-lg bg-muted"
                      >
                        <span className="flex items-center gap-2">
                          <FileCode className="w-4 h-4" />
                          {filePath}
                        </span>
                        <Badge variant="outline">
                          {review.comments.filter(c => c.filePath === filePath).length} comments
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </Card>
        </>
      )}
    </div>
  )
}

export default CodeReviewPanel 