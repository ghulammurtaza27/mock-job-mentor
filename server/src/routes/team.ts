import { Router } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// Get team members and their status
router.get('/members', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select(`
        *,
        user:user_id (
          id,
          name,
          avatar_url,
          email
        ),
        current_task:current_ticket_id (
          id,
          title,
          status
        )
      `);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get team activity feed
router.get('/activity', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('team_activity')
      .select(`
        *,
        user:user_id (
          name,
          avatar_url
        ),
        ticket:ticket_id (
          title
        )
      `)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Schedule team meeting
router.post('/meetings', async (req, res) => {
  const { title, type, scheduledFor, participants, description } = req.body;

  try {
    const { data, error } = await supabase
      .from('team_meetings')
      .insert({
        title,
        type,
        scheduled_for: scheduledFor,
        participants,
        description
      })
      .select()
      .single();

    if (error) throw error;

    // Send notifications to participants
    const notifications = participants.map(userId => ({
      user_id: userId,
      type: 'meeting_scheduled',
      title: 'New Team Meeting',
      message: `You have been invited to ${title}`,
      metadata: {
        meeting_id: data.id,
        scheduled_for: scheduledFor
      }
    }));

    await supabase.from('notifications').insert(notifications);

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 