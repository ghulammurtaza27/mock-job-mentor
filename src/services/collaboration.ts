import { supabase } from '@/lib/supabase'
import type { User } from '@/types/supabase'

interface CollaborationPresence {
  user: User
  lastSeen: Date
  currentFile?: string
}

export class CollaborationService {
  private channel
  private ticketId: string
  private presenceMap: Map<string, CollaborationPresence>
  private onPresenceUpdate: (presences: CollaborationPresence[]) => void

  constructor(
    ticketId: string, 
    onPresenceUpdate: (presences: CollaborationPresence[]) => void
  ) {
    this.ticketId = ticketId
    this.presenceMap = new Map()
    this.onPresenceUpdate = onPresenceUpdate
    this.channel = supabase.channel(`ticket-collab-${ticketId}`)
  }

  async initialize() {
    const session = await supabase.auth.getSession()
    if (!session.data.session) throw new Error('Not authenticated')

    this.channel
      .on('presence', { event: 'sync' }, () => {
        const presences = this.channel.presenceState()
        this.updatePresences(presences)
      })
      .on('presence', { event: 'join' }, ({ key, newPresence }) => {
        this.presenceMap.set(key, newPresence)
        this.notifyPresenceUpdate()
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        this.presenceMap.delete(key)
        this.notifyPresenceUpdate()
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await this.channel.track({
            user_id: session.data.session.user.id,
            online_at: new Date().toISOString()
          })
        }
      })
  }

  async updateCurrentFile(filePath: string) {
    await this.channel.track({
      current_file: filePath,
      updated_at: new Date().toISOString()
    })
  }

  private updatePresences(presences: Record<string, any>) {
    this.presenceMap.clear()
    Object.entries(presences).forEach(([key, presence]) => {
      this.presenceMap.set(key, presence)
    })
    this.notifyPresenceUpdate()
  }

  private notifyPresenceUpdate() {
    this.onPresenceUpdate(Array.from(this.presenceMap.values()))
  }

  destroy() {
    this.channel.unsubscribe()
  }
} 