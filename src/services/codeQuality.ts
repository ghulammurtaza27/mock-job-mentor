import { supabase } from '@/lib/supabase'

export interface CodeQualityMetrics {
  complexity: {
    cyclomatic: number
    cognitive: number
  }
  maintainability: {
    index: number
    rating: 'A' | 'B' | 'C' | 'D' | 'F'
  }
  duplication: {
    percentage: number
    instances: number
  }
  issues: {
    errors: number
    warnings: number
    info: number
  }
  coverage: {
    statements: number
    branches: number
    functions: number
    lines: number
  }
}

export class CodeQualityService {
  static async analyzeCode(files: Record<string, string>): Promise<CodeQualityMetrics> {
    try {
      const { data: metrics, error } = await supabase.functions.invoke('analyze-code', {
        body: { files }
      })

      if (error) throw error
      return metrics
    } catch (error) {
      console.error('Error analyzing code:', error)
      throw error
    }
  }

  static async saveMetrics(ticketId: string, metrics: CodeQualityMetrics) {
    const { error } = await supabase
      .from('code_quality_metrics')
      .insert({
        ticket_id: ticketId,
        metrics,
        created_at: new Date().toISOString()
      })

    if (error) throw error
  }

  static async getMetricsHistory(ticketId: string) {
    const { data, error } = await supabase
      .from('code_quality_metrics')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data
  }
} 