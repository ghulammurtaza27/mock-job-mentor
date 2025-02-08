import { Router } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// Get project analytics
router.get('/project/:projectId', async (req, res) => {
  try {
    // Get ticket statistics
    const { data: ticketStats, error: ticketError } = await supabase
      .from('tickets')
      .select('status, priority')
      .eq('project_id', req.params.projectId);

    if (ticketError) throw ticketError;

    // Get code review metrics
    const { data: reviewMetrics, error: reviewError } = await supabase
      .from('code_reviews')
      .select('status, created_at, resolved_at')
      .eq('project_id', req.params.projectId);

    if (reviewError) throw reviewError;

    // Get deployment statistics
    const { data: deployments, error: deployError } = await supabase
      .from('deployments')
      .select('status, environment, created_at')
      .eq('project_id', req.params.projectId);

    if (deployError) throw deployError;

    // Calculate metrics
    const metrics = {
      tickets: {
        total: ticketStats.length,
        byStatus: ticketStats.reduce((acc, t) => ({
          ...acc,
          [t.status]: (acc[t.status] || 0) + 1
        }), {}),
        byPriority: ticketStats.reduce((acc, t) => ({
          ...acc,
          [t.priority]: (acc[t.priority] || 0) + 1
        }), {})
      },
      codeReviews: {
        total: reviewMetrics.length,
        averageResolutionTime: calculateAverageTime(reviewMetrics),
        pendingReviews: reviewMetrics.filter(r => r.status === 'pending').length
      },
      deployments: {
        total: deployments.length,
        successRate: calculateSuccessRate(deployments),
        byEnvironment: deployments.reduce((acc, d) => ({
          ...acc,
          [d.environment]: (acc[d.environment] || 0) + 1
        }), {})
      }
    };

    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user activity analytics
router.get('/user/:userId', async (req, res) => {
  try {
    const { data: userActivity, error } = await supabase
      .from('user_activity')
      .select('*')
      .eq('user_id', req.params.userId)
      .order('timestamp', { ascending: false });

    if (error) throw error;

    const metrics = {
      totalActions: userActivity.length,
      actionsByType: userActivity.reduce((acc, action) => ({
        ...acc,
        [action.type]: (acc[action.type] || 0) + 1
      }), {}),
      recentActivity: userActivity.slice(0, 10)
    };

    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 