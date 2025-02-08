import { Router } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// Get all infrastructure resources
router.get('/resources', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('infrastructure_resources')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new infrastructure resource
router.post('/resources', async (req, res) => {
  const { name, type, config } = req.body;

  try {
    const { data, error } = await supabase
      .from('infrastructure_resources')
      .insert({
        name,
        type,
        status: 'creating',
        config
      })
      .select()
      .single();

    if (error) throw error;

    // TODO: Trigger actual infrastructure creation
    // This would typically involve calling cloud provider APIs

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update resource status
router.patch('/resources/:id/status', async (req, res) => {
  const { status } = req.body;

  try {
    const { data, error } = await supabase
      .from('infrastructure_resources')
      .update({ status, updated_at: new Date() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete infrastructure resource
router.delete('/resources/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('infrastructure_resources')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 