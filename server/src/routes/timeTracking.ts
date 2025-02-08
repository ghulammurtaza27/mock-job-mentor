import { Router } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// Log time entry
router.post('/entries', async (req, res) => {
  const { userId, ticketId, duration, description, date, category } = req.body;

  try {
    const { data, error } = await supabase
      .from('time_entries')
      .insert({
        user_id: userId,
        ticket_id: ticketId,
        duration,
        description,
        date,
        category,
        created_at: new Date()
      })
      .select()
      .single();

    if (error) throw error;

    // Update ticket time tracking
    await supabase.rpc('update_ticket_time_spent', {
      p_ticket_id: ticketId,
      p_duration: duration
    });

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get time entries for user
router.get('/user/:userId', async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const { data, error } = await supabase
      .from('time_entries')
      .select(`
        *,
        ticket:ticket_id (
          id,
          title,
          project_id
        )
      `)
      .eq('user_id', req.params.userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (error) throw error;

    const summary = {
      entries: data,
      totalHours: data.reduce((sum, entry) => sum + entry.duration, 0),
      byCategory: data.reduce((acc, entry) => ({
        ...acc,
        [entry.category]: (acc[entry.category] || 0) + entry.duration
      }), {})
    };

    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get project time summary
router.get('/project/:projectId/summary', async (req, res) => {
  try {
    const { data: entries, error } = await supabase
      .from('time_entries')
      .select(`
        *,
        ticket:ticket_id (
          id,
          title,
          type
        ),
        user:user_id (
          name,
          role
        )
      `)
      .eq('project_id', req.params.projectId);

    if (error) throw error;

    const summary = {
      totalHours: entries.reduce((sum, e) => sum + e.duration, 0),
      byUser: groupTimeByUser(entries),
      byTicketType: groupTimeByTicketType(entries),
      byWeek: groupTimeByWeek(entries)
    };

    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 