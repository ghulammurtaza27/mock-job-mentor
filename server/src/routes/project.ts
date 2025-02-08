import { Router } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// Get project overview
router.get('/:projectId', async (req, res) => {
  try {
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select(`
        *,
        team_members:project_members (
          user:user_id (
            id,
            name,
            avatar_url,
            role
          )
        ),
        repositories (
          id,
          name,
          url
        )
      `)
      .eq('id', req.params.projectId)
      .single();

    if (projectError) throw projectError;

    const { data: metrics, error: metricsError } = await supabase
      .from('project_metrics')
      .select('*')
      .eq('project_id', req.params.projectId)
      .single();

    if (metricsError) throw metricsError;

    res.json({
      ...project,
      metrics
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update project settings
router.patch('/:projectId/settings', async (req, res) => {
  const { settings } = req.body;

  try {
    const { data, error } = await supabase
      .from('projects')
      .update({ settings })
      .eq('id', req.params.projectId)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add team member to project
router.post('/:projectId/members', async (req, res) => {
  const { userId, role } = req.body;

  try {
    const { data, error } = await supabase
      .from('project_members')
      .insert({
        project_id: req.params.projectId,
        user_id: userId,
        role
      })
      .select()
      .single();

    if (error) throw error;

    // Send notification to user
    await supabase.from('notifications').insert({
      user_id: userId,
      type: 'project_invitation',
      title: 'Project Invitation',
      message: `You have been added to a new project`,
      metadata: {
        project_id: req.params.projectId,
        role
      }
    });

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 