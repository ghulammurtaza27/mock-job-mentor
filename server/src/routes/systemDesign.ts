import { Router } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// Get all system designs
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('system_designs')
      .select(`
        *,
        author:author_id (
          id,
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

// Get system design by ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('system_designs')
      .select(`
        *,
        author:author_id (
          id,
          name,
          avatar_url
        )
      `)
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new system design
router.post('/', async (req, res) => {
  const { title, description, content, authorId } = req.body;

  try {
    const { data, error } = await supabase
      .from('system_designs')
      .insert({
        title,
        description,
        content,
        author_id: authorId
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