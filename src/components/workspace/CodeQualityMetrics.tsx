import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { CodeQualityService, CodeQualityMetrics } from '@/services/codeQuality'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, BarChart2, GitBranch, Bug } from 'lucide-react'

interface CodeQualityProps {
  ticketId: string
  onAnalyze: () => Promise<void>
}

const CodeQualityMetricsView = ({ ticketId, onAnalyze }: CodeQualityProps) => {
  const [metrics, setMetrics] = useState<CodeQualityMetrics | null>(null)
  const [history, setHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchMetrics = async () => {
      const data = await CodeQualityService.getMetricsHistory(ticketId)
      setHistory(data)
      if (data.length > 0) {
        setMetrics(data[data.length - 1].metrics)
      }
    }

    fetchMetrics()
  }, [ticketId])

  const handleAnalyze = async () => {
    setIsLoading(true)
    try {
      await onAnalyze()
    } finally {
      setIsLoading(false)
    }
  }

  const getRatingColor = (rating: string) => {
    const colors = {
      A: 'bg-green-500',
      B: 'bg-blue-500',
      C: 'bg-yellow-500',
      D: 'bg-orange-500',
      F: 'bg-red-500'
    }
    return colors[rating as keyof typeof colors] || 'bg-gray-500'
  }

  if (!metrics) return null

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Code Quality Metrics</h2>
        <Button 
          onClick={handleAnalyze}
          disabled={isLoading}
        >
          {isLoading ? 'Analyzing...' : 'Analyze Code'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium">Maintainability</h3>
              <p className="text-3xl font-bold">{metrics.maintainability.index}</p>
            </div>
            <Badge className={getRatingColor(metrics.maintainability.rating)}>
              {metrics.maintainability.rating}
            </Badge>
          </div>
          <Progress 
            value={metrics.maintainability.index} 
            className="h-2"
          />
        </Card>

        <Card className="p-4">
          <h3 className="font-medium mb-2">Complexity</h3>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-sm">
                <span>Cyclomatic</span>
                <span>{metrics.complexity.cyclomatic}</span>
              </div>
              <Progress 
                value={Math.min(100, (metrics.complexity.cyclomatic / 20) * 100)} 
                className="h-2"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span>Cognitive</span>
                <span>{metrics.complexity.cognitive}</span>
              </div>
              <Progress 
                value={Math.min(100, (metrics.complexity.cognitive / 15) * 100)} 
                className="h-2"
              />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-medium mb-2">Coverage</h3>
          <div className="space-y-2">
            {Object.entries(metrics.coverage).map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between text-sm">
                  <span className="capitalize">{key}</span>
                  <span>{value}%</span>
                </div>
                <Progress value={value} className="h-2" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-medium mb-2">Issues</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                Errors
              </span>
              <span>{metrics.issues.errors}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-yellow-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                Warnings
              </span>
              <span>{metrics.issues.warnings}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                Info
              </span>
              <span>{metrics.issues.info}</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="font-medium mb-4">Metrics History</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="created_at" 
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="metrics.maintainability.index" 
                stroke="#8884d8" 
                name="Maintainability"
              />
              <Line 
                type="monotone" 
                dataKey="metrics.coverage.lines" 
                stroke="#82ca9d" 
                name="Coverage"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}

export default CodeQualityMetricsView 