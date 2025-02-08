import { Router } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// Get active sprint
router.get('/active', async (req, res) => {
  try {
    const { data: sprint, error: sprintError } = await supabase
      .from('sprints')
      .select('*')
      .eq('status', 'active')
      .single();

    if (sprintError) throw sprintError;

    const { data: tickets, error: ticketsError } = await supabase
      .from('tickets')
      .select(`
        *,
        assignee:assigned_to (
          id,
          name,
          avatar_url
        ),
        subtasks (
          id,
          title,
          completed
        )
      `)
      .eq('sprint_id', sprint.id);

    if (ticketsError) throw ticketsError;

    res.json({
      ...sprint,
      tickets
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new sprint
router.post('/', async (req, res) => {
  const { name, startDate, endDate, goals } = req.body;

  try {
    // End current active sprint if exists
    await supabase
      .from('sprints')
      .update({ status: 'completed', completed_at: new Date() })
      .eq('status', 'active');

    // Create new sprint
    const { data, error } = await supabase
      .from('sprints')
      .insert({
        name,
        start_date: startDate,
        end_date: endDate,
        goals,
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add tickets to sprint
router.post('/:sprintId/tickets', async (req, res) => {
  const { ticketIds } = req.body;

  try {
    const { data, error } = await supabase
      .from('tickets')
      .update({ sprint_id: req.params.sprintId })
      .in('id', ticketIds)
      .select();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get sprint metrics
router.get('/:sprintId/metrics', async (req, res) => {
  try {
    const { data: tickets, error } = await supabase
      .from('tickets')
      .select('status, story_points')
      .eq('sprint_id', req.params.sprintId);

    if (error) throw error;

    const metrics = {
      totalPoints: tickets.reduce((sum, t) => sum + (t.story_points || 0), 0),
      completedPoints: tickets
        .filter(t => t.status === 'done')
        .reduce((sum, t) => sum + (t.story_points || 0), 0),
      ticketsByStatus: tickets.reduce((acc, t) => ({
        ...acc,
        [t.status]: (acc[t.status] || 0) + 1
      }), {})
    };

    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 