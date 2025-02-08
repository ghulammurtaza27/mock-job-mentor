import { supabase } from '@/lib/supabase'

export interface TestResult {
  id: string
  ticketId: string
  testName: string
  status: 'passed' | 'failed' | 'skipped'
  duration: number
  errorMessage?: string
  coverage?: {
    statements: number
    branches: number
    functions: number
    lines: number
  }
  timestamp: Date
}

export interface TestSuite {
  id: string
  name: string
  tests: TestCase[]
}

export interface TestCase {
  id: string
  name: string
  code: string
  expectedResult: any
}

export class TestingService {
  static async runTests(ticketId: string, files: Record<string, string>): Promise<TestResult[]> {
    try {
      // Send files to testing endpoint
      const { data: results, error } = await supabase.functions.invoke('run-tests', {
        body: { ticketId, files }
      })

      if (error) throw error

      // Save test results
      await this.saveTestResults(ticketId, results)

      return results
    } catch (error) {
      console.error('Error running tests:', error)
      throw error
    }
  }

  static async saveTestResults(ticketId: string, results: TestResult[]) {
    const { error } = await supabase
      .from('test_results')
      .insert(results.map(result => ({
        ticket_id: ticketId,
        ...result,
        created_at: new Date().toISOString()
      })))

    if (error) throw error
  }

  static async getTestResults(ticketId: string): Promise<TestResult[]> {
    const { data, error } = await supabase
      .from('test_results')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }
} 