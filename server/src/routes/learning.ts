import { Router } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// Get all learning paths
router.get('/paths', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('learning_paths')
      .select(`
        *,
        learning_steps (
          id,
          title,
          description,
          type,
          duration
        )
      `);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's learning progress
router.get('/progress/:userId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('user_learning_progress')
      .select(`
        *,
        step:learning_steps (
          id,
          title,
          path_id
        )
      `)
      .eq('user_id', req.params.userId);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update learning progress
router.post('/progress', async (req, res) => {
  const { userId, stepId, status, completedAt } = req.body;

  try {
    const { data, error } = await supabase
      .from('user_learning_progress')
      .upsert({
        user_id: userId,
        step_id: stepId,
        status,
        completed_at: completedAt
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 