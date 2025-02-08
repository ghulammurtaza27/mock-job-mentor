import { supabase } from '@/lib/supabase'

export interface CodeReviewComment {
  id: string
  filePath: string
  lineNumber: number
  content: string
  type: 'suggestion' | 'issue' | 'praise'
  severity?: 'low' | 'medium' | 'high'
  author: {
    id: string
    name: string
    avatar?: string
  }
  createdAt: Date
  resolved?: boolean
}

export interface AutomatedReviewResult {
  comments: CodeReviewComment[]
  summary: {
    suggestions: number
    issues: number
    praise: number
    overallScore: number
  }
  bestPractices: {
    followed: string[]
    violations: string[]
  }
}

export class CodeReviewService {
  static async runAutomatedReview(
    ticketId: string, 
    files: Record<string, string>
  ): Promise<AutomatedReviewResult> {
    try {
      const { data: review, error } = await supabase.functions.invoke('automated-review', {
        body: { ticketId, files }
      })

      if (error) throw error

      // Save review results
      await this.saveReviewResults(ticketId, review)

      return review
    } catch (error) {
      console.error('Error running automated review:', error)
      throw error
    }
  }

  static async saveReviewResults(ticketId: string, review: AutomatedReviewResult) {
    const { error } = await supabase
      .from('code_reviews')
      .insert({
        ticket_id: ticketId,
        review_data: review,
        type: 'automated',
        created_at: new Date().toISOString()
      })

    if (error) throw error
  }

  static async getReviewHistory(ticketId: string) {
    const { data, error } = await supabase
      .from('code_reviews')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  static async addComment(
    ticketId: string,
    comment: Omit<CodeReviewComment, 'id' | 'author' | 'createdAt'>
  ) {
    const session = await supabase.auth.getSession()
    if (!session.data.session) throw new Error('Not authenticated')

    const { error } = await supabase
      .from('review_comments')
      .insert({
        ticket_id: ticketId,
        ...comment,
        author_id: session.data.session.user.id,
        created_at: new Date().toISOString()
      })

    if (error) throw error
  }

  static async resolveComment(commentId: string) {
    const { error } = await supabase
      .from('review_comments')
      .update({ resolved: true })
      .eq('id', commentId)

    if (error) throw error
  }
} 