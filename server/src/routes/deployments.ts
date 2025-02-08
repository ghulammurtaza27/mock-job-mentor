import { Router } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// Get all deployments
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('deployments')
      .select(`
        *,
        ticket:ticket_id (
          title,
          status
        ),
        user:user_id (
          name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new deployment
router.post('/', async (req, res) => {
  const { ticketId, userId, environment, version } = req.body;

  try {
    const { data, error } = await supabase
      .from('deployments')
      .insert({
        ticket_id: ticketId,
        user_id: userId,
        environment,
        version,
        status: 'pending',
        logs: 'Initializing deployment...'
      })
      .select()
      .single();

    if (error) throw error;

    // Create notification for team
    await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type: 'deployment',
        title: 'New Deployment Started',
        message: `Deployment to ${environment} has been initiated`,
        metadata: {
          deployment_id: data.id,
          environment
        }
      });

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update deployment status and logs
router.patch('/:id', async (req, res) => {
  const { status, logs } = req.body;

  try {
    const { data, error } = await supabase
      .from('deployments')
      .update({
        status,
        logs: logs ? logs : undefined,
        updated_at: new Date()
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get deployment logs
router.get('/:id/logs', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('deployments')
      .select('logs')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 