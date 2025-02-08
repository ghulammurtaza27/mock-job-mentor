import { Router } from 'express';
import { supabase } from '../lib/supabase';
import { validateTicket } from '../middleware/validation';

const router = Router();

// Get all tickets
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        assigned_to (
          id,
          name,
          avatar_url
        ),
        code_reviews (
          id,
          status
        ),
        solutions (
          id,
          status
        )
      `);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get ticket by ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        assigned_to (
          id,
          name,
          avatar_url
        ),
        code_reviews (
          *
        ),
        solutions (
          *
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

// Create ticket
router.post('/', validateTicket, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .insert(req.body)
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update ticket
router.patch('/:id', validateTicket, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 