import { Router } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// Get resource allocations
router.get('/allocations', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('resource_allocations')
      .select(`
        *,
        user:user_id (
          id,
          name,
          avatar_url,
          role
        ),
        project:project_id (
          id,
          name
        )
      `)
      .order('start_date', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Allocate resource to project
router.post('/allocate', async (req, res) => {
  const { userId, projectId, startDate, endDate, allocation, role } = req.body;

  try {
    // Check for conflicts
    const { data: conflicts, error: conflictError } = await supabase
      .from('resource_allocations')
      .select('*')
      .eq('user_id', userId)
      .overlaps('start_date', 'end_date', startDate, endDate);

    if (conflictError) throw conflictError;

    if (conflicts && conflicts.length > 0) {
      return res.status(409).json({
        error: 'Resource has conflicting allocations during this period'
      });
    }

    // Create allocation
    const { data, error } = await supabase
      .from('resource_allocations')
      .insert({
        user_id: userId,
        project_id: projectId,
        start_date: startDate,
        end_date: endDate,
        allocation_percentage: allocation,
        role
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get resource capacity
router.get('/capacity/:userId', async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const { data: allocations, error } = await supabase
      .from('resource_allocations')
      .select('*')
      .eq('user_id', req.params.userId)
      .overlaps('start_date', 'end_date', startDate as string, endDate as string);

    if (error) throw error;

    const capacity = calculateCapacity(allocations, startDate as string, endDate as string);
    res.json(capacity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 