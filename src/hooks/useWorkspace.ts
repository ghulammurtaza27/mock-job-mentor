import { useState, useCallback } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Ticket, UserRepl } from '@/types/supabase'
import type { WorkspaceMetrics } from '@/types/workspace'

export const useWorkspace = (ticketId: string) => {
  const [metrics, setMetrics] = useState<WorkspaceMetrics>({
    completedTickets: 0,
    totalPoints: 0,
    completedPoints: 0,
    avgTimeToComplete: 0,
    ticketsByStatus: {
      todo: 0,
      in_progress: 0,
      review: 0,
      done: 0
    },
    ticketsByType: {
      bug: 0,
      feature: 0,
      improvement: 0
    }
  })

  const { data: ticket } = useQuery<Ticket>({
    queryKey: ['ticket', ticketId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', ticketId)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!ticketId
  })

  const updateTicketStatus = useMutation({
    mutationFn: async (status: Ticket['status']) => {
      const { error } = await supabase
        .from('tickets')
        .update({ status })
        .eq('id', ticketId)

      if (error) throw error
    },
    onSuccess: () => {
      // Update local metrics
      setMetrics(prev => ({
        ...prev,
        ticketsByStatus: {
          ...prev.ticketsByStatus,
          [ticket?.status || 'todo']: prev.ticketsByStatus[ticket?.status || 'todo'] - 1,
          [status]: prev.ticketsByStatus[status] + 1
        }
      }))
    }
  })

  const fetchMetrics = useCallback(async () => {
    const { data: tickets, error } = await supabase
      .from('tickets')
      .select('*')

    if (error) throw error

    // Calculate metrics
    const newMetrics: WorkspaceMetrics = {
      completedTickets: tickets.filter(t => t.status === 'done').length,
      totalPoints: tickets.reduce((acc, t) => acc + (t.points || 0), 0),
      completedPoints: tickets
        .filter(t => t.status === 'done')
        .reduce((acc, t) => acc + (t.points || 0), 0),
      avgTimeToComplete: calculateAvgTimeToComplete(tickets),
      ticketsByStatus: calculateTicketsByStatus(tickets),
      ticketsByType: calculateTicketsByType(tickets)
    }

    setMetrics(newMetrics)
  }, [])

  return {
    ticket,
    metrics,
    updateTicketStatus,
    fetchMetrics
  }
}

// Helper functions
const calculateAvgTimeToComplete = (tickets: Ticket[]): number => {
  const completedTickets = tickets.filter(t => t.status === 'done' && t.completed_at)
  if (completedTickets.length === 0) return 0

  const totalTime = completedTickets.reduce((acc, t) => {
    const start = new Date(t.created_at)
    const end = new Date(t.completed_at!)
    return acc + (end.getTime() - start.getTime())
  }, 0)

  return Math.round(totalTime / (completedTickets.length * 3600000)) // Convert to hours
}

const calculateTicketsByStatus = (tickets: Ticket[]): Record<Ticket['status'], number> => {
  return tickets.reduce((acc, t) => ({
    ...acc,
    [t.status]: (acc[t.status] || 0) + 1
  }), {} as Record<Ticket['status'], number>)
}

const calculateTicketsByType = (tickets: Ticket[]): Record<Ticket['type'], number> => {
  return tickets.reduce((acc, t) => ({
    ...acc,
    [t.type]: (acc[t.type] || 0) + 1
  }), {} as Record<Ticket['type'], number>)
} 