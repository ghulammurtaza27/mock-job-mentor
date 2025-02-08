import { supabase } from '@/lib/supabase'

export interface CreateActivityParams {
  ticketId: string
  type: 'comment' | 'status_change' | 'commit' | 'review' | 'subtask'
  content: string
  metadata?: Record<string, any>
}

export class ActivityService {
  static async createActivity(params: CreateActivityParams) {
    const session = await supabase.auth.getSession()
    if (!session.data.session) throw new Error('Not authenticated')

    const { error } = await supabase
      .from('activities')
      .insert({
        ticket_id: params.ticketId,
        user_id: session.data.session.user.id,
        type: params.type,
        content: params.content,
        metadata: params.metadata
      })

    if (error) throw error
  }

  static async getActivities(ticketId: string) {
    const { data, error } = await supabase
      .from('activities')
      .select(`
        *,
        users (
          id,
          name,
          avatar_url
        )
      `)
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }
} 