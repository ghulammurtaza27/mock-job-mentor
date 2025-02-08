import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  Clock,
  BarChart2 
} from 'lucide-react'
import type { TestResult } from '@/services/testing'

interface TestResultsProps {
  ticketId: string
  onRunTests: () => Promise<void>
}

const TestResults = ({ ticketId, onRunTests }: TestResultsProps) => {
  const [results, setResults] = useState<TestResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const statusIcons = {
    passed: <CheckCircle2 className="w-4 h-4 text-green-500" />,
    failed: <XCircle className="w-4 h-4 text-red-500" />,
    skipped: <AlertCircle className="w-4 h-4 text-yellow-500" />
  }

  const handleRunTests = async () => {
    setIsLoading(true)
    try {
      await onRunTests()
    } finally {
      setIsLoading(false)
    }
  }

  const calculateStats = () => {
    const total = results.length
    const passed = results.filter(r => r.status === 'passed').length
    const failed = results.filter(r => r.status === 'failed').length
    const skipped = results.filter(r => r.status === 'skipped').length
    const passRate = total ? Math.round((passed / total) * 100) : 0

    return { total, passed, failed, skipped, passRate }
  }

  const stats = calculateStats()

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Test Results</h3>
        <Button 
          onClick={handleRunTests}
          disabled={isLoading}
        >
          {isLoading ? 'Running Tests...' : 'Run Tests'}
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total Tests</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-500">{stats.passed}</div>
          <div className="text-sm text-muted-foreground">Passed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-500">{stats.failed}</div>
          <div className="text-sm text-muted-foreground">Failed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-500">{stats.skipped}</div>
          <div className="text-sm text-muted-foreground">Skipped</div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Pass Rate</span>
          <span className="text-sm">{stats.passRate}%</span>
        </div>
        <Progress value={stats.passRate} className="h-2" />
      </div>

      <ScrollArea className="h-[300px]">
        <div className="space-y-2">
          {results.map((result) => (
            <div 
              key={result.id}
              className="flex items-center justify-between p-2 rounded-lg bg-muted"
            >
              <div className="flex items-center gap-2">
                {statusIcons[result.status]}
                <span className="font-medium">{result.testName}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {result.duration}ms
                </span>
                {result.coverage && (
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <BarChart2 className="w-4 h-4" />
                    {result.coverage.lines}% coverage
                  </span>
                )}
                <Badge variant={result.status === 'passed' ? 'default' : 'destructive'}>
                  {result.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  )
}

export default TestResults 